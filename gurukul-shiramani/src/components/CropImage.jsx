import React, { useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const CropImage = ({ onCropComplete }) => {
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1 });
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (crop) => {
    if (image && crop.width && crop.height) {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      const croppedImage = canvas.toDataURL("image/jpeg");
      onCropComplete(croppedImage);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {src && (
        <ReactCrop
          src={src}
          crop={crop}
          onChange={(newCrop) => setCrop(newCrop)}
          onComplete={handleCropComplete}
        >
          <img
            src={src}
            alt="Crop"
            onLoad={(e) => setImage(e.currentTarget)}
          />
        </ReactCrop>
      )}
    </div>
  );
};

export default CropImage;
