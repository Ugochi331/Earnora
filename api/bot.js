export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("Xevani bot is running");
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = req.body?.message?.chat?.id;

  if (token && chatId) {
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

  return res.status(200).send("OK");
}
