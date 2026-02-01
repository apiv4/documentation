"use client";

import React from "react"

import { useState, useMemo } from "react";
import { Search, X, CreditCard, Building2, Wallet, Smartphone, Globe, ChevronDown, ChevronUp, ArrowUpDown, Check } from "lucide-react";

interface PaymentMethod {
  code: string;
  name: string;
  type: "card" | "bank" | "ewallet" | "mobile" | "other";
  currencies: string[];
  depositLimits: { min: number; max: number };
  payoutLimits: { min: number; max: number };
  supportsDeposit: boolean;
  supportsPayout: boolean;
}

const paymentMethods: PaymentMethod[] = [
  {
    code: "bank_card",
    name: "Bank Card (Visa/Mastercard)",
    type: "card",
    currencies: ["UZS", "USD"],
    depositLimits: { min: 10000, max: 50000000 },
    payoutLimits: { min: 50000, max: 100000000 },
    supportsDeposit: true,
    supportsPayout: true,
  },
  {
    code: "uzcard",
    name: "UzCard",
    type: "card",
    currencies: ["UZS"],
    depositLimits: { min: 5000, max: 30000000 },
    payoutLimits: { min: 10000, max: 50000000 },
    supportsDeposit: true,
    supportsPayout: true,
  },
  {
    code: "humo",
    name: "Humo",
    type: "card",
    currencies: ["UZS"],
    depositLimits: { min: 5000, max: 30000000 },
    payoutLimits: { min: 10000, max: 50000000 },
    supportsDeposit: true,
    supportsPayout: true,
  },
  {
    code: "payme",
    name: "Payme",
    type: "ewallet",
    currencies: ["UZS"],
    depositLimits: { min: 1000, max: 10000000 },
    payoutLimits: { min: 5000, max: 20000000 },
    supportsDeposit: true,
    supportsPayout: true,
  },
  {
    code: "click",
    name: "Click",
    type: "ewallet",
    currencies: ["UZS"],
    depositLimits: { min: 1000, max: 10000000 },
    payoutLimits: { min: 5000, max: 20000000 },
    supportsDeposit: true,
    supportsPayout: true,
  },
  {
    code: "paynet",
    name: "Paynet",
    type: "ewallet",
    currencies: ["UZS"],
    depositLimits: { min: 1000, max: 5000000 },
    payoutLimits: { min: 5000, max: 10000000 },
    supportsDeposit: true,
    supportsPayout: false,
  },
  {
    code: "uzum_bank",
    name: "Uzum Bank",
    type: "bank",
    currencies: ["UZS"],
    depositLimits: { min: 10000, max: 100000000 },
    payoutLimits: { min: 50000, max: 200000000 },
    supportsDeposit: true,
    supportsPayout: true,
  },
  {
    code: "kapitalbank",
    name: "Kapitalbank",
    type: "bank",
    currencies: ["UZS", "USD"],
    depositLimits: { min: 10000, max: 100000000 },
    payoutLimits: { min: 50000, max: 200000000 },
    supportsDeposit: true,
    supportsPayout: true,
  },
  {
    code: "mobile_uzb",
    name: "Mobile Payment UZB",
    type: "mobile",
    currencies: ["UZS"],
    depositLimits: { min: 1000, max: 2000000 },
    payoutLimits: { min: 5000, max: 5000000 },
    supportsDeposit: true,
    supportsPayout: true,
  },
  {
    code: "qiwi",
    name: "QIWI Wallet",
    type: "ewallet",
    currencies: ["UZS", "RUB"],
    depositLimits: { min: 5000, max: 15000000 },
    payoutLimits: { min: 10000, max: 30000000 },
    supportsDeposit: true,
    supportsPayout: true,
  },
  {
    code: "webmoney",
    name: "WebMoney",
    type: "ewallet",
    currencies: ["USD", "EUR"],
    depositLimits: { min: 10, max: 5000 },
    payoutLimits: { min: 20, max: 10000 },
    supportsDeposit: true,
    supportsPayout: false,
  },
  {
    code: "crypto_usdt",
    name: "USDT (TRC-20)",
    type: "other",
    currencies: ["USDT"],
    depositLimits: { min: 10, max: 100000 },
    payoutLimits: { min: 50, max: 50000 },
    supportsDeposit: true,
    supportsPayout: true,
  },
];

type SortField = "code" | "name" | "type" | null;
type SortDirection = "asc" | "desc";
type FilterType = "all" | "card" | "bank" | "ewallet" | "mobile" | "other";

const typeIcons: Record<PaymentMethod["type"], React.ReactNode> = {
  card: <CreditCard className="w-4 h-4" />,
  bank: <Building2 className="w-4 h-4" />,
  ewallet: <Wallet className="w-4 h-4" />,
  mobile: <Smartphone className="w-4 h-4" />,
  other: <Globe className="w-4 h-4" />,
};

