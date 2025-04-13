// src/hooks/useSanctionCheck.ts
import { useState, useEffect, useCallback } from "react";
// IMPORTANT SECURITY WARNING:
// Including functions like getAccessToken, rotateCredentials, and getActiveCredentials
// directly in your frontend code implies handling sensitive credentials (like API keys
// or OAuth tokens) in the browser. This is generally insecure and NOT recommended for
// production applications. Anyone can inspect your frontend code and potentially steal
// these credentials. Consider using a backend proxy to handle BigQuery requests securely.
// This code proceeds under the assumption you understand and accept these risks,
// potentially for a hackathon demo or internal tool where risks are mitigated.
import { getAccessToken, rotateCredentials, getActiveCredentials } from "@/lib/BigQueryAuth"; // Assuming this exists and works

// URL for the OFAC sanctioned Ethereum addresses list
const CSV_URL =
  "https://raw.githubusercontent.com/ultrasoundmoney/ofac-ethereum-addresses/main/data.csv"; // Using main branch for potentially fresher data

// Define the structure for the check result
interface SanctionCheckResult {
  addressChecked: string; // The address that was checked
  isSanctioned: boolean; // Is the address itself sanctioned?
  interactedWithSanctioned: string | null; // Address it interacted with, or null
  reason: string; // Explanation of the result
}

