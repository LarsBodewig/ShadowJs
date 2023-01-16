import { changeP } from "../../util";
import { shadowJs } from "shadow-js";

function h() {
  const elem = document.createElement("p");
  elem.textContent = "rendered text to change";
  return elem;
}

let shadow;

window.addEventListener("DOMContentLoaded", async () => {
  const unchanged = document.querySelector("#render-unchanged");
  unchanged.appendChild(h());

  const elem = document.querySelector("#shadow-container");
  shadow = shadowJs(elem, h);
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