const typeLabels: Record<PaymentMethod["type"], string> = {
  card: "Card",
  bank: "Bank",
  ewallet: "E-Wallet",
  mobile: "Mobile",
  other: "Other",
};

function formatAmount(amount: number, currency: string): string {
  if (["USD", "EUR", "USDT"].includes(currency)) {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat("uz-UZ", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function CurrencyBadge({ currency }: { currency: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#002395]/10 text-[#002395] border border-[#002395]/20">
      {currency}
    </span>
  );
}

function TypeBadge({ type }: { type: PaymentMethod["type"] }) {
  const colors: Record<PaymentMethod["type"], string> = {
    card: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bank: "bg-blue-50 text-blue-700 border-blue-200",
    ewallet: "bg-amber-50 text-amber-700 border-amber-200",
    mobile: "bg-rose-50 text-rose-700 border-rose-200",
    other: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border ${colors[type]}`}>
      {typeIcons[type]}
      {typeLabels[type]}
    </span>
  );
}

function SupportBadge({ supported }: { supported: boolean }) {
  return supported ? (
    <span className="inline-flex items-center gap-1 text-emerald-600">
      <Check className="w-4 h-4" />
      <span className="text-sm font-medium">Yes</span>
    </span>
  ) : (
    <span className="text-muted-foreground text-sm">No</span>
  );
}

export function PaymentMethodsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filteredAndSortedMethods = useMemo(() => {
    let result = [...paymentMethods];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (method) =>
          method.code.toLowerCase().includes(query) ||
          method.name.toLowerCase().includes(query) ||
          method.currencies.some((c) => c.toLowerCase().includes(query))
      );
    }

    // Filter by type
    if (filterType !== "all") {
      result = result.filter((method) => method.type === filterType);
    }

    // Sort
    if (sortField) {
      result.sort((a, b) => {
        let comparison = 0;
        if (sortField === "code") {
          comparison = a.code.localeCompare(b.code);
        } else if (sortField === "name") {
          comparison = a.name.localeCompare(b.name);
        } else if (sortField === "type") {
          comparison = a.type.localeCompare(b.type);
        }
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [searchQuery, filterType, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="inline-flex items-center gap-1 hover:text-[#002395] transition-colors cursor-pointer group"
    >
      {children}
      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
        {sortField === field ? (
          sortDirection === "asc" ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )
        ) : (
          <ArrowUpDown className="w-3.5 h-3.5" />
        )}
      </span>
      {sortField === field && (
        <span className="opacity-100">
          {sortDirection === "asc" ? (
            <ChevronUp className="w-3.5 h-3.5 text-[#002395]" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[#002395]" />
          )}
        </span>
      )}
    </button>
  );

  const filterButtons: { value: FilterType; label: string; icon?: React.ReactNode }[] = [
    { value: "all", label: "All" },
    { value: "card", label: "Cards", icon: <CreditCard className="w-3.5 h-3.5" /> },
    { value: "bank", label: "Banks", icon: <Building2 className="w-3.5 h-3.5" /> },
    { value: "ewallet", label: "E-Wallets", icon: <Wallet className="w-3.5 h-3.5" /> },
    { value: "mobile", label: "Mobile", icon: <Smartphone className="w-3.5 h-3.5" /> },
    { value: "other", label: "Other", icon: <Globe className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-6">
      <p className="text-foreground">
        The following payment methods are supported for deposits and payouts. Use the{" "}
        <code className="text-sm">payment_method</code> code when making API requests to the Deposit
        Creation or Payout Creation endpoints.
      </p>

      {/* Search and Filter Bar */}
      <div className="bg-secondary/50 rounded-lg p-4 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by method code, name, or currency..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#002395]/20 focus:border-[#002395] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilterType(btn.value)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                filterType === btn.value
                  ? "bg-[#002395] text-white"
                  : "bg-background border border-border text-foreground hover:border-[#002395]/50 hover:text-[#002395]"
              }`}
            >
              {btn.icon}
              {btn.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredAndSortedMethods.length} of {paymentMethods.length} payment methods
        </div>
      </div>

      {/* Payment Methods Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full !my-0">
            <thead>
              <tr className="bg-[#002395]/5">
                <th className="!bg-transparent text-left px-4 py-3 text-sm font-semibold text-foreground border-b-2 border-[#002395]/20">
                  <SortButton field="code">Method Code</SortButton>
                </th>
                <th className="!bg-transparent text-left px-4 py-3 text-sm font-semibold text-foreground border-b-2 border-[#002395]/20">
                  <SortButton field="name">Name</SortButton>
                </th>
                <th className="!bg-transparent text-left px-4 py-3 text-sm font-semibold text-foreground border-b-2 border-[#002395]/20">
                  <SortButton field="type">Type</SortButton>
                </th>
                <th className="!bg-transparent text-left px-4 py-3 text-sm font-semibold text-foreground border-b-2 border-[#002395]/20">
                  Currencies
                </th>
                <th className="!bg-transparent text-center px-4 py-3 text-sm font-semibold text-foreground border-b-2 border-[#002395]/20">
                  Deposit
                </th>
                <th className="!bg-transparent text-center px-4 py-3 text-sm font-semibold text-foreground border-b-2 border-[#002395]/20">
                  Payout
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedMethods.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground !bg-transparent">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 opacity-40" />
                      <p>No payment methods found matching your criteria.</p>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setFilterType("all");
                        }}
                        className="text-[#002395] hover:underline cursor-pointer"
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAndSortedMethods.map((method, index) => (
                  <React.Fragment key={method.code}>
                    <tr
                      onClick={() => setExpandedRow(expandedRow === method.code ? null : method.code)}
                      className={`cursor-pointer transition-colors hover:bg-[#002395]/5 ${
                        index % 2 === 0 ? "" : "bg-secondary/30"
                      } ${expandedRow === method.code ? "bg-[#002395]/5" : ""}`}
                    >
                      <td className="px-4 py-3 !bg-transparent border-b border-border">
                        <code className="text-sm font-mono bg-[#002395]/10 text-[#002395] px-2 py-0.5 rounded">
                          {method.code}
                        </code>
                      </td>
                      <td className="px-4 py-3 !bg-transparent border-b border-border">
                        <span className="font-medium text-foreground">{method.name}</span>
                      </td>
                      <td className="px-4 py-3 !bg-transparent border-b border-border">
                        <TypeBadge type={method.type} />
                      </td>
                      <td className="px-4 py-3 !bg-transparent border-b border-border">
                        <div className="flex flex-wrap gap-1">
                          {method.currencies.map((currency) => (
                            <CurrencyBadge key={currency} currency={currency} />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 !bg-transparent border-b border-border text-center">
                        <SupportBadge supported={method.supportsDeposit} />
                      </td>
                      <td className="px-4 py-3 !bg-transparent border-b border-border text-center">
                        <SupportBadge supported={method.supportsPayout} />
                      </td>
                    </tr>
                    {/* Expanded Details Row */}
                    {expandedRow === method.code && (
                      <tr key={`${method.code}-details`}>
                        <td colSpan={6} className="!bg-[#002395]/5 px-4 py-4 border-b border-border">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Deposit Limits */}
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 !mt-0 !mb-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                Deposit Limits
                              </h4>
                              {method.supportsDeposit ? (
                                <div className="bg-background rounded-md p-3 border border-border">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="text-muted-foreground">Minimum:</span>
                                      <div className="font-mono font-medium text-foreground">
                                        {formatAmount(method.depositLimits.min, method.currencies[0])}{" "}
                                        <span className="text-xs text-muted-foreground">{method.currencies[0]}</span>
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Maximum:</span>
                                      <div className="font-mono font-medium text-foreground">
                                        {formatAmount(method.depositLimits.max, method.currencies[0])}{" "}
                                        <span className="text-xs text-muted-foreground">{method.currencies[0]}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-background rounded-md p-3 border border-border text-sm text-muted-foreground">
                                  Deposits not supported for this method
                                </div>
                              )}
                            </div>

                            {/* Payout Limits */}
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 !mt-0 !mb-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                Payout Limits
                              </h4>
                              {method.supportsPayout ? (
                                <div className="bg-background rounded-md p-3 border border-border">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="text-muted-foreground">Minimum:</span>
                                      <div className="font-mono font-medium text-foreground">
                                        {formatAmount(method.payoutLimits.min, method.currencies[0])}{" "}
                                        <span className="text-xs text-muted-foreground">{method.currencies[0]}</span>
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Maximum:</span>
                                      <div className="font-mono font-medium text-foreground">
                                        {formatAmount(method.payoutLimits.max, method.currencies[0])}{" "}
                                        <span className="text-xs text-muted-foreground">{method.currencies[0]}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-background rounded-md p-3 border border-border text-sm text-muted-foreground">
                                  Payouts not supported for this method
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Usage Example */}
                          <div className="mt-4">
                            <h4 className="text-sm font-semibold text-foreground !mt-0 !mb-2">API Usage Example</h4>
                            <pre className="text-xs bg-[#1a1a1a] text-[#f8f8f8] rounded-md p-3 overflow-x-auto !my-0">
                              <code>{`{
  "user_id": "kxa1234",
  "amount": ${method.depositLimits.min},
  "currency": "${method.currencies[0]}",
  "payment_method": "${method.code}",
  "request_id": "req_${Date.now()}",
  "timestamp": "${new Date().toISOString()}"
}`}</code>
                            </pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Usage Note */}
      <div className="p-4 bg-muted rounded border-l-4 border-[#002395]">
        <p className="text-foreground font-semibold !mb-1">Usage Note</p>
        <p className="text-muted-foreground text-sm !mb-0">
          Click on any row to view detailed transaction limits and an API usage example. Transaction
          limits may vary based on user verification level and account history. Contact your account
          manager for custom limit arrangements.
        </p>
      </div>
    </div>
  );
}
