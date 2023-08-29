// `app/dashboard/page.tsx` is the UI for the `/dashboard` URL
"use client";
import React, { useState } from "react";
import HighlightableText from "../components/HighlightableText";
import Highlighted from "../components/Highlight";

export default function Page() {
  const [editableText, setHighlightedText] = useState<string>(
    "Editable text. This is the area where we could edit text "
  );
  const [allHighlightedText, setAllHighlightedText] = useState<string>(""); // Store all highlighted text

  const handleHighlight = (text: string) => {
    setAllHighlightedText(allHighlightedText + " " + text); // Append highlighted text
  };

  return (
    <div>
      <h1>Highlightable Text App</h1>
      <HighlightableText
        onHighlight={handleHighlight}
        editableText={editableText}
      />

      <div>
        <h2>All Highlighted Text</h2>
        <p>{allHighlightedText}</p>
      </div>
    </div>
  );
}
