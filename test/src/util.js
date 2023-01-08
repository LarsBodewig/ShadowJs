export function callJsInShadow() {
  shadow.callWindowFunction(changeP.name);
}

export function changeP() {
  document.querySelectorAll("p").forEach((elem) => {
    elem.textContent = "shadow modified";
  });
}
