"use client";

import { useState, useCallback } from "react";
import { Download, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type GenerationStatus = "idle" | "generating" | "success" | "error";

interface ProgressState {
  current: number;
  total: number;
  message: string;
}

export function PDFDownloadButton() {
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [progress, setProgress] = useState<ProgressState>({
    current: 0,
    total: 100,
    message: "",
  });

  const generatePDF = useCallback(async () => {
    setStatus("generating");
    setProgress({ current: 0, total: 100, message: "Initializing PDF generation..." });

    try {
      // Dynamically import libraries to reduce initial bundle size
      const [html2canvasModule, jsPDFModule] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const html2canvas = html2canvasModule.default;
      const { jsPDF } = jsPDFModule;

      setProgress({ current: 10, total: 100, message: "Preparing document..." });

      // Create a new jsPDF instance (A4 size)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;

      // Define sections to capture
      const sections = [
        { id: "hero", selector: "section.bg-\\[\\#002395\\]", title: "Cover" },
        { id: "introduction", selector: "#introduction", title: "Introduction" },
        { id: "authorization", selector: "#authorization", title: "Authorization" },
        { id: "user-validation", selector: "#user-validation", title: "User Validation" },
        { id: "deposit-creation", selector: "#deposit-creation", title: "Deposit Creation" },
        { id: "payout-creation", selector: "#payout-creation", title: "Payout Creation" },
        { id: "webhooks", selector: "#webhooks", title: "Webhooks" },
        { id: "payment-methods", selector: "#payment-methods", title: "Payment Methods" },
        { id: "error-codes", selector: "#error-codes", title: "Error Codes" },
      ];

      let currentPage = 0;
      const totalSections = sections.length;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        setProgress({
          current: 10 + Math.floor((i / totalSections) * 80),
          total: 100,
          message: `Rendering ${section.title}...`,
        });

        const element = document.querySelector(section.selector) as HTMLElement;
        if (!element) continue;

        // Clone the element to avoid modifying the original
        const clone = element.cloneNode(true) as HTMLElement;
        clone.style.width = "800px";
        clone.style.position = "absolute";
        clone.style.left = "-9999px";
        clone.style.top = "0";
        clone.style.backgroundColor = section.id === "hero" ? "#002395" : "#ffffff";
        clone.style.color = section.id === "hero" ? "#ffffff" : "#1a1a1a";
        
        // Remove animations and transitions
        clone.style.opacity = "1";
        clone.style.transform = "none";
        clone.style.transition = "none";
        
        // Make all children visible
        const allElements = clone.querySelectorAll("*");
        allElements.forEach((el) => {
          const htmlEl = el as HTMLElement;
          htmlEl.style.opacity = "1";
          htmlEl.style.transform = "none";
          htmlEl.style.transition = "none";
        });

        document.body.appendChild(clone);

        try {
          const canvas = await html2canvas(clone, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: section.id === "hero" ? "#002395" : "#ffffff",
            logging: false,
          });

          const imgData = canvas.toDataURL("image/jpeg", 0.95);
          const imgWidth = contentWidth;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Calculate how many pages this section needs
          const pagesNeeded = Math.ceil(imgHeight / (pageHeight - margin * 2));

          for (let page = 0; page < pagesNeeded; page++) {
            if (currentPage > 0) {
              pdf.addPage();
            }

            // Calculate source coordinates for this slice
            const sourceY = page * ((pageHeight - margin * 2) / imgWidth) * canvas.width;
            const sourceHeight = Math.min(
              ((pageHeight - margin * 2) / imgWidth) * canvas.width,
              canvas.height - sourceY
            );

            // Create a temporary canvas for this slice
            const sliceCanvas = document.createElement("canvas");
            sliceCanvas.width = canvas.width;
            sliceCanvas.height = sourceHeight;
            const sliceCtx = sliceCanvas.getContext("2d");

            if (sliceCtx) {
              sliceCtx.drawImage(
                canvas,
                0,
                sourceY,
                canvas.width,
                sourceHeight,
                0,
                0,
                canvas.width,
                sourceHeight
              );

              const sliceImgData = sliceCanvas.toDataURL("image/jpeg", 0.95);
              const sliceHeight = (sourceHeight * imgWidth) / canvas.width;

              pdf.addImage(sliceImgData, "JPEG", margin, margin, imgWidth, sliceHeight);
            }

            currentPage++;
          }
        } finally {
          document.body.removeChild(clone);
        }

        // Small delay to allow UI to update
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      setProgress({ current: 95, total: 100, message: "Finalizing PDF..." });

      // Add footer to each page
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(9);
        pdf.setTextColor(150);
        pdf.text(`API Documentation v4.0 - Page ${i} of ${totalPages}`, margin, pageHeight - 8);
        pdf.text("Generated by AS", pageWidth - margin - 40, pageHeight - 8);
      }

      setProgress({ current: 100, total: 100, message: "Download starting..." });

      // Download the PDF
      pdf.save("API-Documentation-v4.0.pdf");

      setStatus("success");
      
      // Reset to idle after showing success
      setTimeout(() => {
        setStatus("idle");
        setProgress({ current: 0, total: 100, message: "" });
      }, 3000);
    } catch (error) {
      console.error("PDF generation failed:", error);
      setStatus("error");
      setProgress({ current: 0, total: 100, message: "Failed to generate PDF" });
      
      // Reset to idle after showing error
      setTimeout(() => {
        setStatus("idle");
        setProgress({ current: 0, total: 100, message: "" });
      }, 5000);
    }
  }, []);

  const handleDownload = () => {
    if (status === "generating") return;
    generatePDF();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        onClick={handleDownload}
        disabled={status === "generating"}
        className="bg-[#002395] hover:bg-[#001a6e] disabled:bg-[#002395]/70 text-white px-8 py-6 text-base font-medium cursor-pointer transition-colors"
      >
        {status === "idle" && (
          <>
            <Download className="w-5 h-5 mr-2" />
            Download PDF Documentation
          </>
        )}
        {status === "generating" && (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Generating PDF...
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle2 className="w-5 h-5 mr-2" />
            PDF Downloaded!
          </>
        )}
        {status === "error" && (
          <>
            <AlertCircle className="w-5 h-5 mr-2" />
            Try Again
          </>
        )}
      </Button>

      {status === "generating" && (
        <div className="w-full max-w-xs space-y-2">
          <Progress value={progress.current} className="h-2" />
          <p className="text-sm text-muted-foreground text-center">{progress.message}</p>
        </div>
      )}

      {status === "success" && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <CheckCircle2 className="w-4 h-4" />
          Your PDF has been downloaded successfully
        </p>
      )}

      {status === "error" && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          PDF generation failed. Please try again.
        </p>
      )}
    </div>
  );
}
