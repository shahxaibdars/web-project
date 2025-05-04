"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export function AdviceReport({ clientId }: { clientId: string }) {
  const [loading, setLoading] = useState(false);
  const [reportUrl, setReportUrl] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setReportUrl("https://example.com/reports/sample.pdf");
      toast({
        title: "Success",
        description: "Report generated successfully",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Financial Advice Report</h1>
      
      <div className="space-y-4">
        <Button
          onClick={handleGenerateReport}
          disabled={loading || !!reportUrl}
        >
          {loading ? "Generating..." : "Generate Report"}
        </Button>

        {reportUrl && (
          <div className="p-4 border rounded-lg bg-white">
            <p className="text-gray-800 mb-2">Report is ready!</p>
            <a
              href={reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Download Report
            </a>
          </div>
        )}
      </div>
    </div>
  );
} 