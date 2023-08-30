import React, { useState, useMemo } from "react";
import { createEditor, Editor, Range, Text, Transforms } from "slate";
import { Slate, Editable, withReact } from "slate-react";

const HighlighterEditor = () => {
  const editor = useMemo(() => withHighlighting(withReact(createEditor())), []);

  const [value, setValue] = useState(initialValue);

  const onChange = (newValue) => {
    setValue(newValue);
  };

  const handleMouseDown = (event) => {
    const selection = editor.selection;
    if (selection) {
      const range = Editor.range(editor, selection);
      highlightRange(range);
    }
  };

  const highlightRange = (range) => {
    const [start, end] = Range.edges(range);
    const highlightText = Editor.string(editor, range);
    const highlight = {
      type: "highlight",
      text: highlightText,
    };

    Transforms.insertNodes(editor, highlight, { at: start });
    Transforms.select(editor, Editor.end(editor, end));
  };

  const renderLeaf = (props) => {
    if (props.leaf.type === "highlight") {
      return <HighlightLeaf {...props} />;
    }
    return <DefaultLeaf {...props} />;
  };

  const HighlightLeaf = ({ attributes, children }) => {
    return (
      <span
        {...attributes}
        style={{ backgroundColor: "yellow", padding: "2px" }}
      >
        {children}
      </span>
    );
  };

  const DefaultLeaf = ({ attributes, children }) => {
    return <span {...attributes}>{children}</span>;
  };

  return (
    <Slate
      editor={editor}
      initialValue={value}
      value={value}
      onChange={onChange}
    >
      <Editable renderLeaf={renderLeaf} onMouseDown={handleMouseDown} />
    </Slate>
  );
};

// Initial value for the editor
const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "Click and drag to highlight text!" }],
  },
];

// Highlighting logic
const withHighlighting = (editor) => {
  const { isInline } = editor;

  editor.isInline = (element) => {
    return element.type === "highlight" ? true : isInline(element);
  };

  return editor;
};

export default HighlighterEditor;
