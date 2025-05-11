
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface QuerySubmissionFormProps {
  webhookData: {
    webhook: string;
    accessToken: string;
    regNo: string;
  } | null;
  onSubmit: (query: string) => Promise<any>;
}

const QuerySubmissionForm = ({ webhookData, onSubmit }: QuerySubmissionFormProps) => {
  const [sqlQuery, setSqlQuery] = useState(`SELECT
  e1.EMP_ID,
  e1.FIRST_NAME,
  e1.LAST_NAME,
  d.DEPARTMENT_NAME,
  COUNT(e2.EMP_ID) AS YOUNGER_EMPLOYEES_COUNT
FROM
  EMPLOYEE e1
JOIN
  DEPARTMENT d ON e1.DEPARTMENT = d.DEPARTMENT_ID
LEFT JOIN
  EMPLOYEE e2 ON e1.DEPARTMENT = e2.DEPARTMENT
  AND e2.DOB > e1.DOB
GROUP BY
  e1.EMP_ID, e1.FIRST_NAME, e1.LAST_NAME, d.DEPARTMENT_NAME
ORDER BY
  e1.EMP_ID DESC;`);
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!sqlQuery.trim()) return;
    
    setSubmitting(true);
    setResponse(null);
    setError(null);
    
    try {
      const result = await onSubmit(sqlQuery);
      setResponse(result);
    } catch (err) {
      setError("Failed to submit solution. Please check your query and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetQuery = () => {
    setSqlQuery(`SELECT
  e1.EMP_ID,
  e1.FIRST_NAME,
  e1.LAST_NAME,
  d.DEPARTMENT_NAME,
  COUNT(e2.EMP_ID) AS YOUNGER_EMPLOYEES_COUNT
FROM
  EMPLOYEE e1
JOIN
  DEPARTMENT d ON e1.DEPARTMENT = d.DEPARTMENT_ID
LEFT JOIN
  EMPLOYEE e2 ON e1.DEPARTMENT = e2.DEPARTMENT
  AND e2.DOB > e1.DOB
GROUP BY
  e1.EMP_ID, e1.FIRST_NAME, e1.LAST_NAME, d.DEPARTMENT_NAME
ORDER BY
  e1.EMP_ID DESC;`);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-blue-700">SQL Solution Submission</CardTitle>
        <CardDescription>
          Provide your SQL solution and submit it to the webhook
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Your SQL Query Solution
              </label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetQuery}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Reset Query
              </Button>
            </div>
            <Textarea
              placeholder="Write your SQL query here..."
              className="h-[200px] font-mono resize-none"
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              disabled={submitting || !webhookData}
            />
          </div>
          
          {response && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <AlertDescription>
                <strong>Success:</strong> Your solution was successfully submitted.
                {typeof response === "object" && (
                  <pre className="mt-2 text-xs bg-green-100 p-2 rounded overflow-auto">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                )}
              </AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit}
          disabled={!webhookData || submitting || !sqlQuery.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Submit Solution
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuerySubmissionForm;
