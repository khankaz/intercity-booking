const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// WhatsApp через Twilio
const accountSid = "ВАШ_TWILIO_SID";
const authToken = "ВАШ_TWILIO_TOKEN";
const client = require("twilio")(accountSid, authToken);
const whatsappFrom = "whatsapp:+14155238886"; // Номер Twilio

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/send-whatsapp-code", async (req, res) => {
  const { phone, code } = req.body;
  try {
    await client.messages.create({
      from: whatsappFrom,
      to: `whatsapp:${phone}`,
      body: `Ваш код для входа: ${code}`
    });
    res.status(200).send("OK");
  } catch (e) {
    console.error(e);
    res.status(500).send("Ошибка отправки");
  }
});

app.listen(3000, () => console.log("Сервер на порту 3000"));
