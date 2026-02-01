"use client";

import { HMACSignatureBuilder } from "@/components/interactive/hmac-signature-builder";
import { LiveHMACSignatureCalculator } from "@/components/interactive/live-hmac-signature-calculator";

/**
 * Authorization Content Component
 * 
 * Implements:
 * - Section 2.1: Required Headers table with X-API-Key, X-Timestamp, X-Signature
 * - Section 2.2: Signature String Format with interactive visualization
 * - Section 2.3: HMAC Signature Calculator (interactive tool)
 * - Important notes about timestamp tolerance and key ordering
 */

const requiredHeaders = [
  {
    name: "X-API-Key",
    type: "string",
    description: "Your project API key provided by account manager",
  },
  {
    name: "X-Timestamp",
    type: "integer",
    description: "Unix timestamp of the request (tolerance: ±5 minutes)",
  },
  {
    name: "X-Signature",
    type: "string",
    description: "HMAC SHA256 signature in hexadecimal format",
  },
  {
    name: "Content-Type",
    type: "string",
    description: "Must be application/json for all requests",
  },
];

export function AuthorizationContent() {
  return (
    <div className="space-y-12">
      {/* Section 2.1: Headers */}
      <div id="headers" className="scroll-mt-8">
        <h3 className="text-xl font-semibold text-foreground mb-4">2.1 Required Headers</h3>
        <p className="text-muted-foreground mb-6">
          All API requests must include proper authentication headers using HMAC SHA256 signatures. 
          This ensures secure communication between your application and our API servers.
        </p>
        
        {/* Headers Table */}
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-sm m-0">
            <thead>
              <tr className="bg-[#f0f0f0] border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-foreground">Header</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Description</th>
              </tr>
            </thead>
            <tbody>
              {requiredHeaders.map((header, index) => (
                <tr
                  key={header.name}
                  className={`border-b border-border last:border-b-0 transition-colors hover:bg-muted/50 ${
                    index % 2 === 1 ? "bg-[#fafafa]" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <code className="text-sm font-mono bg-[#002395]/10 text-[#002395] px-2 py-0.5 rounded">
                      {header.name}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-muted-foreground font-mono text-xs">{header.type}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{header.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2.2: Signature String */}
      <div id="signature-string" className="scroll-mt-8">
        <h3 className="text-xl font-semibold text-foreground mb-4">2.2 Signature String Format</h3>
        <p className="text-muted-foreground mb-6">
          The signature string must be constructed in the following exact format. Each parameter is joined 
          with a newline character (<code>\n</code>) to form the complete string that will be signed.
        </p>
        
        {/* Interactive HMAC Signature Builder */}
        <HMACSignatureBuilder />
        
        {/* Parameter Details */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="font-mono text-sm font-bold text-[#002395] mb-2">METHOD</div>
            <p className="text-sm text-muted-foreground">HTTP method (GET, POST, PUT, DELETE)</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="font-mono text-sm font-bold text-[#002395] mb-2">PATH</div>
            <p className="text-sm text-muted-foreground">Request path without domain or query string</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="font-mono text-sm font-bold text-[#002395] mb-2">BODY</div>
            <p className="text-sm text-muted-foreground">Raw JSON body string (key order matters)</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="font-mono text-sm font-bold text-[#002395] mb-2">TIMESTAMP</div>
            <p className="text-sm text-muted-foreground">Unix timestamp matching X-Timestamp header</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="font-mono text-sm font-bold text-[#002395] mb-2">API_KEY</div>
            <p className="text-sm text-muted-foreground">Your project API key from account manager</p>
          </div>
        </div>
      </div>

      {/* Section 2.3: HMAC Signature */}
      <div id="hmac-signature" className="scroll-mt-8">
        <h3 className="text-xl font-semibold text-foreground mb-4">2.3 HMAC Signature Calculation</h3>
        <p className="text-muted-foreground mb-6">
          Calculate the HMAC SHA256 signature and convert to hexadecimal. Use the interactive tool below to test your signature generation logic.
        </p>
        
        {/* Live HMAC Signature Calculator */}
        <LiveHMACSignatureCalculator />
        
        {/* Important Notes */}
        <div className="mt-8 p-6 rounded-lg border-l-4 border-[#002395] bg-[#002395]/5">
          <h4 className="font-semibold text-foreground mb-3">Important Notes</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-[#002395] mt-1">•</span>
              <span>The timestamp tolerance is <strong className="text-foreground">±5 minutes</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#002395] mt-1">•</span>
              <span>The order of keys in the JSON body must match exactly as sent</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#002395] mt-1">•</span>
              <span>Contact your account manager to obtain API keys and secret keys</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
