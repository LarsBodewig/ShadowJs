import { eventKeys } from "./events";
import { cloneHTMLElement, zipArraysTuple, getAllHTMLElements } from "./util";

interface WindowWithEval extends Window {
  eval?: (js: string) => void;
}

export type Func = () => void;

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
    const value = (this.shadow.contentWindow as WindowWithEval)[
      property as any
    ];
    if (value === undefined) return undefined;
    else return value as V;
  }

  public callWindowFunction(name: string) {
    const func = (this.shadow.contentWindow as WindowWithEval)[
      name as any
    ] as any;
    func();
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
