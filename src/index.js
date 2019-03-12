const visit = require("unist-util-visit")
import { htmlTagSet } from "./html-tags.js"

module.exports = function (_ref, _ref2) {
  var markdownAST = _ref.markdownAST;
  var components = new Set(_ref2.components || []); // Predefined components or empty set
  var verbose = _ref2.verbose;
  
  if (verbose) console.log("Calling gatsby-remark-component-parent2div");

  // processTag decides if given input tag should be processed or not
  function processTag(tag) {
    if (components.size > 0) {
      // If components are explicitly defined, only process those tags.
      return components.has(tag)
    }
    // If components are not explicitly defined, process all non HTML tags.
    return !htmlTagSet.has(tag)
  }

  visit(markdownAST, "html", function (node, index, parent) {
    // node.value may be something like <my-component val=83 > or </my-component>
    const tag = node.value.split(" ")[0].replace(/<|>|\//g, '')
    if (processTag(tag)) {
      parent.type = "div";
      if (verbose) console.log("\nFound a custom tag " + tag);
    }
  });

}
