// `app/dashboard/page.tsx` is the UI for the `/dashboard` URL
"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { makeAuthenticatedRequest } from "../utils/api";

import { escapeRegExp } from "lodash";
import AuthorArea from "../components/AuthorArea";

export default function Page() {
  const [highlightedText, setHighlightedText] = useState([]);
  const [content, setContent] = useState(null);
  const [data, setData] = useState(null);

  const onContentChange = useCallback((evt) => {}, []);
  const onContentBlur = useCallback((evt) => {
    setContent(evt.currentTarget.innerHTML);
  }, []);
  const handleHighlight = () => {
    const selection = window.getSelection();
    if (selection.anchorOffset !== selection.extentOffset) {
      const text = selection.toString();
      setHighlightedText((prev) => {
        if (prev.find((item) => item === text)) {
          highlightTextNode(
            content,
            prev.filter((item) => item !== text)
          );
          return prev.filter((item) => item !== text);
        } else {
          return [...prev, text];
        }
      });
      setContent(removeMarkTagByUUIDUsingRegex(content, 1));

      console.log(highlightedText);

      // needs to generate a UUID
    }
  };

  const highlightTextNode = (text, searchStringArr) => {
    if (searchStringArr.length === 0) {
      return text;
    }
    for (let i = 0; i < searchStringArr.length; i++) {
      const highPart = searchStringArr[i];
      const regex = new RegExp(`(${escapeRegExp(highPart)})`, "gi");
      const parts = text.split(regex);

      const highlightedParts = parts.map((part, index) =>
        regex.test(part) ? `<mark key=${index}>${part}</mark>` : part
      );

      let node = highlightedParts.join("");
      text = node;
    }
    return text;
  };

  function removeMarkTagByUUIDUsingRegex(htmlString, targetUUID) {
    const regex = new RegExp(
      `<mark key=["']?\\\\?"?${targetUUID}\\\\?"?>(.*?)<\\/mark>`,
      "g"
    );
    return htmlString.replace(regex, "$1");
  }

  const enhanceText = (text) => {
    text = text || content;
    const sanitizeConf = {
      allowedTags: ["b", "i", "a", "p", "mark"],
      allowedAttributes: { a: ["href"] },
    };
    const newNode = highlightTextNode(text, highlightedText);
    console.log("Updated highlightedText:", highlightedText);
    console.log("inside enhance text");
    setContent(newNode);
  };

  const fetchData = () => {
    makeAuthenticatedRequest("GET", "content", "1521")
      .then((data) => {
        console.log(data[0]);
        const text = data[0].components.fullContent.text;
        enhanceText(text);
        return data;
      })
      .catch((error) => {
        // setError(error);
      });
  };

  useEffect(() => {
    if (!data) {
      setData(fetchData());
    }
  }, [data]);

  useEffect(() => {
    // This needs to read what has been highlighted and then run the array of highlighted items with their corresponding UUID.
    enhanceText();
    console.log("Updated highlightedText:", highlightedText);
  }, [highlightedText]);

  return (
    <div>
      <h1>Highlightable Text App</h1>
      {content && (
        <AuthorArea
          handleHighlight={handleHighlight}
          content={content}
          highlightedText={highlightedText}
          onContentChange={onContentChange}
          onContentBlur={onContentBlur}
        ></AuthorArea>
      )}

      <h1>{highlightedText}</h1>
    </div>
  );
}
