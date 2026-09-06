import { Platform } from 'react-native';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are the official customer support AI for Clothiq, an on-demand laundry and dry-cleaning service app. 
Be helpful, polite, and extremely concise. 
Here is some information about Clothiq:
- Services: Wash & Fold, Dry Cleaning, Ironing, Premium Wash.
- Pricing: Very affordable, shown in the app when selecting items.
- Turnaround time: Usually 24-48 hours.
- Tracking: Users can track their order in the "Track Order" page.
- Payment: COD and Online payments available.

CRITICAL RULE: You must ONLY answer questions related to Clothiq, laundry, dry cleaning, clothing care, or the app's features. If a user asks about ANYTHING ELSE (like coding, history, math, or general trivia), you MUST politely refuse to answer and remind them that you are a laundry support bot. Do not answer off-topic questions under any circumstances.

Keep your answers brief and friendly. Do not use markdown that won't render well in a basic text view (like tables). Use simple text and emojis.`;

export async function sendMessageToGroq(userMessage: string, conversationHistory: any[] = []) {
  try {
    const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
    
    if (!apiKey || apiKey === 'paste_your_api_key_here') {
      return "It looks like my AI brain is disconnected! Please ensure your Groq API key is added to the .env file and restart the app.";
    }

    // Convert our internal message format to OpenAI/Groq format
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
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
