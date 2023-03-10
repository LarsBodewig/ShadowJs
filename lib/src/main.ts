import { Func, RenderFunc, ShadowJs } from "./types";
import { cloneHTMLElement, nextId } from "./util";

function buildFrameDoc(...content: Node[]) {
  const html = document.createElement("html");
  const body = document.createElement("body");
  body.append(...content);
  html.appendChild(body);
  return html;
}

function wrapBodyRenderFunction(renderFn: Func) {
  return new Function("document.body.appendChild(" + renderFn.name + "())");
}

export async function shadowJs<T extends HTMLElement>(
  element: T,
  renderFn?: RenderFunc
): Promise<ShadowJs<T>> {
  const elementClone = cloneHTMLElement(element, true);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  const children = Array.from(elementClone.childNodes);
  const frameDoc = buildFrameDoc(...children);
  iframe.srcdoc = frameDoc.outerHTML;
  iframe.id = nextId();
  document.body.appendChild(iframe);
  return await new Promise((resolve) => {
    iframe.contentWindow!.addEventListener("DOMContentLoaded", () => {
      const shadow = new ShadowJs(element, iframe);
      if (renderFn) {
        const wrappedFn = wrapBodyRenderFunction(renderFn);
        shadow.registerWindowFunction(renderFn);
        shadow.registerWindowFunction(wrappedFn);
        shadow.callWindowFunction(wrappedFn.name);
      }
      resolve(shadow);
    });
  });
}
