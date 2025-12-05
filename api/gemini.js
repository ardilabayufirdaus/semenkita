import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function makePrompt(action, payload) {
  switch (action) {
    case "stock":
      return `You are a Plant Manager at a Cement Packing Plant. Analyze inventory data and provide an executive summary. Data: ${JSON.stringify(
        payload.stockData
      )}`;
    case "logistics":
      return `You are a Logistics Coordinator. Review performance metrics and suggest improvements. Data: ${JSON.stringify(
        payload.metrics
      )}`;
    case "packer":
      return `You are a Maintenance Engineer. Analyze packer metrics and provide technical recommendations. Data: ${JSON.stringify(
        payload.metrics
      )}`;
    default:
      return `General assistant. Data: ${JSON.stringify(payload)}`;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).setHeader("Allow", "POST").end("Method Not Allowed");
    return;
  }

  if (!process.env.API_KEY) {
    res.status(500).json({ error: "Server: API_KEY not configured" });
    return;
  }

  try {
    const { action, payload } = req.body || {};
    const prompt = makePrompt(action, payload);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.status(200).json({ text: response.text || "" });
  } catch (err) {
    console.error("API /api/gemini error:", err);
    res.status(500).json({ error: "AI generation failed" });
  }
}
