const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 5000; // Port for the server

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

const filePath = path.join(__dirname, "canvasImage.png");

app.post("/save", (req, res) => {
  const { imageData } = req.body;
  if (imageData) {
    const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
    fs.writeFile(filePath, base64Data, "base64", err => {
      if (err) {
        return res.status(500).json({ error: "Failed to save image" });
      }
      res.status(200).json({ message: "Image saved successfully" });
    });
  } else {
    res.status(400).json({ error: "No image data provided" });
  }
});

// Endpoint to load canvas data
app.get("/load", (req, res) => {
  fs.readFile(filePath, "base64", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to load image" });
    }
    res.json({ imageData: `data:image/png;base64,${data}` });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});