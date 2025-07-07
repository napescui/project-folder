const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;

app.post('/api/gemini', async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) return res.status(400).json({ error: 'Prompt kosong.' });

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak ada balasan.";
    res.json({ reply });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: err.toString() });
  }
});

app.get('/', (_, res) => {
  res.send("✅ GTSA Gemini API aktif.");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server jalan di port ${port}`);
});
