import React, { useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import ComponentListItem from "../ComponentListItem";
import { addComponentOrder } from "../../utils/methods";
import "./style.css";

const ComponentList = ({ handleDelete, selectedVariant, pageState }) => {
  const { components } = pageState.data;
  const [isOpen, setIsOpen] = useState(true);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  addComponentOrder(pageState.content, components);

  let listArr = [];
  if (selectedVariant !== null) {
    for (const componentID of Object.keys(components)) {
      const { variations, current_variation_index } =
        pageState.data.results[0].variations[componentID].meta;

      listArr.push([
        componentID,
        variations[selectedVariant + current_variation_index],
      ]);
    }
  } else {
    listArr = Array.from(Object.entries(components));
  }

  return (
    <div
      id="componentListCtn"
      className={`trigger clickable-component ${isOpen ? "open" : ""}`}
    >
      <div className="componentHeader" onClick={toggleDrawer}>
        <h5>Components</h5>
        <KeyboardArrowUpIcon className={`icon ${isOpen ? "open" : ""}`} />
      </div>
      <div className="drawer-content">
        <div className="infoSection">
          <InfoOutlinedIcon id="infoIcon" />
          <p>Select components you want to change on the right pane.</p>
        </div>
        <div id="components">
          {listArr &&
            listArr
              .sort((a, b) => Number(a[1].meta.order) - Number(b[1].meta.order))
              .map((item, index) => (
                <ComponentListItem
                  data={item}
                  index={index}
                  key={index}
                  handleDelete={handleDelete}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default ComponentList;
