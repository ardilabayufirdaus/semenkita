import { StockItem, LogisticsMetric, PackerMetric } from "../types";

async function callServer(action: string, payload: any) {
  try {
    const resp = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, payload }),
    });
    if (!resp.ok) {
      const txt = await resp.text();
      console.error("Server Gemini Error:", resp.status, txt);
      return "AI Service unavailable (server error).";
    }
    const json = await resp.json();
    return json.text || "No response from AI server.";
  } catch (err) {
    console.error("Fetch Gemini Error:", err);
    return "AI Service unavailable (network error).";
  }
}

export const getStockForecastAnalysis = async (
  stockData: StockItem[]
): Promise<string> => {
  return callServer("stock", { stockData });
};

export const getLogisticsRecommendations = async (
  metrics: LogisticsMetric[]
): Promise<string> => {
  return callServer("logistics", { metrics });
};

export const getPackerAnalysis = async (
  metrics: PackerMetric[]
): Promise<string> => {
  return callServer("packer", { metrics });
};
