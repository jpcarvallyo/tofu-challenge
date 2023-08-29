// `app/dashboard/page.tsx` is the UI for the `/dashboard` URL
"use client";
import React, { useState, useEffect } from "react";
import sanitizeHtml from "sanitize-html";
import AuthorArea from "../components/AuthorArea";

export default function Page() {
  const [highlightedText, setHighlightedText] = useState<string[]>([]);
  const [content, setContent] = React.useState(
    "Here is the original bish, highlight me all day"
  );

  const onContentChange = React.useCallback(
    (evt: { currentTarget: { innerHTML: any } }) => {
      const sanitizeConf = {
        allowedTags: ["b", "i", "a", "p"],
        allowedAttributes: { a: ["href"] },
      };

      setContent(sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf));
    },
    []
  );
  const handleHighlight = () => {
    const selection = window.getSelection();
    if (selection) {
      const text = selection.toString();
      setHighlightedText((prev) => [...prev, text]);
      console.log(highlightedText);
      // needs to generate a UUID
    }
  };

  useEffect(() => {
    // This needs to read what has been highlighted and then run the array of highlighted items with their corresponding UUID.
    console.log("Updated highlightedText:", highlightedText);
  }, [highlightedText]);

  return (
    <div>
      <h1>Highlightable Text App</h1>
      <AuthorArea
        handleHighlight={handleHighlight}
        content={content}
        highlightedText={highlightedText}
        onContentChange={onContentChange}
      ></AuthorArea>
      <h1>{highlightedText}</h1>
    </div>
  );
}
