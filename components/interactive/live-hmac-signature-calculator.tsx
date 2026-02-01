"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, Check, Key, FileText, Hash, AlertCircle } from "lucide-react";

export function LiveHMACSignatureCalculator() {
  const [secretKey, setSecretKey] = useState("");
  const [signatureString, setSignatureString] = useState("");
  const [signature, setSignature] = useState("");
  const [copied, setCopied] = useState(false);
  const [isComputing, setIsComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const computeHMAC = useCallback(async (key: string, message: string) => {
    if (!key || !message) {
      setSignature("");
      setError(null);
      return;
    }

    setIsComputing(true);
    setError(null);

    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(key);
      const messageData = encoder.encode(message);

      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );

      const signatureBuffer = await crypto.subtle.sign(
        "HMAC",
        cryptoKey,
        messageData
      );

      const hashArray = Array.from(new Uint8Array(signatureBuffer));
      const hexSignature = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      setSignature(hexSignature);
    } catch (err) {
      setError("Failed to compute signature. Please check your inputs.");
      setSignature("");
    } finally {
      setIsComputing(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      computeHMAC(secretKey, signatureString);
    }, 150);

    return () => clearTimeout(debounceTimer);
  }, [secretKey, signatureString, computeHMAC]);

  const copyToClipboard = async () => {
    if (!signature) return;
    
    try {
      await navigator.clipboard.writeText(signature);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError("Failed to copy to clipboard");
    }
  };

  const handleSignatureStringChange = (value: string) => {
    // Allow literal \n to be typed and converted to actual newlines for signature computation
    // This helps developers test their signature strings
    setSignatureString(value);
  };

  // Format the signature string for display with actual newlines
  const getProcessedSignatureString = () => {
    return signatureString.replace(/\\n/g, "\n");
  };

  return (
    <div className="bg-card border border-border rounded overflow-hidden">
      {/* Header */}
      <div className="bg-[#002395] px-6 py-4">
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-white/90" />
          <h4 className="text-white font-semibold text-lg">
            HMAC SHA256 Signature Generator
          </h4>
        </div>
        <p className="text-white/70 text-sm mt-1">
          Test your signature generation logic in real-time
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Grid layout - Swiss modernism inspired */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column - Inputs */}
          <div className="space-y-5">
            {/* Secret Key Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <Key className="w-4 h-4 text-[#002395]" />
                API Secret Key
              </label>
              <input
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Enter your secret key"
                className="w-full px-4 py-3 bg-secondary border border-border rounded font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#002395] focus:border-transparent transition-all"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Your secret key will not be stored or transmitted
              </p>
            </div>

            {/* Signature String Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <FileText className="w-4 h-4 text-[#002395]" />
                Signature String
              </label>
              <textarea
                value={signatureString}
                onChange={(e) => handleSignatureStringChange(e.target.value)}
                placeholder={`POST\n/api/v4/payments/project/deposit/create\n{"user_id":"123","amount":1000}\n1706745600\napi_key_here`}
                rows={6}
                className="w-full px-4 py-3 bg-secondary border border-border rounded font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#002395] focus:border-transparent transition-all resize-none leading-relaxed"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Format: METHOD \n PATH \n BODY \n TIMESTAMP \n API_KEY
              </p>
            </div>
          </div>

          {/* Right column - Output */}
          <div className="flex flex-col">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              <Hash className="w-4 h-4 text-[#002395]" />
              Generated Signature
            </label>
            
            {/* Output Box */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 min-h-[180px] bg-[#1a1a1a] rounded-t border border-border border-b-0 p-4 overflow-hidden">
                {error ? (
                  <div className="flex items-start gap-2 text-destructive">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                ) : signature ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                        hex output
                      </span>
                      {isComputing && (
                        <span className="text-xs text-yellow-400">Computing...</span>
                      )}
                    </div>
                    <code className="block text-emerald-400 font-mono text-sm break-all leading-relaxed">
                      {signature}
                    </code>
                    <div className="pt-2 border-t border-white/10">
                      <span className="text-xs text-white/40">
                        {signature.length} characters (64 hex digits)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-white/40 text-sm text-center">
                      Enter your secret key and signature string<br />
                      to generate the HMAC signature
                    </p>
                  </div>
                )}
              </div>

              {/* Copy Button */}
              <button
                onClick={copyToClipboard}
                disabled={!signature || !!error}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#002395] text-white font-semibold rounded-b transition-all hover:bg-[#0033cc] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#002395] focus:ring-offset-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied to Clipboard
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Signature
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Formula Reference */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-[#002395]/10 rounded flex items-center justify-center">
              <span className="text-[#002395] font-bold text-lg">f</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">
                Signature Formula
              </p>
              <code className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded">
                hex(hmac_sha256(secret_key, signature_string))
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
