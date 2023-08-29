import React from "react";
import DOMPurify from "dompurify";
import ContentEditable from "react-contenteditable";
import { renderToString } from "react-dom/server";
import "./style.css";
import { ContentChangeEvent } from "../types";
("../types");

interface AuthorAreaProps {
  handleHighlight: () => void;
  content: any;
  highlightedText: string[];
  onContentChange: (evt: ContentChangeEvent) => void;
}

const HTMLRenderer: React.FC<{ htmlContent: string }> = ({ htmlContent }) => {
  const sanitizedHtml = DOMPurify.sanitize(htmlContent);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

const AuthorArea: React.FC<AuthorAreaProps> = ({
  handleHighlight,
  content,
  highlightedText,
  onContentChange,
}) => {
  return (
    <ContentEditable
      onChange={onContentChange}
      onBlur={onContentChange}
      html={content}
      onMouseUp={handleHighlight}
    />
  );
};

export default AuthorArea;
