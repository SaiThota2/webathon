import React from "react";

const ExpandedImage = ({ imageURL, onClose }) => {
  return (
    <div
      className="fixed backdrop-blur-xl inset-0 flex items-center justify-center z-50 "
      onClick={onClose}
    >
      <img src={imageURL} alt="Expanded" className="max-h-screen max-w-full" />
    </div>
  );
};

export default ExpandedImage;
