// MouseAnimation.jsx

import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const MouseAnimation = () => {
  const location = useLocation();

  useEffect(() => {
    // Exclude any route that starts with "/dashboard"
    if (!location.pathname.startsWith("/dashboard")) {
      // Your existing animation code goes here
      const colors = ["#6fcbff"];
      const circles = Array.from({ length: 20 }, (_, index) => {
        const circle = document.createElement("div");
        circle.classList.add("circle");
        circle.x = 0;
        circle.y = 0;
        circle.style.backgroundColor = colors[index % colors.length];
        document.body.appendChild(circle);
        return circle;
      });

      let coords = { x: 0, y: 0 };

      window.addEventListener("mousemove", function (e) {
        coords.x = e.clientX;
        coords.y = e.clientY;
      });

      function animateCircles() {
        let x = coords.x;
        let y = coords.y;

        circles.forEach(function (circle, index) {
          circle.style.left = x - 12 + "px";
          circle.style.top = y - 12 + "px";

          circle.style.transform = `scale(${
            (circles.length - index) / circles.length
          })`;

          circle.x = x;
          circle.y = y;

          const nextCircle = circles[index + 1] || circles[0];
          x += (nextCircle.x - x) * 0.3;
          y += (nextCircle.y - y) * 0.3;
        });

        requestAnimationFrame(animateCircles);
      }

      animateCircles();
    }
  }, [location.pathname]);

  return null;
};

export default MouseAnimation;
