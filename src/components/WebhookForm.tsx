
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, RefreshCw } from "lucide-react";

interface WebhookFormProps {
  webhookData: {
    webhook: string;
    accessToken: string;
    regNo: string;
  } | null;
  loading: boolean;
  onRetry: () => void;
}

const WebhookForm = ({ webhookData, loading, onRetry }: WebhookFormProps) => {
  // Determine problem type based on registration number
  const getProblemType = () => {
    if (!webhookData?.regNo) return "Unknown";
    
    const lastTwoDigits = webhookData.regNo.slice(-2);
    const lastDigit = parseInt(lastTwoDigits.slice(-1));
    
    return isNaN(lastDigit) ? "Unknown" : lastDigit % 2 === 0 ? "Even (Question 2)" : "Odd (Question 1)";
  };
  
  const problemType = getProblemType();
  const problemLink = problemType.includes("Odd") 
    ? "https://drive.google.com/file/d/1q8F8g0EpyNzd5BWk-voe5CKbsxoskJWY/view?usp=sharing"
    : "https://drive.google.com/file/d/1P_O1ZvmDqAZJv77XRY_sV_ben11W_p2HV_b/view?usp=sharing";

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          {webhookData && !loading ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : null}
          Webhook Generation
        </CardTitle>
        <CardDescription>
          API response with your webhook details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : webhookData ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook URL
              </label>
              <Input 
                value={webhookData.webhook} 
                readOnly 
                className="font-mono text-sm" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Access Token (JWT)
              </label>
              <Input 
                value={webhookData.accessToken.substring(0, 15) + "..." + webhookData.accessToken.substring(webhookData.accessToken.length - 10)} 
                readOnly 
                className="font-mono text-sm" 
              />
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm font-medium text-blue-700">Your Problem Type:</p>
              <p className="text-sm mb-2">{problemType}</p>
              <a 
                href={problemLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                View Problem Statement
              </a>
            </div>
          </>
        ) : (
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load webhook data. Please try again.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      {!loading && (
        <CardFooter>
          <Button 
            variant="outline" 
            onClick={onRetry} 
            className="w-full"
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate Webhook
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default WebhookForm;
