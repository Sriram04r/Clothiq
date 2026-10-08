import { Platform } from 'react-native';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are Alfred, the customer support AI for Clothiq. 
CRITICAL RULE: NEVER USE LONG CONVERSATIONS. Resolve the user's issue instantly with the shortest possible answer. Do not ramble. Do not use filler words.

Here is some critical information about Clothiq you MUST memorize:
- Services: Wash & Fold, Dry Cleaning, Ironing, Premium Wash.
- Pricing: Very affordable, shown in the app when selecting items.
- Delivery Fee: We charge a standard delivery fee of exactly ₹40.
- Turnaround time: Usually 24-48 hours.
- Tracking: Users can track their order in the "Track Order" page.
- Payment: COD and Online payments available.

BUSINESS POLICIES & BEHAVIOR:
1. DELAYS: If a pickup/delivery is delayed, do not write a long apology. Say: "I have escalated this delay to dispatch. A driver will be assigned immediately."
2. MISSING ITEMS: If an item is missing, say: "Please email support@clothiq.com. We will investigate this immediately."
3. CONVERSATIONAL MEMORY: If a user asks a meta-question (e.g., "How fast did you answer me?"), give a 1-sentence answer.
4. OFF-TOPIC: Only refuse questions if they are completely unrelated to Clothiq (e.g., "What is the capital of France?"). 

Keep your answers to 1 or 2 sentences maximum. Be direct, professional, and fix the issue immediately. Use simple text and emojis.`;

export async function sendMessageToGroq(userMessage: string, conversationHistory: any[] = [], userContext: string = "", language: string = "en") {
  try {
    const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;

    if (!apiKey || apiKey === 'paste_your_api_key_here') {
      return "It looks like my AI brain is disconnected! Please ensure your Groq API key is added to the .env file and restart the app.";
    }

    const finalSystemPrompt = SYSTEM_PROMPT + (userContext ? `\n\nUser Context:\n${userContext}` : "") + `\n\nIMPORTANT: YOU MUST RESPOND IN THIS LANGUAGE CODE: ${language}.`;

    // Convert our internal message format to OpenAI/Groq format
    const messages = [
      { role: 'system', content: finalSystemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: userMessage }
    ];

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b', // Active 2026 model
        messages: messages,
        temperature: 0.7,
        max_tokens: 250,
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Groq API Error:", errorData);
      return "Sorry, I'm having trouble connecting to my servers right now. Please try again later!";
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "I'm not sure how to answer that.";

  } catch (error) {
    console.error("Error calling Groq:", error);
    return "Oops! Something went wrong while sending your message. Check your internet connection.";
  }
}

export async function analyzeClothingTag(base64Image: string) {
  try {
    const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
    if (!apiKey || apiKey === 'paste_your_api_key_here') {
      return "⚠️ Error: AI Key missing.";
    }

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.8-27b',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this clothing care tag. Return ONLY a concise, bolded warning containing the most critical care instructions (e.g., "⚠️ DO NOT TUMBLE DRY. WASH COLD ONLY."). Do not include any conversational text or explanation.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        temperature: 0.1,
        max_tokens: 100,
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Groq Vision API Error:", data);
      return null;
    }

    return data.choices[0]?.message?.content || null;
  } catch (error) {
    console.error("Error calling Groq Vision:", error);
    return null;
  }
}
