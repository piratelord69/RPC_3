// src/components/CheckWallet.tsx
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSanctionCheck } from "@/hooks/useSanctionCheck"; // Import the updated hook
import { Loader2, AlertCircle, CheckCircle, Search } from 'lucide-react'; // Import icons

export const CheckWallet: React.FC = () => {
  const [address, setAddress] = useState("");
  // Use the updated hook
  const { checkWallet, isListLoading, isChecking, result, error } = useSanctionCheck();

  const handleCheck = () => {
    checkWallet(address);
  };

  const isLoading = isListLoading || isChecking; // Combined loading state for button

  return (
    <div className="space-y-4 max-w-2xl mx-auto p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
      {/* Input and Button Row */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Enter Ethereum Wallet Address (e.g., 0x...)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={isLoading}
          className="flex-grow dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <Button
          onClick={handleCheck}
          disabled={isLoading || !address || isListLoading} // Disable if loading or no address
          className="w-full sm:w-auto"
        >
          {isListLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading List...
            </>
          ) : isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
             <>
               <Search className="mr-2 h-4 w-4" />
               Check Wallet
             </>
          )}
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 border border-red-200 bg-red-50 rounded-md text-red-700 dark:bg-red-900/30 dark:border-red-700/50 dark:text-red-300 flex items-center gap-2">
           <AlertCircle className="h-5 w-5 flex-shrink-0" />
           <span>{error}</span>
        </div>
      )}

      {/* Result Display */}
      {result && !error && ( // Only show result if no error occurred during the check
        <div className="p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-md space-y-2">
           <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Check Result for:</h3>
           <p className="text-sm font-mono break-all text-gray-600 dark:text-gray-400">{result.addressChecked}</p>

           <div className={`flex items-center gap-2 p-2 rounded ${
               result.isSanctioned || result.interactedWithSanctioned
               ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200'
               : 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200'
           }`}>
               {result.isSanctioned || result.interactedWithSanctioned ? (
                   <AlertCircle className="h-5 w-5 flex-shrink-0" />
               ) : (
                   <CheckCircle className="h-5 w-5 flex-shrink-0" />
               )}
               <span className="font-bold">
                   {result.isSanctioned || result.interactedWithSanctioned ? "Sanction Risk Detected" : "No Sanction Risk Detected"}
               </span>
           </div>

           <p className="text-sm text-gray-700 dark:text-gray-300">{result.reason}</p>

           {/* Optional: Display the specific interaction address if relevant */}
           {result.interactedWithSanctioned && (
               <p className="text-xs text-gray-500 dark:text-gray-400 font-mono break-all">
                   Interaction detected with: {result.interactedWithSanctioned}
               </p>
           )}
        </div>
      )}
    </div>
  );
};
