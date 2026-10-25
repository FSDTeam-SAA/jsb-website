"use client";
import React, { useState } from "react";
import ScrollToTop from "react-scroll-to-top";
import { ArrowUp, ChevronsUp } from "lucide-react";

const ScrollToTopComponent = () => {
  const [hoverIcon, setHoverIcon] = useState(false);
  return (
    <div>
      <ScrollToTop
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "2px solid hsl(var(--primary))",
          background: "white",
          width: "56px",
          height: "56px",
          borderRadius: "9999px",
          padding: 0,
          right: "24px",
          bottom: "24px",
          zIndex: 100,
        }}
        smooth
        component={
          hoverIcon ? (
            <ArrowUp className="w-[30px] h-[30px] text-secondary" />
          ) : (
            <ChevronsUp className="w-[30px] h-[30px] text-secondary" />
          )
        }
        onMouseEnter={()=>setHoverIcon(true)}
        onMouseLeave={()=>setHoverIcon(false)}
      />
    </div>
  );
};

export default ScrollToTopComponent;
