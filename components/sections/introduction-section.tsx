"use client";

import { Check, Server, Shield, Zap } from "lucide-react";

export function IntroductionSection() {
  return (
    <section id="introduction" className="section border-b border-border scroll-mt-8">
      <div className="flex items-baseline gap-4 mb-8">
        <span className="text-5xl font-bold text-[#002395]">1</span>
        <h2 className="text-3xl font-bold text-foreground !mt-0 !mb-0">Introduction</h2>
      </div>

      <div className="max-w-3xl">
        <p className="text-lg text-foreground leading-relaxed">
          This documentation provides comprehensive guidance for using the Public API for payment
          processing. The API is designed for agents and partners who wish to integrate payment
          services into their platforms.
        </p>

        <div className="mt-8 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 !mt-0">
            The API provides the following capabilities:
          </h3>
          <ul className="space-y-3">
            {[
              { icon: Shield, text: "User validation and verification" },
              { icon: Zap, text: "Deposit creation and processing" },
              { icon: Server, text: "Payout initiation and management" },
              { icon: Check, text: "Real-time webhook notifications" },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded bg-[#002395]/10 flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-[#002395]" />
                </span>
                <span className="text-foreground">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 bg-muted rounded border-l-4 border-[#002395]">
          <p className="font-semibold text-foreground mb-1">Base URL</p>
          <p className="text-muted-foreground text-sm mb-2">
            All API endpoints are accessed via HTTPS. Contact your account manager to obtain the
            base URL and API credentials.
          </p>
          <code className="inline-block px-3 py-1.5 bg-background rounded text-sm font-mono text-foreground">
            https://api.example.com/v4
          </code>
        </div>
      </div>
    </section>
  );
}
