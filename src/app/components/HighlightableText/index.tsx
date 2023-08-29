"use client";

import React, { useRef, useState } from "react";
import Highlighted from "../Highlight";
import "./style.css";

interface HighlightableTextProps {
  onHighlight: (text: string) => void;
  editableText: string;
}

const HighlightableText: React.FC<HighlightableTextProps> = ({
  onHighlight,
  editableText,
}) => {
  const [highlights, setHighlights] = useState<string[]>([]);

  const handleHighlight = () => {
    const selection = window.getSelection();
    if (selection) {
      const text = selection.toString();
      if (text.length > 0) {
        onHighlight(text);
        setHighlights([...highlights, text]);
      }
    }
  };

  const renderHighlightedText = (text: string) => {
    const parts = text.split(" ");
    return parts.map((part, index) => {
      const isHighlighted = highlights.includes(part);
      console.log(`isHighlighted: ${isHighlighted}`);
      return (
        // <span
        //   key={index}
        //   className={isHighlighted ? "highlighted-part" : ""}
        //   style={isHighlighted ? { backgroundColor: "yellow" } : {}}
        // >
        //   {part}
        // </span>
        <Highlighted key={index} text={text} highlight={part} />
      );
    });
  };

  return (
    <div>
      <div
        className="highlightable-text"
        onMouseUp={handleHighlight}
        contentEditable
      >
        {renderHighlightedText(editableText)}
      </div>
    </div>
  );
};

export default HighlightableText;
