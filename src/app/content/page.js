// `app/dashboard/page.tsx` is the UI for the `/dashboard` URL
"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { renderToString } from "react-dom/server";
import sanitizeHtml from "sanitize-html";
import useApi from "../utils/hooks/useApi";
import { makeAuthenticatedRequest } from "../utils/api";

import { escapeRegExp } from "lodash";
import AuthorArea from "../components/AuthorArea";
import Highlighted from "../components/Highlight";

export default function Page() {
  // const { responseData, error } = useApi("GET", "content", "1521");
  const [highlightedText, setHighlightedText] = useState([]);
  const [content, setContent] = useState(null);
  const [data, setData] = useState(null);
  // if (error) {
  //   // Handle error
  //   return <div>Error: {error}</div>;
  // }
  // const content = useRef(
  //   "Here is the original bish, <mark>highlight</mark> me all day"
  // );

  const onContentChange = useCallback((evt) => {
    // const sanitizeConf = {
    //   allowedTags: ["b", "i", "a", "p", "mark"],
    //   allowedAttributes: { a: ["href"], mark: ["key"] },
    // };
    // setContent(sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf));
  }, []);
  const onContentBlur = useCallback((evt) => {
    const sanitizeConf = {
      allowedTags: ["b", "i", "a", "p", "mark"],
      allowedAttributes: { a: ["href"], mark: ["key"] },
    };
    // setContent(sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf));
    // setContent(evt.currentTarget.innerHTML);
    console.log(evt.currentTarget.innerHTML);
    enhanceText(evt.currentTarget.innerHTML);
  }, []);
  const handleHighlight = () => {
    const selection = window.getSelection();
    if (selection.anchorOffset !== selection.extentOffset) {
      const text = selection.toString();
      setHighlightedText((prev) => {
        if (prev.find((item) => item === text)) {
          return prev.filter((item) => item !== text);
        } else {
          return [...prev, text];
        }
      });
      // setHighlightedText((prev) =>
      //   !prev.findIndex(text)
      //     ? [...prev, text]
      //     : prev.filter((item) => item !== text)
      // );
      console.log(highlightedText);

      // needs to generate a UUID
    }
  };

  const highlightTextNode = (text, searchStringArr) => {
    let output = "";
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

      // return renderToString(<>{highlightedParts.join("")}</>);
      let node = highlightedParts.join("");
      text = node;
    }
    return text;
  };

  const enhanceText = (text) => {
    text = text || content;
    if (highlightedText.length > 0) {
      const sanitizeConf = {
        allowedTags: ["b", "i", "a", "p", "mark"],
        allowedAttributes: { a: ["href"] },
      };
      const newNode = highlightTextNode(text, highlightedText);
      console.log("inside enhance text");
      setContent(newNode);
    } else {
      setContent(text);
    }
  };

  useEffect(() => {
    // This needs to read what has been highlighted and then run the array of highlighted items with their corresponding UUID.
    enhanceText();
    console.log("Updated highlightedText:", highlightedText);
  }, [highlightedText]);

  // const [data, setData] = useState([]);
  const fetchData = () => {
    makeAuthenticatedRequest("GET", "content", "1521")
      .then((data) => {
        // setResponseData(data);
        console.log(data[0]);
        // setContent(data[0].components.fullContent.text);
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
      {/* <Highlighted text={content} highlights={highlightedText}></Highlighted> */}
    </div>
  );
}
