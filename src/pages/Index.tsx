
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import WebhookForm from "@/components/WebhookForm";
import QuerySubmissionForm from "@/components/QuerySubmissionForm";
import { initialWebhookData, submitSolution } from "@/lib/api";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [webhookData, setWebhookData] = useState<{
    webhook: string;
    accessToken: string;
    regNo: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateWebhook = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await initialWebhookData({
          name: "John Doe",
          regNo: "REG12347",
          email: "john@example.com"
        });
        setWebhookData(data);
        toast.success("Webhook generated successfully!");
      } catch (err) {
        console.error("Error generating webhook:", err);
        setError("Failed to generate webhook. Please try again.");
        toast.error("Failed to generate webhook");
      } finally {
        setLoading(false);
      }
    };

    generateWebhook();
  }, []);

  const handleSubmitSolution = async (query: string) => {
    if (!webhookData?.accessToken) {
      toast.error("No access token available");
      return;
    }

    try {
      const result = await submitSolution({
        finalQuery: query,
        accessToken: webhookData.accessToken,
      });
      toast.success("Solution submitted successfully!");
      return result;
    } catch (err) {
      console.error("Error submitting solution:", err);
      toast.error("Failed to submit solution");
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">
            Bajaj Finserv Health
          </h1>
          <h2 className="text-xl text-blue-600">JAVA Qualifier Challenge</h2>
        </header>

        <Card className="p-6 mb-8 shadow-md">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            Challenge Overview
          </h2>
          <p className="text-gray-700 mb-4">
            This application sends a POST request to generate a webhook on startup.
            Based on the response, you need to solve a SQL problem (determined by your
            registration number) and submit your solution via the webhook.
          </p>

          <div className="grid gap-4 mb-6">
            <Alert className="bg-blue-50 text-blue-800 border-blue-200">
              <AlertTitle>Registration Details</AlertTitle>
              <AlertDescription>
                Name: John Doe | Reg No: REG12347 | Email: john@example.com
              </AlertDescription>
            </Alert>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <WebhookForm 
            webhookData={webhookData} 
            loading={loading} 
            onRetry={() => {
              setWebhookData(null);
              setLoading(true);
              initialWebhookData({
                name: "John Doe",
                regNo: "REG12347",
                email: "john@example.com"
              })
                .then(data => {
                  setWebhookData(data);
                  toast.success("Webhook regenerated successfully!");
                })
                .catch(err => {
                  console.error("Error regenerating webhook:", err);
                  setError("Failed to regenerate webhook.");
                  toast.error("Failed to regenerate webhook");
                })
                .finally(() => setLoading(false));
            }}
          />

          <QuerySubmissionForm 
            webhookData={webhookData} 
            onSubmit={handleSubmitSolution} 
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
