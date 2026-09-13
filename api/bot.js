export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({
      message: "Xevani bot backend is running."
    });
  }

  try {
    const update = req.body;
    const message = update?.message;
    const chatId = message?.chat?.id;
    const text = message?.text;

    console.log("Telegram update received:", update);

    if (!chatId) {
      return res.status(200).json({ ok: true });
    }

    if (text === "/start") {
      const token = process.env.TELEGRAM_BOT_TOKEN;

      if (!token) {
        console.error("TELEGRAM_BOT_TOKEN is missing");
        return res.status(500).json({
          error: "Bot token is missing"
        });
      }

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

      console.log("Telegram sendMessage result:", result);

      return res.status(200).json({
        ok: true,
        telegram: result
      });
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error("Bot error:", error);

    return res.status(500).json({
      error: error.message
    });
  }
}
