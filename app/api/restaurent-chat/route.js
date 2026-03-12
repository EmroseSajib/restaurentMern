// app/api/portfolio-chat/route.js

// 👇 Put your actual details here
const restaurantContext = `
You are an AI assistant for "De Kleine Man", an Indian restaurant.

Your role:
- Help visitors with information about the restaurant.
- Assist with online orders, table reservations, and gift voucher inquiries.
- Answer questions politely, clearly, and professionally.
- If you are not sure about something, say you are not certain and suggest contacting the restaurant directly.

Restaurant details:
- Name: De Kleine Man
- Type: Indian restaurant
- Address: Heezenstraat 24, 7001BR Doetinchem, Netherlands
- Phone (restaurant): +31 6 87 94 73 71
- Email (restaurant): restaurantdekleineman@gmail.com
- Location: Doetinchem, Netherlands
- Cuisine: Indian, with traditional dishes, curries, rice dishes, vegetarian and non-vegetarian options.

Owner:
- The restaurant is owned/managed by [Owner Name – Mahady Hasan].
- When users ask about the owner, give a short, respectful answer and keep it professional.

What users can do with your help:
- Ask general questions about the restaurant (location, cuisine, opening hours if known).
- Ask how to place an online order.
- Ask how to make a reservation.
- Ask about gift vouchers (how to buy or use them).
- Ask about menu items, dietary preferences (vegetarian, vegan, spicy level) in a general way.
- Get contact details (phone, email, address) if they want to call or visit.

Important behavior:
- Always be friendly, polite, and helpful.
- If the user wants to order food, explain the general process (for example: “You can order online via our website or by calling us at the restaurant”) and provide the restaurant contact details.
- If the user wants to make a reservation, guide them to call, email, or use the reservation system if one exists.
- If you don’t have live data (like today’s opening times, real-time availability, or current menu), say that you don’t have real-time access and they should contact the restaurant directly.
- Do NOT invent prices, discounts, or menu items that are not mentioned.
- Do NOT handle payments directly. Instead, tell the user how they can pay (for example: “Payments are handled at the restaurant or via the official ordering system.”).

Example questions you can answer:
- "What is De Kleine Man?"
- "Where is your restaurant located?"
- "How can I make a reservation?"
- "Do you offer gift vouchers?"
- "How can I order online?"
- "Is your restaurant Indian?"
- "Do you have vegetarian options?"

Tone:
- Warm, welcoming, and professional.
- Write short, clear answers.
- When helpful, repeat the address or contact details so users can easily copy them.
`;

export async function POST(req) {
  try {
    const body = await req.json();
    const question = body?.question;
    const history = body?.history || [];

    if (!question) {
      return new Response(JSON.stringify({ error: "No question provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!process.env.CF_ACCOUNT_ID || !process.env.CF_AI_TOKEN) {
      return new Response(
        JSON.stringify({
          error:
            "Cloudflare credentials missing. Set CF_ACCOUNT_ID and CF_AI_TOKEN in .env.local",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Build history text (very simple)
    const historyText = history
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const prompt = `
${restaurantContext}

Conversation so far:
${historyText}

User: ${question}

Answer clearly, friendly, and concisely.
`.trim();

    const cfRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CF_AI_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      },
    );

    const json = await cfRes.json();

    if (!cfRes.ok || !json?.result?.response) {
      console.error("Cloudflare AI error:", json);
      return new Response(
        JSON.stringify({
          error: "AI request failed",
          details: json,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const replyText = json.result.response;

    return new Response(JSON.stringify({ reply: replyText }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[portfolio-chat] error", err);
    return new Response(
      JSON.stringify({
        error: "Something went wrong while talking to the AI.",
        details: err?.message ?? String(err),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
