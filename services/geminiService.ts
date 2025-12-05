
import { GoogleGenAI } from "@google/genai";
import { StockItem, LogisticsMetric, PackerMetric } from '../types';

// Initialize Gemini Client using the environment variable.
// This is the recommended standard practices for both Free Tier and Paid usage.
// Ensure your environment has API_KEY set.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStockForecastAnalysis = async (stockData: StockItem[]): Promise<string> => {
  if (!process.env.API_KEY) return "API Key not configured. Unable to generate AI insights.";

  const prompt = `
    You are a Plant Manager at a Cement Packing Plant. 
    Analyze the following inventory data which includes Silo Levels (Cement) and Packaging Materials (Bags).
    
    1. Check if 'currentStock' of Cement (Silo) is critically low or full based on thresholds.
    2. Check if 'currentStock' of Bags is sufficient for upcoming production.
    3. Provide a brief, professional executive summary (max 3 sentences) focusing on potential production stoppages due to material shortages.
    
    Data: ${JSON.stringify(stockData)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI Analysis currently unavailable (Check Environment Configuration).";
  }
};

export const getLogisticsRecommendations = async (metrics: LogisticsMetric[]): Promise<string> => {
  if (!process.env.API_KEY) return "API Key not configured.";

  const prompt = `
    You are a Logistics Coordinator at a Cement Plant.
    Review the daily performance metrics (Dispatch Tonnage vs Loading Time).
    
    Data: ${JSON.stringify(metrics)}
    
    1. Identify days where 'avgLoadingTime' spiked (above 30 mins is bad).
    2. Identify days where 'dispatchTon' missed the 'targetTon'.
    3. Suggest 3 actionable operational improvements to reduce truck dwell time and increase dispatch velocity.
    Format as a concise markdown list.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No recommendations generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI Recommendations unavailable (Check Environment Configuration).";
  }
};

export const getPackerAnalysis = async (metrics: PackerMetric[]): Promise<string> => {
  if (!process.env.API_KEY) return "API Key not configured.";

  const prompt = `
    You are a Maintenance Engineer at a Cement Packing Plant.
    Analyze the performance of the Rotary Packers below.
    
    Data: ${JSON.stringify(metrics)}
    
    Focus on:
    1. High 'burstRate' (indicates nozzle/pressure issues or bad bag quality).
    2. 'weightAccuracy' deviation (should be close to 50.0kg).
    3. Efficiency drops.
    
    Provide a technical maintenance recommendation list.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No packer analysis generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI Analysis unavailable.";
  }
};
