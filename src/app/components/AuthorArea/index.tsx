import React from "react";
import ContentEditable from "react-contenteditable";
import "./style.css";
import { ContentChangeEvent } from "../types";
("../types");

interface AuthorAreaProps {
  handleHighlight: () => void;
  content: string;
  highlightedText: string[];
  onContentChange: (evt: ContentChangeEvent) => void;
}

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
