import { escapeRegExp } from "lodash";

export function removeMarkTagByUUID(htmlString, targetUUID) {
  const regex = new RegExp(
    `<mark id=["']?\\\\?"?${targetUUID}\\\\?"?>(.*?)<\\/mark>`,
    "g"
  );
  return htmlString.replace(regex, "$1");
}

export const replaceTextInHtmlString = (htmlString, uuid, newText) => {
  const tempElement = document.createElement("div");
  tempElement.innerHTML = htmlString;

  const markElements = tempElement.querySelectorAll("mark");

  markElements.forEach((markElement) => {
    // Check if the <mark> element has a 'data-uuid' attribute with the desired UUID
    if (markElement.getAttribute("id") === uuid) {
      // Replace the content of the <mark> element with the new text
      markElement.textContent = newText;
    }
  });

  const updatedHtmlString = tempElement.innerHTML;

  tempElement.remove();

  return updatedHtmlString;
};

export function processTextWithMarks(textWithMarks) {
  const regex = /<mark id=(.*?)>(.*?)<\/mark>/g;
  const processedData = {};
  const uniqueTextValues = new Set();

  let match;
  let lastIndex = 0;
  let index = 0;

  while ((match = regex.exec(textWithMarks))) {
    const uuid = match[1];
    const text = match[2];

    // Check if this text is already in the uniqueTextValues set
    if (!uniqueTextValues.has(text)) {
      // If not, add it to the set and process the data
      uniqueTextValues.add(text);

      // Clean up precedingContent
      const precedingContent = textWithMarks
        .substring(lastIndex, match.index)
        .trim();

      // Find the next mark element's index
      const nextMarkIndex = textWithMarks.indexOf(
        "<mark id=",
        match.index + match[0].length
      );

      // Clean up succeedingContent by removing any mark elements
      let succeedingContent = textWithMarks
        .substring(
          match.index + match[0].length,
          nextMarkIndex !== -1 ? nextMarkIndex : undefined
        )
        .trim();
      succeedingContent = succeedingContent.replace(
        /<mark[^>]*>.*?<\/mark>/g,
        ""
      );

      processedData[uuid] = {
        meta: {
          precedingContent,
          succeedingContent,
          order: index,
        },
        text: text.trim(),
      };

      lastIndex = match.index + match[0].length;
    }
    index++;
  }

  // Adjust succeedingContent to avoid duplication
  const uuids = Object.keys(processedData);
  for (let i = 0; i < uuids.length - 1; i++) {
    const currentUUID = uuids[i];
    const nextUUID = uuids[i + 1];
    if (
      processedData[currentUUID].meta.succeedingContent ===
      processedData[nextUUID].meta.precedingContent
    ) {
      processedData[nextUUID].meta.precedingContent = processedData[
        nextUUID
      ].meta.precedingContent = "";
    }
  }

  return processedData;
}

export const highlightTextNode = (text, searchStringArr) => {
  if (searchStringArr.length === 0) return text;
  if (searchStringArr?.length === 0 && !text.includes("<mark")) {
    return text;
  } else if (text && text.includes("<mark")) {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = text;

    const markElements = [...tempElement.querySelectorAll("mark")];
    markElements.forEach((markElement) => {
      const idValue = markElement.getAttribute("id");
      text = removeMarkTagByUUID(text, idValue);
    });
  }

  for (let i = 0; i < searchStringArr?.length; i++) {
    const highPart = searchStringArr[i].text;
    const id = searchStringArr[i].uuid;
    const regex = new RegExp(`(${escapeRegExp(highPart)})`, "gi");
    const parts = text.split(regex);

    const highlightedParts = parts.map((part, index) =>
      regex.test(part) ? `<mark id=${id}>${part}</mark>` : part
    );

    let node = highlightedParts.join("");
    text = node;
  }
  return text;
};

export const addComponentOrder = (text, components) => {
  if (text && text.includes("<mark")) {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = text;

    // Get the <mark> element by its tag name
    const markElements = [...tempElement.querySelectorAll("mark")];
    markElements.forEach((markElement, index) => {
      // Extract the value of the 'id' attribute
      const idValue = markElement.getAttribute("id");
      components[idValue] = {
        ...components[idValue],
        meta: {
          ...components[idValue].meta,
          order: `${index}`,
        },
      };
    });
  }
};
