// `app/dashboard/page.tsx` is the UI for the `/dashboard` URL
"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { renderToString } from "react-dom/server";
import sanitizeHtml from "sanitize-html";
import { escapeRegExp } from "lodash";
import AuthorArea from "../components/AuthorArea";
import Highlighted from "../components/Highlight";

export default function Page() {
  const [highlightedText, setHighlightedText] = useState<any>([]);
  // const [content, setContent] = useState<string>(
  //   "Here is the original bish, <mark>highlight</mark> me all day"
  // );
  const content = useRef(
    "Here is the original bish, <mark>highlight</mark> me all day"
  );

  const onContentChange = useCallback(
    (evt: { currentTarget: { innerHTML: any } }) => {
      // const sanitizeConf = {
      //   allowedTags: ["b", "i", "a", "p", "mark"],
      //   allowedAttributes: { a: ["href"], mark: ["key"] },
      // };

      // setContent(sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf));
      // setContent(evt.currentTarget.innerHTML);
      // content.current = evt.currentTarget.innerHTML;
      // content.current = evt.currentTarget.innerHTML;
      enhanceText();
    },
    []
  );
  const handleHighlight = () => {
    const selection: any = window.getSelection();
    if (selection.anchorOffset !== selection.extentOffset) {
      const text = selection.toString();
      setHighlightedText((prev: any) => [...prev, text]);
      console.log(highlightedText);

      // needs to generate a UUID
    }
  };

  const highlightTextNode = (text: string, searchString: string): string => {
    if (!searchString.trim()) {
      return text;
    }

    const regex = new RegExp(`(${escapeRegExp(searchString)})`, "gi");
    const parts = text.split(regex);

    const highlightedParts = parts.map((part, index) =>
      regex.test(part) ? `<mark key=${index}>${part}</mark>` : part
    );

    // return renderToString(<>{highlightedParts.join("")}</>);
    return highlightedParts.join("");
  };

  const enhanceText = () => {
    if (highlightedText.length > 0) {
      // const newNode = highlightedText.map((text) =>
      //   highlightTextNode(content, text)
      // );
      // console.log(newNode);
      const sanitizeConf = {
        allowedTags: ["b", "i", "a", "p", "mark"],
        allowedAttributes: { a: ["href"] },
      };
      const newNode = highlightTextNode(content.current, highlightedText[0]);
      content.current = newNode;
      console.log(newNode);
      // setContent(newNode);
      // console.log(highlightTextNode(content, highlightedText[0]));
    }
  };

  useEffect(() => {
    // This needs to read what has been highlighted and then run the array of highlighted items with their corresponding UUID.
    console.log("Updated highlightedText:", highlightedText);
    // enhanceText();
    enhanceText();
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
      {/* <Highlighted text={content} highlights={highlightedText}></Highlighted> */}
    </div>
  );
}
