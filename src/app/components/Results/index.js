import React from "react";
import "./style.css";

const ResultsButtons = ({
  variations,
  handleResultsClick,
  selectedVariant = { selectedVariant },
}) => {
  const buttons = [];
  for (let index = 0; index < variations; index++) {
    buttons.push(`Variation ${index + 1}`);
  }
  return buttons.map((item, index) => (
    <button
      className={`resultsBtn ${selectedVariant === index ? "active" : ""}`}
      key={index}
      onClick={() => handleResultsClick(index)}
    >
      {item}
    </button>
  ));
};

const Results = ({
  results,
  handleResultsClick,
  selectedVariant = { selectedVariant },
}) => {
  const result = results[0];
  return (
    <section id="results">
      <h5>Results</h5>
      <div className="resultBtnCtn">
        {result && result.params && (
          <ResultsButtons
            variations={result.params.num_of_variations}
            handleResultsClick={handleResultsClick}
            selectedVariant={selectedVariant}
          />
        )}
      </div>
    </section>
  );
};

export default Results;
