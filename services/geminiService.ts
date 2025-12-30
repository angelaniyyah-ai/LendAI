
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Loan, Client, AIInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeRisk = async (loan: Loan, client: Client): Promise<AIInsight[]> => {
  const prompt = `Analyze the payment risk for this loan:
    Loan Details: ${JSON.stringify(loan)}
    Client Details: ${JSON.stringify(client)}
    
    Provide 2-3 specific insights regarding payment default risk or administrative alerts.
    Return the response as a JSON array of objects with properties: type (RISK, ALERT, OPPORTUNITY), severity (LOW, MEDIUM, HIGH), message (string).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              severity: { type: Type.STRING },
              message: { type: Type.STRING },
            },
            required: ["type", "severity", "message"]
          }
        }
      }
    });

    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Analysis failed", error);
    return [{
      type: 'ALERT',
      severity: 'LOW',
      message: 'Could not perform AI analysis at this time.'
    }];
  }
};

export const generateManagementSummary = async (loans: Loan[]): Promise<string> => {
  const dataSummary = loans.map(l => ({
    id: l.loanNumber,
    balance: l.balance,
    status: l.status,
    term: l.termMonths
  }));

  const prompt = `Summarize this loan portfolio for a non-technical manager. 
    Portfolio Data: ${JSON.stringify(dataSummary)}
    Identify trends in arrears, total outstanding volume, and highlight top 3 concerns. Keep it concise.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Portfolio analysis unavailable.";
  } catch (error) {
    return "Error generating AI summary.";
  }
};
