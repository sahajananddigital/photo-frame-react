import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";

const CollageCanvas = ({ images }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas("collage-canvas");

    images.forEach((imgSrc, index) => {
      fabric.Image.fromURL(imgSrc, (img) => {
        img.set({
          left: index * 150, // Adjust positioning as needed
          top: 50,
          scaleX: 0.5,
          scaleY: 0.5,
        });
        canvas.add(img);
      });
    });

    return () => canvas.dispose();
  }, [images]);

  return <canvas id="collage-canvas" ref={canvasRef} width="800" height="600" />;
};

export default CollageCanvas;
