import React, { useCallback } from "react";
import ContentEditable from "react-contenteditable";
import "./style.css";

const AuthorArea = ({ handleHighlight, content, onContentBlur }) => {
  const onContentChange = useCallback((evt) => {}, []);
  return (
    <section id="authorArea">
      <ContentEditable
        onChange={onContentChange}
        onBlur={onContentBlur}
        html={content}
        onMouseUp={handleHighlight}
      />
    </section>
  );
};

export default AuthorArea;
