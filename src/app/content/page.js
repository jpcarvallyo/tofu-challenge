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
    // setContent(evt.currentTarget.innerHTML);
    // content.current = evt.currentTarget.innerHTML;
    // content.current = evt.currentTarget.innerHTML;
    enhanceText();
  }, []);
  const handleHighlight = () => {
    const selection = window.getSelection();
    if (selection.anchorOffset !== selection.extentOffset) {
      const text = selection.toString();
      setHighlightedText((prev) => [...prev, text]);
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
    // searchStringArr.forEach((searchString) => {
    //   if (!searchString.trim()) {
    //     return text;
    //   }

    //   const regex = new RegExp(`(${escapeRegExp(searchString)})`, "gi");
    //   const parts = text.split(regex);

    //   const highlightedParts = parts.map((part, index) =>
    //     regex.test(part) ? `<mark key=${index}>${part}</mark>` : part
    //   );

    //   // return renderToString(<>{highlightedParts.join("")}</>);
    //   let node = highlightedParts.join("");
    //   output += node;
    // });
    // return output;
  };

  const enhanceText = (text) => {
    if (highlightedText.length > 0) {
      // const newNode = highlightedText.map((text) =>
      //   highlightTextNode(content, text)
      // );
      // console.log(newNode);
      const sanitizeConf = {
        allowedTags: ["b", "i", "a", "p", "mark"],
        allowedAttributes: { a: ["href"] },
      };
      const newNode = highlightTextNode(text, highlightedText);
      // const newNode = Highlighted({
      //   text: content.current,
      //   highlights: highlightedText,
      // });
      setContent(newNode);
      console.log(newNode);
      // setContent(newNode);
      // console.log(highlightTextNode(content, highlightedText[0]));
    } else {
      setContent(text);
    }
  };

  useEffect(() => {
    // This needs to read what has been highlighted and then run the array of highlighted items with their corresponding UUID.
    console.log("Updated highlightedText:", highlightedText);
    // enhanceText();
    // console.log(responseData);
    // if (responseData) {
    //   const {
    //     components: { fullContent },
    //   } = responseData;
    //   console.log(fullContent.text);
    // }

    // enhanceText();
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
      })
      .catch((error) => {
        // setError(error);
      });
  };

  useEffect(() => {
    fetchData();
  });

  return (
    <div>
      <h1>Highlightable Text App</h1>
      {content && (
        <AuthorArea
          handleHighlight={handleHighlight}
          content={content}
          highlightedText={highlightedText}
          onContentChange={onContentChange}
        ></AuthorArea>
      )}

      <h1>{highlightedText}</h1>
      {/* <Highlighted text={content} highlights={highlightedText}></Highlighted> */}
    </div>
  );
}
