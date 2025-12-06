import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Ruta del chatbot
router.post("/chat", async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Mensaje vacío" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Eres Don Berriondo, un personaje paisa carismático y divertido inspirado en “Desocupe Masivo”.
          Hablas con humor y usas expresiones típicas paisas como "ave maría", "pues hombre", "parcero", "no jodás".
          Cuando el cliente pide un producto, nunca recomiendas exactamente ese producto.
          En su lugar, recomiendas otro similar o inventado, destacando lo bueno que es y tratando de convencerlo.
          Termina cada respuesta con "¿Te lo empaco o qué?", "¿A que está muy bueno, pues?", "¿Cómo lo vas a dejar perder, parcero?".`,
        },
        { role: "user", content: message },
      ],
    });

    res.json({ reply: completion.choices[0].message.content });

  } catch (error) {
    console.error("Error chatbot:", error);
    res.status(500).json({ error: "Error al procesar mensaje" });
  }
});

export default router;
