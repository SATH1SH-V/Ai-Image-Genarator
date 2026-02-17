require("dotenv").config(); 
const express = require("express");
const cors = require("cors");
const axios = require("axios"); 
const app = express();

app.use(cors()); 
app.use(express.json());

app.post("/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      { prompt: prompt },
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY, 
          "Content-Type": "application/json"
        },
        responseType: "arraybuffer"
      }
    );

    res.set("Content-Type", "image/png");
    res.send(response.data);

  } catch (error) {
    console.error(
      "Clipdrop Error:",
      error.response?.data?.toString() || error.message
    );
    res.status(500).json({ error: "Image generation failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
