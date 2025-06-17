import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Grid,
  TextField,
  Typography,
  Box,
  Paper,
} from "@mui/material";

const App = () => {
  const canvasRef = useRef(null);
  const [addressOne, setAddressOne] = useState(""); // First text box
  const [addressTwo, setAddressTwo] = useState(""); // Second text box

  // Load Google font dynamically
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Rasa:ital,wght@0,300..700;1,300..700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  // Draw canvas with background image and text
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const background = new Image();
    background.src = `./background.jpeg`; // Ensure this file is in /public
    background.crossOrigin = "anonymous";

    background.onload = () => {
      canvas.width = background.width;
      canvas.height = background.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(background, 0, 0);

      // Wait for font to load before drawing text
      document.fonts.load("50px Rasa").then(() => {
        
        
        ctx.font = `bold 50px Rasa`;
        ctx.fillStyle = "#4f2f02";
        ctx.textAlign = "center";

        // Draw first text
        ctx.fillText(addressOne, canvas.width / 2, canvas.height - 110);

        // Draw second text
        ctx.fillText(addressTwo, canvas.width / 2, canvas.height - 40);

        ctx.font = `bold 50px Rasa`;
        ctx.fillStyle = "#4f2f02";
        ctx.textAlign = "center";

        // Draw first text
        ctx.fillText(addressOne, canvas.width / 2, canvas.height - 110);

        // Draw second text
        ctx.fillText(addressTwo, canvas.width / 2, canvas.height - 40);
      });
    };
  }, [addressOne, addressTwo]);

  // Download canvas as image
  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "canvas-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Canvas Image Generator
      </Typography>
      <Grid container spacing={2}>
        {/* Input Panel */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <TextField
              fullWidth
              label="Enter First Text"
              variant="outlined"
              value={addressOne}
              onChange={(e) => setAddressOne(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Enter Second Text"
              variant="outlined"
              value={addressTwo}
              onChange={(e) => setAddressTwo(e.target.value)}
            />
          </Paper>
        </Grid>

        {/* Canvas Preview & Download */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
            <canvas
              ref={canvasRef}
              style={{
                border: "1px solid #000",
                maxWidth: "100%",
              }}
            ></canvas>
            <Button
              variant="contained"
              color="secondary"
              onClick={downloadCanvas}
              sx={{ mt: 2 }}
            >
              Download Canvas
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default App;
