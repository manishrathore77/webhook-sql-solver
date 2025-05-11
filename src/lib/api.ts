
interface WebhookRequest {
  name: string;
  regNo: string;
  email: string;
}

interface WebhookResponse {
  webhook: string;
  accessToken: string;
}

interface SolutionRequest {
  finalQuery: string;
  accessToken: string;
}

export async function initialWebhookData(data: WebhookRequest): Promise<WebhookResponse & { regNo: string }> {
  try {
    const response = await fetch('https://bfhldevapigw.healthrx.co.in/hiring/generateWebhook/JAVA', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return {
      ...result,
      regNo: data.regNo // Pass through the regNo for problem determination
    };
  } catch (error) {
    console.error("Error in initialWebhookData:", error);
    throw error;
  }
}

export async function submitSolution({ finalQuery, accessToken }: SolutionRequest): Promise<any> {
  try {
    const response = await fetch('https://bfhldevapigw.healthrx.co.in/hiring/testWebhook/JAVA', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken
      },
      body: JSON.stringify({ finalQuery }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in submitSolution:", error);
    throw error;
  }
}
