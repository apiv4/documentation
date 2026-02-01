"use client";

import {
  APIRequestResponseViewer,
  type APIParameter,
  type APIResponse,
} from "@/components/interactive/api-request-response-viewer";

const depositParameters: APIParameter[] = [
  {
    name: "user_id",
    type: "string",
    required: true,
    description: "User identifier in the project system",
  },
  {
    name: "amount",
    type: "number",
    required: true,
    description: "Deposit amount",
  },
  {
    name: "currency",
    type: "string",
    required: true,
    description: "Currency code (UZS)",
  },
  {
    name: "payment_method",
    type: "string",
    required: true,
    description: "Payment method identifier (see section 7)",
  },
  {
    name: "request_id",
    type: "string",
    required: true,
    description: "Your unique request identifier for idempotency",
  },
  {
    name: "timestamp",
    type: "string",
    required: true,
    description: "ISO 8601 format timestamp",
  },
];

const depositResponses: APIResponse[] = [
  {
    label: "Success",
    status: "success",
    statusCode: 200,
    body: {
      status: "success",
      data: {
        deposit_id: "dep_8x7k2m9n3p",
        user_id: "2564568",
        amount: 100000,
        currency: "UZS",
        payment_method: "bank_card",
        payment_url: "https://pay.example.com/deposit/dep_8x7k2m9n3p",
        expires_at: "2025-11-28T13:39:17.281+00:00",
        status: "pending",
        created_at: "2025-11-28T12:39:17.281+00:00",
      },
    },
  },
  {
    label: "Pending",
    status: "pending",
    statusCode: 202,
    body: {
      status: "pending",
      data: {
        deposit_id: "dep_8x7k2m9n3p",
        user_id: "2564568",
        amount: 100000,
        currency: "UZS",
        status: "processing",
        message: "Deposit is being processed. You will receive a webhook notification upon completion.",
      },
    },
  },
  {
    label: "Error",
    status: "error",
    statusCode: 400,
    body: {
      status: "error",
      error: {
        code: "EXCEEDS_MAX_AMOUNT",
        message: "Amount exceeds maximum allowed limit",
        details: {
          max_amount: 50000000,
          requested_amount: 75000000,
        },
      },
    },
  },
];

const depositStatusCodes = [
  { code: "404", type: "PROJECT_NOT_FOUND", description: "Project not found" },
  { code: "401", type: "INVALID_SIGNATURE", description: "Invalid signature" },
  { code: "403", type: "EXCEEDS_MAX_AMOUNT", description: "Amount exceeds maximum allowed" },
  { code: "400", type: "CURRENCY_NOT_SUPPORTED", description: "Currency not supported" },
  { code: "400", type: "DEPOSIT_ALREADY_PROCESSED", description: "Deposit already created for user" },
  { code: "400", type: "INVALID_STATUS", description: "Invalid status value" },
  { code: "400", type: "UNSUPPORTED_PAYMENT_METHOD", description: "Payment method not supported" },
  { code: "400", type: "VALIDATION_ERROR", description: "Field validation failed" },
  { code: "415", type: "UNSUPPORTED_MEDIA_TYPE", description: "Unsupported data type" },
];

export function DepositCreationContent() {
  return (
    <div className="space-y-8">
      <p className="text-foreground">
        Create a new deposit request for a user. The deposit will be processed and status updates
        will be provided via webhooks.
      </p>

      {/* Section 4.1 & 4.2: Request & Response */}
      <div id="deposit-request" className="scroll-mt-8">
        <h3 id="deposit-response" className="text-xl font-semibold text-foreground mb-4 scroll-mt-8">4.1 Request Details</h3>
        <APIRequestResponseViewer
          endpoint="/api/v4/payments/raisboy/deposit/create"
          method="POST"
          description="Creates a new deposit request and returns a payment URL for the user."
          requestBody={{
            user_id: "2564568",
            amount: 100000,
            currency: "UZS",
            payment_method: "bank_card",
            request_id: "req_abc123xyz",
            timestamp: "2025-11-28T12:39:17.281+00:00",
          }}
          parameters={depositParameters}
          responses={depositResponses}
        />
      </div>

      {/* Section 4.3: Status Codes */}
      <div id="deposit-status" className="scroll-mt-8">
        <h3 className="text-xl font-semibold text-foreground mb-4">4.3 Status Codes</h3>
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-sm m-0">
            <thead>
              <tr className="bg-[#f0f0f0] border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-foreground">Code</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Error Type</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Description</th>
              </tr>
            </thead>
            <tbody>
              {depositStatusCodes.map((error, index) => (
                <tr
                  key={`${error.code}-${error.type}`}
                  className={`border-b border-border last:border-b-0 transition-colors hover:bg-muted/50 ${
                    index % 2 === 1 ? "bg-[#fafafa]" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium ${
                      error.code.startsWith("4") ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {error.code}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-sm font-mono bg-[#f5f5f5] px-1.5 py-0.5 rounded text-[#002395]">
                      {error.type}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{error.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
