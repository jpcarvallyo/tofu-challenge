/* eslint-disable react-hooks/exhaustive-deps */
// `app/dashboard/page.tsx` is the UI for the `/dashboard` URL
"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  makeAuthenticatedRequest,
  patchContent,
  postResults,
} from "../utils/api";
import {
  processTextWithMarks,
  highlightTextNode,
  replaceTextInHtmlString,
  addComponentOrder,
} from "../utils/methods";
import AuthorArea from "../components/AuthorArea";
import AuthorConfig from "../components/AuthorConfig";
import "./style.css";

export default function Page() {
  const [pageState, setPageState] = useState({
    highlightedText: null,
    content: null,
    data: null,
    selectedVariant: null,
    targetOption: null,
  });

  const onContentBlur = useCallback(
    (evt) => {
      evt.stopPropagation();
      const authorAreaNode =
        document.querySelector("#authorArea > div").textContent;
      const node = highlightTextNode(authorAreaNode, pageState.highlightedText);
      const componentsUpdate = processTextWithMarks(node);

      const updatedComponents = {
        components: { ...componentsUpdate },
      };
      addComponentOrder(node, updatedComponents.components);

      patchContent(updatedComponents);
      setPageState({
        ...pageState,
        content: node,
        components: updatedComponents,
      });
    },
    [pageState]
  );

  const handleHighlight = () => {
    const selection = window.getSelection();
    const selectionStr = selection.toString();
    const { highlightedText } = pageState;
    if (
      selection.anchorOffset !== selection.extentOffset ||
      highlightedText.find((item) => item.value === selectionStr)
    ) {
      const text = selection.toString();
      setPageState((prev) => {
        let foundItem = prev.highlightedText.find((item) => item.text === text);
        // Dehighlighting logic:
        if (foundItem) {
          // update data with useState to remove UUID from the components obj within data
          if (highlightedText.length === 1) {
            return pageState;
          }
          const idToDelete = foundItem.uuid;
          const dataToUpdate = { ...pageState.data };
          const componentsArr = Object.keys(dataToUpdate.components);
          const filteredArr = pageState.highlightedText.filter(
            (item) => item.uuid !== idToDelete
          );
          const authorAreaNode =
            document.querySelector("#authorArea > div").textContent;
          const text = highlightTextNode(authorAreaNode, filteredArr);

          addComponentOrder(text, dataToUpdate.components);

          const componentArray = Object.entries(dataToUpdate.components);

          // Sort the array based on the `meta.order` property
          componentArray.sort((a, b) => {
            const orderA = Number(a[1].meta.order);
            const orderB = Number(b[1].meta.order);
            return orderA - orderB;
          });
          let index = 0;
          const preceding =
            dataToUpdate.components[idToDelete].meta.precedingContent;
          const textNode = dataToUpdate.components[idToDelete].text;
          const succeeding =
            dataToUpdate.components[idToDelete].meta.succeedingContent;

          // Iterate through the sorted components
          for (const [id, component] of componentArray) {
            if (id === idToDelete) {
              if (index === componentsArr.length - 1) {
                dataToUpdate.components[
                  componentsArr[index - 1]
                ].meta.succeedingContent = `${
                  dataToUpdate.components[componentsArr[index - 1]].meta
                    .succeedingContent
                } ${preceding} ${textNode} ${succeeding}`;
              } else if ((index = 0)) {
                dataToUpdate.components[
                  componentsArr[index + 1]
                ].meta.precedingContent = `${preceding} ${textNode} ${succeeding} ${
                  dataToUpdate.components[componentsArr[index + 1]].meta
                    .precedingContent
                }`;
              } else {
                dataToUpdate.components[
                  componentsArr[index + 1]
                ].meta.precedingContent = `${preceding} ${textNode} ${succeeding}`;
              }
            }
            index++;
          }

          delete dataToUpdate.components[idToDelete];
          patchContent({ components: dataToUpdate.components });

          // SEND POST with updated components

          return {
            ...prev,
            data: { ...dataToUpdate },
            content: text,
            highlightedText: filteredArr,
          };
        } else {
          // Adding highlight logic:
          const newUUID = uuidv4();
          const newData = {
            ...prev.data,
            components: {
              ...prev.data.components,
              [newUUID]: {
                meta: {
                  precedingContent: "",
                  succeedingContent: "",
                  order: "",
                },
                text,
              },
            },
          };
          const authorAreaNode =
            document.querySelector("#authorArea > div").textContent;
          const newHighlightedArr = [
            ...prev.highlightedText,
            { text, uuid: newUUID },
          ];

          const node = highlightTextNode(authorAreaNode, newHighlightedArr);
          const componentsUpdate = processTextWithMarks(node);

          const updatedComponents = {
            components: { ...componentsUpdate },
          };
          addComponentOrder(node, updatedComponents.components);

          patchContent(updatedComponents);

          return {
            ...prev,
            highlightedText: newHighlightedArr,
            data: newData,
            content: node,
          };
        }
      });
    }
  };

  const handleComponentDelete = (evt) => {
    const { id: idToDelete } = evt.currentTarget;
    let dataToUpdate = { ...pageState.data };
    const componentsArr = Object.keys(dataToUpdate.components);
    const filteredArr = pageState.highlightedText.filter(
      (item) => item.uuid !== idToDelete
    );
    const text = highlightTextNode(pageState.content, filteredArr);
    const preceding = dataToUpdate.components[idToDelete].meta.precedingContent;
    const textNode = dataToUpdate.components[idToDelete].text;
    const succeeding =
      dataToUpdate.components[idToDelete].meta.succeedingContent;
    if (pageState.highlightedText.length > 1) {
      addComponentOrder(text, dataToUpdate.components);

      const componentArray = Object.entries(dataToUpdate.components);

      // Sort the array based on the `meta.order` property
      componentArray.sort((a, b) => {
        const orderA = Number(a[1].meta.order);
        const orderB = Number(b[1].meta.order);
        return orderA - orderB;
      });
      let index = 0;

      // Iterate through the sorted components
      for (const [id, component] of componentArray) {
        if (id === idToDelete) {
          if (index === componentsArr.length - 1) {
            dataToUpdate.components[
              componentsArr[index - 1]
            ].meta.succeedingContent = `${
              dataToUpdate.components[componentsArr[index - 1]].meta
                .succeedingContent
            } ${preceding} ${textNode} ${succeeding}`;
          } else if (index === 0) {
            dataToUpdate.components[
              componentsArr[index + 1]
            ].meta.precedingContent = `${preceding} ${textNode} ${succeeding} ${
              dataToUpdate.components[componentsArr[index + 1]].meta
                .precedingContent
            }`;
          } else {
            dataToUpdate.components[
              componentsArr[index + 1]
            ].meta.precedingContent = `${preceding} ${textNode} ${succeeding}`;
          }
        }
        index++;
      }
      delete dataToUpdate.components[idToDelete];
    } else {
      return;
    }

    patchContent({ components: dataToUpdate.components });

    setPageState({
      ...pageState,
      data: { ...dataToUpdate },
      highlightedText: filteredArr,
      content: text,
    });
  };

  const handleGenerate = async () => {
    const postData = {
      tag: uuidv4(),
      params: {
        content_type: "Text",
        num_of_variations: 3,
        targets: {
          Persona: pageState.targetOption,
        },
        custom_instructions: pageState.data.content_params.custom_instructions,
      },
    };
    const results = await postResults(postData);
    setPageState({
      ...pageState,
      data: {
        ...pageState.data,
        results: [results],
      },
      selectedVariant: null,
    });
  };

  const fetchData = async () => {
    try {
      const response = await makeAuthenticatedRequest("GET", "content", "1521");
      const highlightedPieces = [];
      let text = "";
      let index = 0;
      const componentEntries = Object.entries(response[0].components);
      if (componentEntries.every((item) => item[1].meta.order)) {
        componentEntries.sort(
          (a, b) => Number(a[1].meta.order) - Number(b[1].meta.order)
        );
      }

      for (const [component, value] of componentEntries) {
        text += `${value.meta.precedingContent} ${value.text} ${value.meta.succeedingContent}`;
        highlightedPieces.push({ text: value.text, uuid: component });
        index++;
      }

      const node = highlightTextNode(text, highlightedPieces) + "<br>";
      setPageState({
        ...pageState,
        data: response[0],
        content: node,
        highlightedText: highlightedPieces,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleTargetChange = (event) => {
    setPageState({ ...pageState, targetOption: event.target.value });
  };

  const handleCustomPrompts = (prompts) => {
    setPageState({
      ...pageState,
      data: {
        ...pageState.data,
        content_params: {
          ...pageState.data.content_params,
          custom_instructions: prompts,
        },
      },
    });
  };

  const handleResultsClick = (index) => {
    const variantContent = [];

    for (const componentID of Object.keys(pageState.data.components)) {
      const { variations, current_variation_index } =
        pageState.data.results[0].variations[componentID].meta;

      variantContent.push({
        uuid: componentID,
        text: variations[index + current_variation_index].text,
      });
    }

    let newContent = "";
    for (let i = 0; i < variantContent.length; i++) {
      const contentStr = i === 0 ? pageState.content : newContent;
      newContent = replaceTextInHtmlString(
        contentStr,
        variantContent[i].uuid,
        variantContent[i].text
      );
    }

    setPageState({
      ...pageState,
      selectedVariant: index,
      highlightedText: variantContent,
      content: newContent,
    });
  };

  useEffect(() => {
    if (!pageState.data) {
      fetchData();
    }
  }, []);

  return (
    <main>
      {pageState.data && (
        <AuthorConfig
          selectedVariant={pageState.selectedVariant}
          handleDelete={handleComponentDelete}
          handleGenerate={handleGenerate}
          pageState={pageState}
          handleResultsClick={handleResultsClick}
          handleTargetChange={handleTargetChange}
          handleCustomPrompts={handleCustomPrompts}
        ></AuthorConfig>
      )}
      {pageState.content && (
        <AuthorArea
          handleHighlight={handleHighlight}
          content={pageState.content}
          highlightedText={pageState.highlightedText}
          onContentBlur={onContentBlur}
        ></AuthorArea>
      )}
    </main>
  );
}
