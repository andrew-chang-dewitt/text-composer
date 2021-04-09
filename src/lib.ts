interface Compose {
  (): string
}

export interface Composable {
  compose: Compose
}

const isComposable = (element: any): element is Composable =>
  element.hasOwnProperty('compose')

type Element = Composable | string

const composeElement = (el: Element): string =>
  isComposable(el) ? el.compose() : el

const arrayComposer = (content: Array<Element>): { compose: Compose } => ({
  compose: () => content.map(composeElement).join(''),
})

interface Text {
  compose: Compose
}

export const text = (content: Array<Element>): Text =>
  Object.assign({}, arrayComposer(content))

export const line = (content: Element) => ({
  compose: () => composeElement(content) + '\n',
})
