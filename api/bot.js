export default async function handler(req, res) {
  console.log("METHOD:", req.method);
  console.log("BODY:", JSON.stringify(req.body));

  if (req.method === "POST") {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = req.body?.message?.chat?.id;

    console.log("CHAT ID:", chatId);
    console.log("TOKEN EXISTS:", !!token);

    if (token && chatId) {
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

      console.log("TELEGRAM STATUS:", response.status);
      console.log("TELEGRAM RESPONSE:", await response.text());
    }
  }

  return res.status(200).send("OK");
}
