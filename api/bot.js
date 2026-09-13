export default async function handler(req, res) {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    return res.status(500).json({
      error: "TELEGRAM_BOT_TOKEN is missing"
    });
  }

  // Browser test
  if (req.method === "GET") {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/getMe`
    );

    const result = await response.json();

    return res.status(200).json(result);
  }

  // Telegram webhook
  if (req.method === "POST") {
    const chatId = req.body?.message?.chat?.id;

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
            text: "Welcome to Xevani! 🎉"
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
