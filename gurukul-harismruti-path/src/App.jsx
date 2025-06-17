import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Grid,
  TextField,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import details from './constant.json'; // Import your CSS file for additional styles

const App = () => {
  const canvasRef = useRef(null);
  const [date, setDate] = useState("27"); // Date text (e.g., 27)
  const [month, setMonth] = useState("જુલાઈ"); // Month text (e.g., July in Gujarati)
  const [yajamanOne, setYajmanOne] = useState("પ.ભ. શ્રી દિનેશભાઇ કાતરીયા"); // Yajman name or line 1
  const [yajamanTwo, setYajmanTwo] = useState("મોં. 98790 43703"); // Yajman contact or line 2
  const [addressOne, setAddressOne] = useState("શ્રી સ્વામિનારાયણ ગુરુકુળ રાજકોટ સંસ્થાન"); // Address line 1
  const [addressTwo, setAddressTwo] = useState("અમદાવાદ નિકોલ"); // Address line 2

  // Load Google Font (Rasa) dynamically on component mount
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Rasa:ital,wght@0,300..700;1,300..700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  // Draw content on canvas when input values change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const background = new Image();
    background.src = `./background.jpeg`; // Ensure this image exists in the /public folder
    background.crossOrigin = "anonymous";

    background.onload = () => {
      canvas.width = background.width;
      canvas.height = background.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(background, 0, 0);

      // Load font before drawing text
      document.fonts.load("50px Rasa").then(() => {
        ctx.textAlign = "center";

        // Month text
        ctx.fillStyle = "#f7d9b4";
        ctx.font = `bold 70px Rasa`;
        ctx.fillText(month, (canvas.width / 2) + 100, canvas.height - 945);

        // Date text
        ctx.fillStyle = "#4f2f02";
        ctx.font = `bold 100px Rasa`;
        ctx.fillText(date, (canvas.width / 2) - 100, canvas.height - 935);

        // Yajman info
        ctx.font = `bold 70px Rasa`;
        ctx.fillText(yajamanOne, canvas.width / 2, canvas.height - 590);
        ctx.fillText(yajamanTwo, canvas.width / 2, canvas.height - 510);

        // Address info
        ctx.font = `bold 50px Rasa`;
        ctx.fillText(addressOne, canvas.width / 2, canvas.height - 110);
        ctx.fillText(addressTwo, canvas.width / 2, canvas.height - 40);
      });
    };
  }, [addressOne, addressTwo, date, month, yajamanOne, yajamanTwo]);

  // Download the canvas content as a PNG image
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
        {details.appName}
      </Typography>
      <Grid container spacing={2}>
        {/* Input Form Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <TextField
              fullWidth
              label="Enter Date"
              variant="outlined"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Enter Month Text"
              variant="outlined"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Enter Yajman First Text"
              variant="outlined"
              value={yajamanOne}
              onChange={(e) => setYajmanOne(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Enter Yajman Second Text"
              variant="outlined"
              value={yajamanTwo}
              onChange={(e) => setYajmanTwo(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Enter Address First Text"
              variant="outlined"
              value={addressOne}
              onChange={(e) => setAddressOne(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Enter Address Second Text"
              variant="outlined"
              value={addressTwo}
              onChange={(e) => setAddressTwo(e.target.value)}
            />
          </Paper>
        </Grid>

        {/* Canvas Preview and Download Section */}
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
