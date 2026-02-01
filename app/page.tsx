"use client";

import { HeroSection } from "@/components/sections/hero-section";
import { TableOfContents } from "@/components/sections/table-of-contents";
import { IntroductionSection } from "@/components/sections/introduction-section";
import { DocSection } from "@/components/sections/doc-section";
import { Footer } from "@/components/sections/footer";

// Placeholder components for heavy implementations
import { AuthorizationContent } from "@/components/content/authorization-content";
import { UserValidationContent } from "@/components/content/user-validation-content";
import { DepositCreationContent } from "@/components/content/deposit-creation-content";
import { PayoutCreationContent } from "@/components/content/payout-creation-content";
import { WebhooksContent } from "@/components/content/webhooks-content";
import { PaymentMethodsContent } from "@/components/content/payment-methods-content";
import { ErrorCodesContent } from "@/components/content/error-codes-content";
import { PDFDownloadButton } from "@/components/pdf-download-button";

export default function APIDocumentation() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content Area */}
      <div className="swiss-container">
        {/* Table of Contents */}
        <TableOfContents />

        {/* Section 1: Introduction */}
        <IntroductionSection />

        {/* Section 2: Authorization */}
        <DocSection id="authorization" number={2} title="Authorization">
          <AuthorizationContent />
        </DocSection>

        {/* Section 3: User Validation */}
        <DocSection id="user-validation" number={3} title="User Validation Endpoint">
          <UserValidationContent />
        </DocSection>

        {/* Section 4: Deposit Creation */}
        <DocSection id="deposit-creation" number={4} title="Deposit Creation Endpoint">
          <DepositCreationContent />
        </DocSection>

        {/* Section 5: Payout Creation */}
        <DocSection id="payout-creation" number={5} title="Payout Creation Endpoint">
          <PayoutCreationContent />
        </DocSection>

        {/* Section 6: Webhooks */}
        <DocSection id="webhooks" number={6} title="Webhooks">
          <WebhooksContent />
        </DocSection>

        {/* Section 7: Payment Methods */}
        <DocSection id="payment-methods" number={7} title="Payment Methods">
          <PaymentMethodsContent />
        </DocSection>

        {/* Section 8: Error Codes */}
        <DocSection id="error-codes" number={8} title="Error Codes Reference">
          <ErrorCodesContent />
        </DocSection>

        {/* PDF Download Section */}
        <section className="section border-t border-border">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Download Documentation</h3>
            <p className="text-muted-foreground mb-6">
              Get a PDF version of this documentation for offline reference.
            </p>
            <PDFDownloadButton />
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
