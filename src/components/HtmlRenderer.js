import { stringify } from "postcss";
import React from "react";
import DOMPurify from "dompurify";

const HtmlRenderer = (rawContent) => {
  const sanitizedContent = DOMPurify.sanitize(rawContent);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
};

export default HtmlRenderer;
