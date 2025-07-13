import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

function ImageCarousel({ images = [], title }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return undefined;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <MKBox position="relative" width="100%" height="60vh" overflow="hidden">
      {images.map((img, i) => (
        <MKBox
          component="img"
          src={img}
          alt={`slide-${i}`}
          key={img}
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          sx={{
            objectFit: "cover",
            opacity: i === index ? 1 : 0,
            transition: "opacity 1s ease-in-out",
          }}
        />
      ))}
      {title && (
        <MKTypography
          variant="h2"
          color="white"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          {title}
        </MKTypography>
      )}
    </MKBox>
  );
}

ImageCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.node,
};

export default ImageCarousel;
