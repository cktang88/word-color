/*
  * mimic jQuery DOM functionality with jQuery syntax
  * creates elements, and selects elements using $
  *
  */

const $ = str => {
  const len = str.length;
  switch (str[0]) {
    case "<": // create dom element
      if (str[len - 1] === ">") {
        return document.createElement(str.slice(1, len - 1));
      }
      break;
    default:
      // select dom element
      const nodes = document.querySelectorAll(str);
      return nodes.length > 1 ? nodes : nodes[0]; // returns 1 elem, or list of elements
  }
};
export default $
