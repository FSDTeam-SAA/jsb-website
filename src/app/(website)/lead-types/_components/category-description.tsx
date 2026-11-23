import { createElement, Fragment, type ReactNode } from "react";
import { type DefaultTreeAdapterTypes } from "parse5";
import { isDescriptionElement } from "@/lib/category-description";
import { marketingStyles as styles } from "../../_components/marketing-styles";

const formattingTags = new Set([
  "a", "b", "blockquote", "br", "div", "em", "h2", "h3", "h4", "h5", "h6",
  "hr", "i", "li", "ol", "p", "s", "section", "span", "strong", "u", "ul",
]);
const linkProtocols = new Set(["http:", "https:", "mailto:", "tel:"]);

function renderNode(node: DefaultTreeAdapterTypes.ChildNode, key: number): ReactNode {
  if ("value" in node) return node.value;
  if (!isDescriptionElement(node)) return null;

  const tag = node.tagName === "h1" ? "h2" : node.tagName;
  const children = node.childNodes.map(renderNode);

  if (!formattingTags.has(tag)) return <Fragment key={key}>{children}</Fragment>;
  if (tag === "br" || tag === "hr") return createElement(tag, { key });

  if (tag === "a") {
    const href = node.attrs.find((attribute) => attribute.name === "href")?.value;
    const url = href ? URL.canParse(href, "https://example.com") &&
      new URL(href, "https://example.com") : null;
    if (!url || !linkProtocols.has(url.protocol)) {
      return <Fragment key={key}>{children}</Fragment>;
    }
    return <a key={key} href={href}>{children}</a>;
  }

  return createElement(tag, { key }, children);
}

export default function CategoryDescription({
  nodes,
}: {
  nodes: DefaultTreeAdapterTypes.ChildNode[];
}) {
  return (
    <div className={`whitespace-pre-line break-words [&_a]:font-bold [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-2xl [&_h3]:text-xl [&_:is(h2,h3,h4,h5,h6)]:font-bold [&_:is(h2,h3,h4,h5,h6)]:text-[#104170] [&_ol]:list-decimal [&_p]:mb-3 [&_ul]:list-disc [&_:is(ol,ul)]:mb-3 [&_:is(ol,ul)]:pl-5 [&>:first-child]:mt-0 ${styles.body}`}>
      {nodes.map(renderNode)}
    </div>
  );
}
