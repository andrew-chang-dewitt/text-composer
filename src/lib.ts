export interface Composable {
  compose: () => string | Composable
}

const isComposable = (element: any): element is Composable =>
  element.hasOwnProperty('compose')

type Element = Composable | string

interface Text {
  compose: () => string
}

export const text = (content: Array<Element>): Text => ({
  compose: () =>
    content.map((el) => (isComposable(el) ? el.compose() : el)).join(''),
})
