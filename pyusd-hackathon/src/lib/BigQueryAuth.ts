// src/lib/BigQueryAuth.ts

type ServiceAccount = {
  client_email: string;
  private_key: string;
  token_uri: string;
  project_id: string;
};

const SERVICE_ACCOUNTS: string[] = [
  import.meta.env.VITE_GCP_KEY_1!,
  import.meta.env.VITE_GCP_KEY_2!,
];

let current = 0;
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

export const getActiveCredentials = (): ServiceAccount => {
  const json = SERVICE_ACCOUNTS[current];
  if (!json) throw new Error("Missing GCP key");
  return JSON.parse(atob(json));
};

export const rotateCredentials = () => {
  current = (current + 1) % SERVICE_ACCOUNTS.length;
  cachedToken = null;
};

export const getAccessToken = async (): Promise<string> => {
  const now = Date.now();
  if (cachedToken && now < tokenExpiry - 60_000) return cachedToken;

  const creds = getActiveCredentials();

  const iat = Math.floor(now / 1000);
  const exp = iat + 3600;
  const header = {
    alg: "RS256",
    typ: "JWT"
  };
  const payload = {
    iss: creds.client_email,
    scope: "https://www.googleapis.com/auth/bigquery.readonly",
    aud: creds.token_uri,
    exp,
    iat,
  };

  const base64url = (obj: any) =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

  const toSign = `${base64url(header)}.${base64url(payload)}`;

  const key = await crypto.subtle.importKey(
    "pkcs8",
    str2ab(creds.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(toSign)
  );

  const signedJWT = `${toSign}.${btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")}`;

  const res = await fetch(creds.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: signedJWT,
    }),
  });

  const data = await res.json();
  if (!data.access_token) throw new Error("Failed to fetch token");

  cachedToken = data.access_token;
  tokenExpiry = now + data.expires_in * 1000;

  return cachedToken;
};

function str2ab(str: string): ArrayBuffer {
  const b64 = str.replace(/-----[^-]+-----|\n/g, "");
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}
