import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import "./style.css";

const ComponentListItem = ({ data, index, handleDelete }) => {
  return (
    <div className="componentlistItem" dataset-uuid={data[0]}>
      <div>
        <p>{index + 1}</p>
      </div>
      <div className="textCtn">
        <p>{data[1].text}</p>
      </div>
      <div id={data[0]} className="iconContainer" onClick={handleDelete}>
        <CloseIcon className="closeIcon" />
      </div>
    </div>
  );
};

export default ComponentListItem;
