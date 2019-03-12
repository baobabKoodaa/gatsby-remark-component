'use strict';

var htmlTagSet = new Set(["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "slot", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "var", "video", "wbr"]);

var visit = require("unist-util-visit");

module.exports = function (_ref, _ref2) {
  var markdownAST = _ref.markdownAST;
  var components = new Set(_ref2.components || []); // Predefined components or empty set

  var verbose = _ref2.verbose;
  if (verbose) console.log("Calling gatsby-remark-component-parent2div"); // processTag decides if given input tag should be processed or not

  function processTag(tag) {
    if (components.size > 0) {
      // If components are explicitly defined, only process those tags.
      return components.has(tag);
    } // If components are not explicitly defined, process all non HTML tags.


    return !htmlTagSet.has(tag);
  }

  visit(markdownAST, "html", function (node, index, parent) {
    // node.value may be something like <my-component val=83 > or </my-component>
    var tag = node.value.split(" ")[0].replace(/<|>|\//g, '');

    if (processTag(tag)) {
      parent.type = "div";
      if (verbose) console.log("\nFound a custom tag " + tag);
    }
  });
};
