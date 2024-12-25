import React from "react";
import "./ImageDisplay.css";

const ImageDisplay = ({ image, boundingBox }) => {
  return (
    <div className="center mt3">
      <div className="image-container">
        <img id="inputImage" src={image} alt="" width="500px" height="auto"/>
        {boundingBox.map((box, index) => (
          <div key={index} className="bounding-box"
            style={{
              top: `${box.top}px`,
              left: `${box.left}px`,
              width: `${box.right - box.left}px`,
              height: `${box.bottom - box.top}px`,
            }}
          >
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageDisplay;

