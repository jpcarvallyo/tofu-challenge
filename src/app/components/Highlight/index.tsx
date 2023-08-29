import { escapeRegExp } from "lodash";

// const Highlighted = ({ text = "", highlight = "" }) => {
//   if (!highlight.trim()) {
//     return <span>{text}</span>;
//   }
//   const regex = new RegExp(`(${escapeRegExp(highlight)})`, "gi");
//   const parts = text.split(regex);
//   return (
//     <span>
//       {parts
//         .filter((part) => part)
//         .map((part, i) =>
//           regex.test(part) ? (
//             <mark key={i}>{part}</mark>
//           ) : (
//             <span key={i}>{part}</span>
//           )
//         )}
//     </span>
//   );
// };
const Highlighted = ({ text = "", highlights = [] }) => {
  if (highlights.length === 0) {
    return <span>{text}</span>;
  }

  let parts: React.ReactNode[] = [text];
  highlights.forEach((highlight) => {
    const regex = new RegExp(`(${escapeRegExp(highlight)})`, "gi");
    parts.forEach((part, index) => {
      if (typeof part === "string") {
        const subparts = part.split(regex);
        parts[index] = subparts
          .filter((subpart) => subpart)
          .map((subpart, i) =>
            regex.test(subpart) ? (
              <mark key={i}>{subpart}</mark>
            ) : (
              <span key={i}>{subpart}</span>
            )
          );
      }
    });
    parts = parts.flat();
  });

  return <span>{parts}</span>;
};

export default Highlighted;
