import React, { useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { Button, Dialog } from "@mui/material";

const App = () => {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([null, null, null, null]);
  const [croppedImages, setCroppedImages] = useState([null, null, null, null]);
  const [text, setText] = useState("");
  const [currentCropIndex, setCurrentCropIndex] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropArea, setCropArea] = useState(null);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);

  const cropSizes = [
    { width: 1250, height: 600 },
    { width: 150, height: 100 },
    { width: 160, height: 90 },
    { width: 1250, height: 600 },
  ];

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
      drawCanvas(newCroppedImages, text);
    };
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    drawCanvas(croppedImages, newText);
  };

  // const drawCanvas = (uploadedImages, inputText) => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext("2d");

  //   const background = new Image();
  //   background.src = "../public/background.jpeg"; // Replace with your background image path
  //   background.crossOrigin = "anonymous";
  //   background.onload = () => {
  //     canvas.width = background.width;
  //     canvas.height = background.height;

  //     ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  //     uploadedImages.forEach((imageSrc, idx) => {
  //       if (imageSrc) {
  //         const img = new Image();
  //         img.src = imageSrc;
  //         img.onload = () => {
  //           const positions = [
  //             { x: 95, y: 400 },
  //             { x: 200, y: 50 },
  //             { x: 50, y: 200 },
  //             { x: 200, y: 200 },
  //           ];
  //           const { x, y } = positions[idx];
  //           const { width, height } = cropSizes[idx] || {};
  //           if (width && height) {
  //             ctx.drawImage(img, x, y, width, height);
  //           }
  //         };
  //       }
  //     });

  //     ctx.font = "20px Arial";
  //     ctx.fillStyle = "#FFFFFF";
  //     ctx.fillText(inputText, 50, 400);
  //   };
  // };


  const drawCanvas = (uploadedImages, inputText) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
  
    const background = new Image();
    background.src = "../public/background.jpeg"; // Replace with your background image path
    background.crossOrigin = "anonymous";
    background.onload = () => {
      canvas.width = background.width;
      canvas.height = background.height;
  
      // Draw the background image
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  
      uploadedImages.forEach((imageSrc, idx) => {
        if (imageSrc) {
          const img = new Image();
          img.src = imageSrc;
          img.onload = () => {
            const positions = [
             { x: 95, y: 400 },
              { x: 200, y: 50 },
              { x: 50, y: 200 },
              { x: 95, y: 1700 },
            ];
            const { x, y } = positions[idx];
            const { width, height } = cropSizes[idx] || {};
            const cornerRadius = 20; // Adjust the radius of the corners
  
            if (width && height) {
              // Save the canvas state
              ctx.save();
  
              // Draw rounded rectangle clipping path
              ctx.beginPath();
              ctx.moveTo(x + cornerRadius, y);
              ctx.lineTo(x + width - cornerRadius, y);
              ctx.quadraticCurveTo(x + width, y, x + width, y + cornerRadius);
              ctx.lineTo(x + width, y + height - cornerRadius);
              ctx.quadraticCurveTo(
                x + width,
                y + height,
                x + width - cornerRadius,
                y + height
              );
              ctx.lineTo(x + cornerRadius, y + height);
              ctx.quadraticCurveTo(x, y + height, x, y + height - cornerRadius);
              ctx.lineTo(x, y + cornerRadius);
              ctx.quadraticCurveTo(x, y, x + cornerRadius, y);
              ctx.closePath();
              ctx.clip();
  
              // Draw the image inside the rounded rectangle
              ctx.drawImage(img, x, y, width, height);
  
              // Restore the canvas state
              ctx.restore();
            }
          };
        }
      });
  
      // Draw the text
      ctx.font = "20px Arial";
      ctx.fillStyle = "#FFFFFF"; // White color
      ctx.fillText(inputText, 50, 400);
    };
  };
  
  
  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "canvas-image.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div>
      <h1>Canvas Image Generator with Fixed Size Cropping</h1>
      {[...Array(4)].map((_, index) => (
        <div key={index}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(index, e)}
          />
        </div>
      ))}
      <input
        type="text"
        placeholder="Enter text"
        value={text}
        onChange={handleTextChange}
      />
      <canvas ref={canvasRef} style={{ border: "1px solid #000" }}></canvas>
      <button onClick={downloadCanvas}>Download Canvas</button>

      <Dialog open={isCropDialogOpen} onClose={() => setIsCropDialogOpen(false)}>
        <div style={{ width: "400px", height: "400px", position: "relative" }}>
          {images[currentCropIndex] && cropSizes[currentCropIndex] && (
            <Cropper
              image={images[currentCropIndex]}
              crop={crop}
              zoom={zoom}
              aspect={
                cropSizes[currentCropIndex].width / cropSizes[currentCropIndex].height
              }
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          )}
        </div>
        <Button onClick={cropImage}>Crop</Button>
      </Dialog>
    </div>
  );
};

export default App;
