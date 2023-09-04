import React from "react";
import ComponentList from "../ComponentList";
import Results from "../Results";
import InputTags from "../InputTags";
import "./style.css";

const AuthorConfig = ({
  handleDelete,
  handleGenerate,
  selectedVariant,
  handleResultsClick,
  handleTargetChange,
  handleCustomPrompts,
  pageState,
}) => {
  const listArr = Array.from(Object.values(pageState.data.components));
  return (
    <aside id="authorConfig">
      {listArr && (
        <ComponentList
          handleDelete={handleDelete}
          selectedVariant={selectedVariant}
          pageState={pageState}
        />
      )}
      <div id="targetCtn">
        <h5>Targets</h5>
        <select
          value={pageState.data.targetOption}
          onChange={handleTargetChange}
        >
          <option value="CEO">CEO</option>
          <option value="Teach Lead">Tech Lead</option>
          <option value="Product Lead">Product Lead</option>
        </select>
      </div>
      <InputTags
        data={pageState.data}
        handleCustomPrompts={handleCustomPrompts}
      />
      <Results
        results={pageState.data.results}
        handleResultsClick={handleResultsClick}
        selectedVariant={selectedVariant}
      />
      <button onClick={handleGenerate}>
        {pageState.data.results.length > 0 ? "Re-Generate" : "Generate"}
      </button>
    </aside>
  );
};

export default AuthorConfig;
