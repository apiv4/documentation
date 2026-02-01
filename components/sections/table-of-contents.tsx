"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

interface TOCItem {
  id: string;
  number: string;
  title: string;
  children?: TOCItem[];
}

const tocItems: TOCItem[] = [
  { id: "introduction", number: "1", title: "Introduction" },
  {
    id: "authorization",
    number: "2",
    title: "Authorization",
    children: [
      { id: "headers", number: "2.1", title: "Headers" },
      { id: "signature-string", number: "2.2", title: "Signature String" },
      { id: "hmac-signature", number: "2.3", title: "HMAC Signature" },
    ],
  },
  {
    id: "user-validation",
    number: "3",
    title: "User Validation Endpoint",
    children: [
      { id: "user-request", number: "3.1", title: "Request" },
      { id: "user-response", number: "3.2", title: "Response" },
      { id: "user-errors", number: "3.3", title: "Error Codes" },
    ],
  },
  {
    id: "deposit-creation",
    number: "4",
    title: "Deposit Creation Endpoint",
    children: [
      { id: "deposit-request", number: "4.1", title: "Request" },
      { id: "deposit-response", number: "4.2", title: "Response" },
      { id: "deposit-status", number: "4.3", title: "Status Codes" },
    ],
  },
  {
    id: "payout-creation",
    number: "5",
    title: "Payout Creation Endpoint",
    children: [
      { id: "payout-request", number: "5.1", title: "Request" },
      { id: "payout-response", number: "5.2", title: "Response" },
    ],
  },
  {
    id: "webhooks",
    number: "6",
    title: "Webhooks",
    children: [
      { id: "webhook-confirmation", number: "6.1", title: "Payout Confirmation" },
      { id: "webhook-notification", number: "6.2", title: "Payment Notification" },
    ],
  },
  { id: "payment-methods", number: "7", title: "Payment Methods" },
  { id: "error-codes", number: "8", title: "Error Codes Reference" },
];

export function TableOfContents() {
  const [activeId, setActiveId] = useState<string>("introduction");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0.1 }
    );

    // Observe all sections
    const allIds = tocItems.flatMap((item) => [
      item.id,
      ...(item.children?.map((child) => child.id) || []),
    ]);

    for (const id of allIds) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="section border-b border-border" aria-label="Table of Contents">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">
        Table of Contents
      </h2>
      <ul className="space-y-1">
        {tocItems.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => handleClick(item.id)}
              className={`group flex items-center gap-3 w-full text-left py-2 px-3 rounded transition-colors cursor-pointer ${
                activeId === item.id
                  ? "bg-[#002395]/5 text-[#002395]"
                  : "text-foreground hover:bg-muted hover:text-[#002395]"
              }`}
            >
              <span className="font-mono text-sm text-muted-foreground w-6">
                {item.number}
              </span>
              <span className="font-medium">{item.title}</span>
              <ChevronRight
                className={`w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity ${
                  activeId === item.id ? "opacity-100" : ""
                }`}
              />
            </button>
            {item.children && (
              <ul className="ml-9 mt-1 space-y-1">
                {item.children.map((child) => (
                  <li key={child.id}>
                    <button
                      type="button"
                      onClick={() => handleClick(child.id)}
                      className={`group flex items-center gap-3 w-full text-left py-1.5 px-3 rounded text-sm transition-colors cursor-pointer ${
                        activeId === child.id
                          ? "bg-[#002395]/5 text-[#002395]"
                          : "text-muted-foreground hover:bg-muted hover:text-[#002395]"
                      }`}
                    >
                      <span className="font-mono text-xs w-6">{child.number}</span>
                      <span>{child.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
