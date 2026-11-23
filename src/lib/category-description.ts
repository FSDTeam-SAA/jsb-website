import { parseFragment, type DefaultTreeAdapterTypes } from "parse5";

type ChildNode = DefaultTreeAdapterTypes.ChildNode;

const blockTags = new Set([
  "article", "blockquote", "br", "div", "h1", "h2", "h3", "h4", "h5", "h6",
  "hr", "li", "ol", "p", "section", "ul",
]);
const hiddenTags = new Set(["script", "style", "template", "noscript"]);

export function parseCategoryDescription(description: string | null) {
  return description?.trim() ? parseFragment(description).childNodes : [];
}

export function isDescriptionElement(node: ChildNode): node is DefaultTreeAdapterTypes.Element {
  return "tagName" in node &&
    node.namespaceURI === "http://www.w3.org/1999/xhtml" &&
    !hiddenTags.has(node.tagName);
}

function descriptionText(node: ChildNode): string {
  if ("value" in node) return node.value;
  if (!isDescriptionElement(node)) return "";

  const text = node.childNodes.map(descriptionText).join("");
  return blockTags.has(node.tagName) ? ` ${text} ` : text;
}

export function getCategoryDescriptionText(nodes: ChildNode[]) {
  return nodes.map(descriptionText).join("").replace(/\s+/g, " ").trim();
}
