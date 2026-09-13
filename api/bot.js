export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({
      message: "Xevani bot backend is running."
    });
  }

  const update = req.body;

  console.log("Telegram update:", update);

  const message = update?.message;
  const chatId = message?.chat?.id;
  const text = message?.text;

  if (chatId && text === "/start") {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: "Welcome to Xevani! 🎉"
      })
    });
  }

  return res.status(200).json({
    ok: true
  });
}
