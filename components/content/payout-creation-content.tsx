"use client";

import {
  APIRequestResponseViewer,
  type APIParameter,
  type APIResponse,
} from "@/components/interactive/api-request-response-viewer";

const payoutParameters: APIParameter[] = [
  {
    name: "user_id",
    type: "string",
    required: true,
    description: "User identifier in the project",
  },
  {
    name: "amount",
    type: "number",
    required: true,
    description: "Payout amount",
  },
  {
    name: "currency",
    type: "string",
    required: true,
    description: "Currency (UZS)",
  },
  {
    name: "payment_method",
    type: "string",
    required: true,
    description: "Payment method (see section 7)",
  },
  {
    name: "request_id",
    type: "string",
    required: true,
    description: "Your unique request identifier",
  },
  {
    name: "timestamp",
    type: "string",
    required: true,
    description: "ISO 8601 format timestamp",
  },
];

const payoutResponses: APIResponse[] = [
  {
    label: "Success",
    status: "success",
    statusCode: 200,
    body: {
      status: "success",
      data: {
        payout_id: "pay_9y8k3m2n1p",
        user_id: "kxa1234",
        amount: 5000.0,
        currency: "UZS",
        payment_method: "bank_card",
        status: "processing",
        estimated_completion: "2025-11-28T14:39:17.281+00:00",
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
        payout_id: "pay_9y8k3m2n1p",
        user_id: "kxa1234",
        amount: 5000.0,
        currency: "UZS",
        status: "queued",
        message: "Payout request received. Processing will begin shortly.",
        queue_position: 3,
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
        code: "INSUFFICIENT_BALANCE",
        message: "User has insufficient balance for this payout",
        details: {
          available_balance: 3500.0,
          requested_amount: 5000.0,
        },
      },
    },
  },
];

export function PayoutCreationContent() {
  return (
    <div className="space-y-8">
      <p className="text-foreground">
        Initiate a payout request to transfer funds to a user. The payout will be processed
        asynchronously with status updates provided via webhooks.
      </p>

      {/* Section 5.1 & 5.2: Request & Response */}
      <div id="payout-request" className="scroll-mt-8">
        <h3 id="payout-response" className="text-xl font-semibold text-foreground mb-4 scroll-mt-8">5.1 Request Details</h3>
        <APIRequestResponseViewer
          endpoint="/api/payout/create"
          method="POST"
          description="Initiates a payout request to transfer funds to a user's account."
          requestBody={{
            user_id: "kxa1234",
            amount: 5000.0,
            currency: "UZS",
            payment_method: "bank_card",
            request_id: "payout_req_789",
            timestamp: "2025-11-28T12:39:17.281+00:00",
          }}
          parameters={payoutParameters}
          responses={payoutResponses}
        />
      </div>
    </div>
  );
}
