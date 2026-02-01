"use client";

import { useState } from "react";
import { Copy, Check, Bell, ArrowRight, Clock, CheckCircle2, AlertCircle } from "lucide-react";

interface WebhookPayload {
  label: string;
  description: string;
  payload: object;
}

const payoutConfirmationPayloads: WebhookPayload[] = [
  {
    label: "Success",
    description: "Payout completed successfully",
    payload: {
      event: "payout.completed",
      timestamp: "2025-11-28T14:39:17.281+00:00",
      data: {
        payout_id: "pay_9y8k3m2n1p",
        user_id: "kxa1234",
        amount: 5000.00,
        currency: "UZS",
        payment_method: "bank_card",
        status: "completed",
        completed_at: "2025-11-28T14:39:17.281+00:00",
        reference: "TXN_ABC123"
      }
    }
  },
  {
    label: "Failed",
    description: "Payout failed",
    payload: {
      event: "payout.failed",
      timestamp: "2025-11-28T14:39:17.281+00:00",
      data: {
        payout_id: "pay_9y8k3m2n1p",
        user_id: "kxa1234",
        amount: 5000.00,
        currency: "UZS",
        payment_method: "bank_card",
        status: "failed",
        error: {
          code: "INSUFFICIENT_FUNDS",
          message: "Insufficient funds in payout account"
        }
      }
    }
  }
];

const paymentNotificationPayloads: WebhookPayload[] = [
  {
    label: "Deposit Completed",
    description: "User deposit completed",
    payload: {
      event: "deposit.completed",
      timestamp: "2025-11-28T13:39:17.281+00:00",
      data: {
        deposit_id: "dep_8x7k2m9n3p",
        user_id: "2564568",
        amount: 100000,
        currency: "UZS",
        payment_method: "bank_card",
        status: "completed",
        completed_at: "2025-11-28T13:39:17.281+00:00",
        reference: "DEP_XYZ789"
      }
    }
  },
  {
    label: "Deposit Pending",
    description: "Deposit awaiting confirmation",
    payload: {
      event: "deposit.pending",
      timestamp: "2025-11-28T12:45:00.000+00:00",
      data: {
        deposit_id: "dep_8x7k2m9n3p",
        user_id: "2564568",
        amount: 100000,
        currency: "UZS",
        payment_method: "bank_card",
        status: "pending",
        message: "Awaiting payment confirmation"
      }
    }
  },
  {
    label: "Deposit Failed",
    description: "Deposit failed or cancelled",
    payload: {
      event: "deposit.failed",
      timestamp: "2025-11-28T13:00:00.000+00:00",
      data: {
        deposit_id: "dep_8x7k2m9n3p",
        user_id: "2564568",
        amount: 100000,
        currency: "UZS",
        payment_method: "bank_card",
        status: "failed",
        error: {
          code: "PAYMENT_CANCELLED",
          message: "Payment was cancelled by user"
        }
      }
    }
  }
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 rounded-md bg-background/80 hover:bg-background border border-border/50 transition-all duration-200 cursor-pointer"
      aria-label={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-600" />
      ) : (
        <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
      )}
    </button>
  );
}

function WebhookPayloadViewer({ payloads }: { payloads: WebhookPayload[] }) {
  const [activePayload, setActivePayload] = useState(0);
  const currentPayload = payloads[activePayload];
  const jsonString = JSON.stringify(currentPayload.payload, null, 2);

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      {/* Tabs */}
      <div className="flex border-b border-border bg-muted/50">
        {payloads.map((payload, index) => (
          <button
            key={payload.label}
            onClick={() => setActivePayload(index)}
            className={`px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
              activePayload === index
                ? "bg-background text-foreground border-b-2 border-[#002395]"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            {payload.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-muted-foreground mb-4">{currentPayload.description}</p>
        <div className="relative">
          <pre className="font-mono text-sm leading-relaxed overflow-x-auto p-4 rounded-md bg-[#f5f5f5] border border-border/50">
            <code>{jsonString}</code>
          </pre>
          <div className="absolute top-3 right-3">
            <CopyButton text={jsonString} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function WebhooksContent() {
  return (
    <div className="space-y-8">
      <p className="text-foreground">
        Webhooks provide real-time notifications for payment events. Configure your webhook
        endpoints to receive status updates for deposits and payouts.
      </p>

      {/* Webhook Setup Info */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-8 rounded-full bg-[#002395]/10 flex items-center justify-center">
              <Bell className="w-4 h-4 text-[#002395]" />
            </span>
            <span className="font-semibold text-foreground">Event-Driven</span>
          </div>
          <p className="text-sm text-muted-foreground">Webhooks are sent immediately when events occur</p>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-8 rounded-full bg-[#002395]/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#002395]" />
            </span>
            <span className="font-semibold text-foreground">Retry Logic</span>
          </div>
          <p className="text-sm text-muted-foreground">Failed webhooks are retried up to 3 times</p>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-8 rounded-full bg-[#002395]/10 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-[#002395]" />
            </span>
            <span className="font-semibold text-foreground">Response</span>
          </div>
          <p className="text-sm text-muted-foreground">Return HTTP 200 to acknowledge receipt</p>
        </div>
      </div>

      {/* Section 6.1: Payout Confirmation Webhook */}
      <div id="webhook-confirmation" className="scroll-mt-8">
        <h3 className="text-xl font-semibold text-foreground mb-4">6.1 Webhook 1: Payout Confirmation</h3>
        <p className="text-muted-foreground mb-4">
          This webhook is triggered when a payout request has been processed. You will receive notifications for both successful completions and failures.
        </p>
        
        <div className="flex items-center gap-2 mb-4 p-3 rounded-md bg-muted/50 border border-border">
          <span className="px-2 py-1 text-xs font-bold rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono">
            POST
          </span>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <code className="text-sm font-mono text-foreground">
            https://your-domain.com/webhooks/payout
          </code>
        </div>
        
        <WebhookPayloadViewer payloads={payoutConfirmationPayloads} />
      </div>

      {/* Section 6.2: Payment Notification Webhook */}
      <div id="webhook-notification" className="scroll-mt-8">
        <h3 className="text-xl font-semibold text-foreground mb-4">6.2 Webhook 2: Payment Notification</h3>
        <p className="text-muted-foreground mb-4">
          This webhook is triggered for deposit-related events including pending, completed, and failed statuses.
        </p>
        
        <div className="flex items-center gap-2 mb-4 p-3 rounded-md bg-muted/50 border border-border">
          <span className="px-2 py-1 text-xs font-bold rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono">
            POST
          </span>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <code className="text-sm font-mono text-foreground">
            https://your-domain.com/webhooks/deposit
          </code>
        </div>
        
        <WebhookPayloadViewer payloads={paymentNotificationPayloads} />
      </div>

      {/* Webhook Security Note */}
      <div className="p-5 bg-[#002395]/5 border border-[#002395]/20 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#002395] mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-foreground mb-2">Webhook Security</h4>
            <p className="text-sm text-muted-foreground">
              Always verify webhook signatures before processing. Each webhook includes an 
              <code className="mx-1 px-1.5 py-0.5 bg-muted rounded text-xs">X-Signature</code> 
              header that should be validated using the same HMAC SHA256 process described in the Authorization section.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
