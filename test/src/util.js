import hljs from "highlight.js/lib/common";

export function changeP() {
  document.querySelectorAll("p").forEach((elem) => {
    elem.textContent = "shadow modified";
  });
}

export function hightlightJs() {
  require("highlight.js/styles/github.css");
  hljs.highlightAll();
}
