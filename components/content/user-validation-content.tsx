"use client";

import {
  APIRequestResponseViewer,
  type APIParameter,
  type APIResponse,
} from "@/components/interactive/api-request-response-viewer";

const userValidationParameters: APIParameter[] = [
  {
    name: "user_id",
    type: "string",
    required: true,
    description: "User identifier in the project system",
  },
];

const userValidationResponses: APIResponse[] = [
  {
    label: "Success",
    status: "success",
    statusCode: 200,
    body: {
      status: "success",
      data: {
        user_id: "2564568",
        is_valid: true,
        limits: {
          min_deposit: 10000,
          max_deposit: 50000000,
          min_payout: 10000,
          max_payout: 10000000,
        },
        currency: "UZS",
      },
    },
  },
  {
    label: "Not Found",
    status: "error",
    statusCode: 404,
    body: {
      status: "error",
      error: {
        code: "USER_NOT_FOUND",
        message: "User not found in system",
      },
    },
  },
  {
    label: "Prohibited",
    status: "error",
    statusCode: 403,
    body: {
      status: "error",
      error: {
        code: "PROHIBITED_FOR_USER",
        message: "User must contact project support",
      },
    },
  },
];

const validationErrorCodes = [
  { code: "404", type: "USER_NOT_FOUND", description: "User not found in system" },
  { code: "404", type: "PROJECT_NOT_FOUND", description: "Project not found" },
  { code: "403", type: "PROHIBITED_FOR_USER", description: "User must contact project support" },
  { code: "401", type: "INVALID_SIGNATURE", description: "Request signature is invalid" },
  { code: "415", type: "UNSUPPORTED_CONTENT_TYPE", description: "Content-Type not supported" },
  { code: "400", type: "VALIDATION_ERROR", description: "Field validation failed" },
];

export function UserValidationContent() {
  return (
    <div className="space-y-8">
      <p className="text-foreground">
        Validate whether a user exists in the system and retrieve their transaction limits.
      </p>

      {/* Section 3.1 & 3.2: Request & Response */}
      <div id="user-request" className="scroll-mt-8">
        <h3 id="user-response" className="text-xl font-semibold text-foreground mb-4 scroll-mt-8">3.1 Request Details</h3>
        <APIRequestResponseViewer
          endpoint="/api/v4/payments/raisboy/validate-user"
          method="POST"
          description="Validates a user and returns their transaction limits if valid."
          requestBody={{ user_id: "2564568" }}
          parameters={userValidationParameters}
          responses={userValidationResponses}
        />
      </div>

      {/* Section 3.3: Error Codes */}
      <div id="user-errors" className="scroll-mt-8">
        <h3 className="text-xl font-semibold text-foreground mb-4">3.3 Error Codes</h3>
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
              {validationErrorCodes.map((error, index) => (
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
