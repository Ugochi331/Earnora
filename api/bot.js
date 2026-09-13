export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({
      message: "Xevani bot backend is running."
    });
  }

  const update = req.body;

  console.log("Telegram update:", update);

  return res.status(200).json({
    ok: true
  });
}
