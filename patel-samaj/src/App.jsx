import React, { useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import {
  Button,
  Dialog,
  Grid,
  TextField,
  Typography,
  Box,
  Paper,
} from "@mui/material";

const App = () => {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([null, null, null, null]);
  const [croppedImages, setCroppedImages] = useState([null, null, null, null]);
  const [text, setText] = useState(""); // First text box
  const [currentCropIndex, setCurrentCropIndex] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropArea, setCropArea] = useState(null);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);

  const cropSizes = [
    { width: 380, height: 380 },
  ];

  useEffect(() => {
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?family=Rasa:ital,wght@0,300..700;1,300..700&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const handleImageUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newImages = [...images];
        newImages[index] = reader.result;
        setImages(newImages);
        setCurrentCropIndex(index);
        setIsCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (_, croppedAreaPixels) => {
    setCropArea(croppedAreaPixels);
  };

  const cropImage = () => {
    const image = new Image();
    image.src = images[currentCropIndex];
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const { width, height } = cropSizes[currentCropIndex] || {};

      if (!width || !height) {
        console.error("Crop size is undefined for the current index.");
        return;
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(
        image,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        width,
        height
      );

      const croppedImage = canvas.toDataURL();
      const newCroppedImages = [...croppedImages];
      newCroppedImages[currentCropIndex] = croppedImage;
      setCroppedImages(newCroppedImages);
      setIsCropDialogOpen(false);
    };
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
  
    const background = new Image();
    background.src = "./background.jpg"; // Replace with your background image path
    background.crossOrigin = "anonymous";
    background.onload = () => {
      canvas.width = background.width;
      canvas.height = background.height;
  
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  
      croppedImages.forEach((imageSrc, idx) => {
        if (imageSrc) {
          const img = new Image();
          img.src = imageSrc;
          img.onload = () => {
            const positions = [
              { x: 875, y: 1120 },
            ];
            const { x, y } = positions[idx];
            const { width, height } = cropSizes[idx] || {};
            const radius = Math.min(width, height) / 2;
  
            if (width && height) {
              ctx.save();
              ctx.beginPath();
              ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI);
              ctx.closePath();
              ctx.clip();
              ctx.drawImage(img, x, y, width, height);
              ctx.restore();
            }
          };
        }
      });
  
      ctx.font = `bold 70px 'Rasa', sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
  
      // Draw first text
      ctx.fillText(text, 550, canvas.height - 190);
      };
  };
  

  // Automatically redraw the canvas whenever `croppedImages`, `text` changes
  useEffect(() => {
    drawCanvas();
  }, [croppedImages, text]);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "canvas-image.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Selfie Image Generator
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            {[...Array(1)].map((_, index) => (
              <Box key={index} mb={2}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  color="primary"
                >
                  Upload Image {index + 1}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => handleImageUpload(index, e)}
                  />
                </Button>
              </Box>
            ))}
            <TextField
              fullWidth
              label="Enter Full Name / તમારું  નામ  દાખલ કરો "
              variant="outlined"
              value={text}
              onChange={handleTextChange}
              sx={{ mb: 2 }}
            />
          </Paper>
        </Grid>
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
      <Dialog open={isCropDialogOpen} onClose={() => setIsCropDialogOpen(false)}>
        <Box
          style={{
            width: "400px",
            height: "400px",
            position: "relative",
          }}
        >
          {images[currentCropIndex] && cropSizes[currentCropIndex] && (
            <Cropper
              image={images[currentCropIndex]}
              crop={crop}
              zoom={zoom}
              aspect={
                cropSizes[currentCropIndex].width /
                cropSizes[currentCropIndex].height
              }
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          )}
        </Box>
        <Button onClick={cropImage} fullWidth variant="contained">
          Crop
        </Button>
      </Dialog>
    </Box>
  );
};

export default App;
