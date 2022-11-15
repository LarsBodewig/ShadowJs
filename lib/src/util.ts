const idPrefix = "shadow-js-";
let idCounter = 0;

export const nextId = () => idPrefix + idCounter++;

export function cloneHTMLElement<T extends HTMLElement>(
  element: T,
  deep = false
): T {
  return element.cloneNode(deep) as T;
}

export function zipArraysTuple<L, R>(left: L[], right: R[]): [L, R][] {
  if (left.length !== right.length) {
    throw new Error(
      "Unrelated array sizes: left (" +
        left.length +
        "), right (" +
        right.length +
        ")"
    );
  }
  return left.map((l, index) => [l, right[index]]);
}

export function getAllHTMLElements(
  element: HTMLElement,
  addSelf = false
): HTMLElement[] {
  const elements = Array.from(element.querySelectorAll("*"));
  if (addSelf) {
    elements.unshift(element);
  }
  return elements as HTMLElement[];
}
