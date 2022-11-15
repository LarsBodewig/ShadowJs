import { changeP } from "./test";
import { shadowJs } from "shadow-js";

let shadow;

window.addEventListener("DOMContentLoaded", async () => {
  const elem = document.querySelector("#shadow-container");
  shadow = shadowJs(elem);
  shadow.then((s) => {
    s.shadow.style.border = "1px solid red";
    s.shadow.style.display = "block";
    s.registerWindowFunction(changeP);
  });
});

window.callJsInShadow = () => {
  shadow.then((s) => s.callWindowFunction(changeP.name));
};
