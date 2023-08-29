import React from "react";
import DOMPurify from "dompurify";
import ContentEditable from "react-contenteditable";
import { renderToString } from "react-dom/server";
import "./style.css";
import { ContentChangeEvent } from "../types";
("../types");

// interface AuthorAreaProps {
//   handleHighlight: () => void;
//   content: any;
//   highlightedText: string[];
//   onContentChange: (evt: ContentChangeEvent) => void;
//   onContentBlur:
// }

const HTMLRenderer = ({ htmlContent }) => {
  const sanitizedHtml = DOMPurify.sanitize(htmlContent);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

const AuthorArea = ({
  handleHighlight,
  content,
  highlightedText,
  onContentChange,
  onContentBlur,
}) => {
  return (
    <ContentEditable
      onChange={onContentChange}
      onBlur={onContentBlur}
      html={content}
      onMouseUp={handleHighlight}
    />
  );
};

export default AuthorArea;
