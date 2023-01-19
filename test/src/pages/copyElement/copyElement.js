import { changeP, hightlightJs } from "../../util";
import { shadowJs } from "shadow-js";

let shadow;

window.addEventListener("DOMContentLoaded", async () => {
  hightlightJs();
  const elem = document.querySelector("#shadow-container");
  shadow = shadowJs(elem);
  shadow.then((s) => {
    s.shadow.classList.add("visible-iframe");
    s.registerWindowFunction(changeP);
    s.onUpdateShadow(() => {
      const output = document.querySelector("#update-output");
      output.textContent = "listener called at " + new Date();
    });
  });
});

window.callJsInShadow = () => {
  shadow.then((s) => s.callWindowFunction(changeP.name));
};