export function useSanctionCheck() {
  const [sanctionedAddresses, setSanctionedAddresses] = useState<Set<string>>(new Set());
  const [isListLoading, setIsListLoading] = useState(true); // State for CSV loading
  const [isChecking, setIsChecking] = useState(false); // State for BigQuery check
  const [result, setResult] = useState<SanctionCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Fetch and parse the sanction list CSV when the hook mounts
  useEffect(() => {
    const fetchSanctionList = async () => {
      setIsListLoading(true);
      setError(null); // Clear previous errors
      try {
        const response = await fetch(CSV_URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch sanction list: ${response.statusText}`);
        }
        const text = await response.text();

        // *** FIXED: Parse SECOND column (index 1) for the address ***
        const lines = text
          .split("\n")
          .slice(1) // Skip header row
          .map((line) => {
              const columns = line.split(",");
              // Get the second column, trim whitespace, convert to lowercase
              return columns[1]?.trim().toLowerCase();
          })
          .filter(Boolean); // Filter out empty lines or addresses that couldn't be parsed

        setSanctionedAddresses(new Set(lines));
        console.log(`Loaded ${lines.length} sanctioned addresses.`);
      } catch (err: any) {
        console.error("Error fetching sanction list:", err);
        setError(`Error loading sanction list: ${err.message}`);
        setSanctionedAddresses(new Set()); // Ensure list is empty on error
      } finally {
        setIsListLoading(false);
      }
    };

    fetchSanctionList();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Step 2: Function to check a specific wallet address
  const checkWallet = useCallback(async (wallet: string) => {
    // Reset state for a new check
    setIsChecking(true);
    setResult(null);
    setError(null);

    // Validate input
    if (!wallet || !wallet.trim()) {
      setError("Please enter a wallet address.");
      setIsChecking(false);
      return;
    }
    // Basic check for Ethereum address format (optional but recommended)
    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet.trim())) {
         setError("Invalid Ethereum address format.");
         setIsChecking(false);
         return;
    }

    const lowercaseWallet = wallet.trim().toLowerCase();

    // Ensure the sanction list is loaded before proceeding
    if (isListLoading) {
      setError("Sanction list is still loading. Please wait a moment and try again.");
      setIsChecking(false);
      return;
    }
     if (sanctionedAddresses.size === 0 && !error) {
         // If list is empty but no explicit loading error occurred previously
         setError("Sanction list could not be loaded or is empty. Cannot perform check.");
         setIsChecking(false);
         return;
     }


    // 2a: Direct Check - Is the input wallet itself sanctioned?
    if (sanctionedAddresses.has(lowercaseWallet)) {
      setResult({
        addressChecked: wallet,
        isSanctioned: true,
        interactedWithSanctioned: null, // No interaction check needed
        reason: "Address is directly on the sanction list.",
      });
      setIsChecking(false);
      return; // Found direct match, stop here
    }

    // 2b: Interaction Check - Query BigQuery for outgoing transactions
    try {
      const activeCreds = getActiveCredentials(); // Get current credentials (project_id)
      if (!activeCreds?.project_id) {
          throw new Error("BigQuery project ID is not configured.");
      }
      const token = await getAccessToken(); // Get auth token (SECURITY RISK)
      if (!token) {
          throw new Error("Failed to get BigQuery access token.");
      }

      // BigQuery SQL to find addresses the input wallet sent transactions TO
      const query = `
        SELECT DISTINCT LOWER(to_address) as interacted_address
        FROM \`bigquery-public-data.crypto_ethereum.transactions\`
        WHERE from_address = @wallet_address
        AND receipt_status = 1 -- Only successful transactions (Use receipt_status)
        LIMIT 1000 -- Limit results for performance/cost
      `;

      const bigQueryApiUrl = `https://bigquery.googleapis.com/bigquery/v2/projects/${activeCreds.project_id}/queries`;

      const response = await fetch(bigQueryApiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
          queryParameters: [ // Use query parameters for security
             {
                 name: "wallet_address",
                 parameterType: { type: "STRING" },
                 parameterValue: { value: lowercaseWallet }
             }
          ],
          useLegacySql: false,
          timeoutMs: 15000, // Set a timeout
        }),
      });

      // Handle BigQuery API errors
      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json(); // Try to parse error details
        } catch { /* Ignore parsing error */ }
        console.error("BigQuery API Error Response:", errorData);
        const errorMessage = errorData?.error?.message || `HTTP ${response.status} ${response.statusText}`;
        setError(`BigQuery Error: ${errorMessage}.`);
        // Rotate credentials specifically on authentication/permission errors
        if (response.status === 401 || response.status === 403) {
          try {
             rotateCredentials(); // Attempt to rotate (SECURITY RISK)
             setError(prev => prev + " Rotated credentials, please try again.");
          } catch (rotateErr: any) {
             console.error("Credential rotation failed:", rotateErr);
             setError(prev => prev + " Attempted credential rotation failed.");
          }
        }
        setIsChecking(false);
        return;
      }

      // Process successful BigQuery response
      const data = await response.json();
      const interactions: string[] = (data?.rows || []).map((row: any) => row.f[0].v); // Addresses are already lowercase from query

      // Find the first interaction address that is on the sanction list
      const matchedInteraction = interactions.find(addr => sanctionedAddresses.has(addr));

      if (matchedInteraction) {
        // Found interaction with a sanctioned address
        setResult({
          addressChecked: wallet,
          isSanctioned: false, // The checked address itself isn't sanctioned
          interactedWithSanctioned: matchedInteraction,
          reason: `Address interacted with sanctioned address: ${matchedInteraction}`,
        });
      } else {
        // No direct match, no interaction match
        setResult({
          addressChecked: wallet,
          isSanctioned: false,
          interactedWithSanctioned: null,
          reason: "Address is not on the sanction list and no interactions with sanctioned addresses were found (checked last 1000 outgoing txns).",
        });
      }

    } catch (err: any) { // Catch network errors or errors in auth functions
      console.error("Error during wallet check:", err);
      setError(`Failed to check wallet: ${err.message}. Check console for details.`);
      // Optionally attempt credential rotation as a fallback?
      // rotateCredentials();
    } finally {
      setIsChecking(false);
    }
  }, [sanctionedAddresses, isListLoading, error]); // Include dependencies

  // Return state and the check function
  return {
      checkWallet,
      isListLoading, // Let component know if list is loading
      isChecking, // Let component know if BigQuery check is running
      result,
      error
  };
}
