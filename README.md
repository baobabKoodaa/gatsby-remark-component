# gatsby-remark-component-parent2div

This is a plugin for [gatsby-transformer-remark](https://www.gatsbyjs.org/packages/gatsby-transformer-remark/).
You may need this plugin if you are seeing a `validateDOMNesting` warning in console.
This warning may come up if you are
[embedding custom React Components inside your Markdown files](https://using-remark.gatsbyjs.org/custom-components/).
If your Component has any div elements, then you end up nesting `<div>` inside `<p>`, which is against HTML specification.
Modern browsers will take a guess at what you want and render something (usually reasonable), but it's not guaranteed,
so you should fix the warning. You can fix this in 2 ways: either you change your component so that it doesn't have
a `<div>` or you can use this plugin to change the AST node parent of your custom component from `<p>` to `<div>`.

## Install

You can install with `npm` or `yarn`.

```bash
yarn add gatsby-transformer-remark gatsby-remark-component-parent2div
npm i gatsby-remark-component-parent2div
```

## Release Notes

> v 1.2

* Fixed bug where Component is not detected when passing props (and auto-detection is off).
* Fixed tests.
* Improved time complexity from O(nch) to O(n), where n=nodesInMarkdown, c=componentsSpecifiedInOptions, h=htmlTagsSpecifiedInCode
* Added a `verbose` option for console logs.

> v 1.1

* New configuration options!
* Can now auto-detect your custom components.

## How to use

Minimal configuration, auto-detect custom components:

```js
//In your gatsby-config.js ...
plugins: [
  {
    resolve: "gatsby-transformer-remark",
    options: {
      plugins: ["gatsby-remark-component-parent2div"]
    }
  }
]
```

Disable auto-detection (if you want only some custom components' parents changed, but not others).

```js
plugins: [
  {
    resolve: "gatsby-transformer-remark",
    options: {
      plugins: [
        {
          resolve: "gatsby-remark-component-parent2div",
          options: {
            components: ["my-component", "other-component"],
            verbose: true
          }
        }
      ]
    }
  }
]
```

When you start gatsby, your queries will be built from your components, and gatsby-remark-components will update the AST tree.

This will convert this graphql result:

```json
//...
{
  "type": "element",
  "tagName": "p",
  "properties": {},
  "children": [
    {
      "type": "element",
      "tagName": "my-component",
      "properties": {},
      "children": []
    }
  ]
}
```

To this:

```json
//...
//Notice the tag name
{
  "type": "element",
  "tagName": "div",
  "properties": {},
  "children": [
    {
      "type": "element",
      "tagName": "my-component",
      "properties": {},
      "children": []
    }
  ]
}
```

Now in your markdown template you can do:

```jsx
import rehypeReact from "rehype-react"
import { MyComponent } from "../pages/my-component"

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components: { "my-component": MyComponent }
}).Compiler
```

Replace :

```jsx
<div dangerouslySetInnerHTML={{ __html: post.html }} />
```

by:

```jsx
<div>{renderAst(post.htmlAst)}</div>
```

And in your page query ... :

```jsx
//...
markdownRemark(fields: { slug: { eq: $slug } }) {
 htmlAst // previously `html`

 //other fields...
}
//...
```

Now in your markdown you can do:

```md
# Some Title

Some text

<my-component></my-component>
```

This will render your component without any validateDOMNesting warning.

## Attribution

Hi, I'm Baobab. This project was created by [Hebilicious](https://github.com/Hebilicious/). It was not maintained anymore, so I decided to fork it. You are now looking at the fork. The original is [here](https://github.com/Hebilicious/gatsby-remark-component).

Authors:
- [Hebilicious](https://github.com/Hebilicious/)
- [Baobab Koodaa](https://github.com/baobabKoodaa/)
- [Designbyadrian](https://github.com/designbyadrian)
- [rstacruz](https://github.com/rstacruz)
