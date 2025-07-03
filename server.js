const express = require("express");
const axios = require("axios");
const FormData = require("form-data");
const app = express();
app.use(express.json({ limit: "10mb" }));

const TELEGRAM_BOT_TOKEN = "8020315947:AAHVdj0Tk9ot9pjMJOTq3GIl191VZIRLWpY";
const CHAT_ID = "@ggggshn"; // اسم القناة مباشرة

app.post("/send-image", async (req, res) => {
  const { image } = req.body;
  if (!image) return res.status(400).json({ success: false, message: "لا توجد صورة" });

  try {
    const base64Data = image.replace(/^data:image\/png;base64,/, "");
    const form = new FormData();
    form.append("chat_id", CHAT_ID);
    form.append("photo", Buffer.from(base64Data, "base64"), "photo.png");

    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
      form,
      { headers: form.getHeaders() }
    );

    if (response.data.ok) res.json({ success: true });
    else res.status(500).json({ success: false, message: "فشل في إرسال الصورة" });
  } catch (error) {
    console.error("خطأ:", error.message);
    res.status(500).json({ success: false, message: "حدث خطأ داخلي" });
  }
});

app.use(express.static("."));

app.listen(3000, () => {
  console.log("✅ الخادم يعمل على http://localhost:3000");
});
