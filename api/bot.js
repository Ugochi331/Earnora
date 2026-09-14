export default async function handler(req, res) {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    return res.status(500).json({
      error: "TELEGRAM_BOT_TOKEN is missing"
    });
  }

  if (req.method === "GET") {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/getMe`
    );

    const result = await response.json();

    return res.status(200).json(result);
  }

  if (req.method === "POST") {
    console.log("FULL REQUEST BODY:", JSON.stringify(req.body));

    const chatId = req.body?.message?.chat?.id;

    console.log("CHAT ID:", chatId);

    if (chatId) {
      const response = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
  chat_id: chatId,
  text: "Welcome to Xevani! 🎉",
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "🚀 Open Xevani",
          web_app: {
            url: "https://xevani.vercel.app/index.html"
          }
        }
      ]
    ]
  }
})
        }
      );

      const result = await response.json();

      console.log("Telegram result:", result);
    }

    return res.status(200).json({ ok: true });
  }

  return res.status(200).json({ ok: true });
}
