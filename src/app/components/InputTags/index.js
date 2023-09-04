import React, { useEffect, useState } from "react";
import { TagsInput } from "react-tag-input-component";
import "./style.css";

const InputTags = ({ data, handleCustomPrompts }) => {
  const [selected, setSelected] = useState([
    ...data.content_params.custom_instructions,
  ]);

  useEffect(() => {
    handleCustomPrompts(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div className="customPrompts">
      <h5>Custom Prompts</h5>

      <pre>{JSON.stringify(selected)}</pre>

      <TagsInput
        value={selected}
        onChange={setSelected}
        name="prompts"
        placeHolder="E.g. Use a natural tone"
      />

      <em>press enter to add new tag</em>
    </div>
  );
};

export default InputTags;
