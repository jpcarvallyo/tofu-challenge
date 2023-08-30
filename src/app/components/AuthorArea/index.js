import React from "react";
import ContentEditable from "react-contenteditable";
import "./style.css";

const AuthorArea = ({
  handleHighlight,
  content,
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
