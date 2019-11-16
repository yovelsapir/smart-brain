import React from "react";
import "./FaceRecognition.css";

const boundingBoxes = box => {
  return box.map((box, i) => (
    <div
      key={i}
      className="bounding-box"
      style={{
        top: box.topRow,
        right: box.rightCol,
        bottom: box.bottomRow,
        left: box.leftCol
      }}
    ></div>
  ));
};

const FaceRecognition = ({ imageUrl, box }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img id="inputimage" alt="" src={imageUrl} width="500px" heigh="auto" />
        {boundingBoxes(box)}
      </div>
    </div>
  );
};

export default FaceRecognition;
