interface Compose {
  (): string
}

export interface Composable {
  compose: Compose
}

const isComposable = (element: any): element is Composable =>
  element.hasOwnProperty('compose')

type Element = Composable | string

const arrayComposer = (content: Array<Element>): { compose: Compose } => ({
  compose: () =>
    content.map((el) => (isComposable(el) ? el.compose() : el)).join(''),
})

interface Text {
  compose: Compose
}

export const text = (content: Array<Element>): Text =>
  Object.assign({}, arrayComposer(content))
