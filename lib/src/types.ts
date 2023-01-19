import { eventKeys } from "./events";
import { cloneHTMLElement, getAllHTMLElements, zipArraysTuple } from "./util";

interface WindowWithEval extends Window {
  eval?: (js: string) => void;
}

export type Func = Function | (() => void);
export type RenderFunc = <T extends Node>() => T;

export type ShadowUpdateEventListener = (iframe: HTMLIFrameElement) => void;

export class ShadowJs<T extends HTMLElement> {
  public element: T;
  public shadow: HTMLIFrameElement;

  private updateShadowListeners: ShadowUpdateEventListener[];

  constructor(element: T, shadow: HTMLIFrameElement) {
    this.element = element;
    this.shadow = shadow;
    this.updateShadowListeners = [];
  }

  public updateElementFromShadow(listeners = true) {
    const body = this.shadow.contentDocument!.body;
    const bodyClone = cloneHTMLElement(body, true);
    this.element.replaceChildren(...bodyClone.childNodes);
    this.setProxyListeners();
    if (listeners) this.callUpdateShadowListeners();
  }

  public onUpdateShadow(listener: ShadowUpdateEventListener) {
    this.updateShadowListeners.push(listener);
  }

  public registerWindowFunction(fn: Func) {
    const js = fn.toString();
    (this.shadow.contentWindow as WindowWithEval).eval?.(js);
    this.updateElementFromShadow();
  }

  public getWindowProperty<V>(property: string): V | undefined {
    const shadowWindow = this.shadow.contentWindow as WindowWithEval;
    return shadowWindow[property as any] as V | undefined;
  }

  public callWindowFunction(name: string, ...args: any[]) {
    const shadowWindow = this.shadow.contentWindow as WindowWithEval;
    const func = shadowWindow[name as any] as unknown as Function;
    func.apply(shadowWindow, args);
    this.updateElementFromShadow();
  }

  private setProxyListeners() {
    const body = this.shadow.contentDocument!.body;
    const outerElements = getAllHTMLElements(this.element);
    const shadowElements = getAllHTMLElements(body);
    const tuple = zipArraysTuple(outerElements, shadowElements);
    for (const [elementElement, shadowElement] of tuple) {
      for (const key of eventKeys) {
        elementElement.addEventListener(key, (ev) =>
          shadowElement.dispatchEvent(ev)
        );
      }
    }
  }

  private callUpdateShadowListeners() {
    this.updateShadowListeners.forEach((listener) => listener(this.shadow));
  }
}
