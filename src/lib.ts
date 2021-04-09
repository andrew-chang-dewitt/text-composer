interface Compose {
  (): string
}

export interface Composable {
  compose: Compose
}

export interface InlineComposable extends Composable {
  _tag: 'Inline'
}

const isComposable = (element: any): element is Composable =>
  element.hasOwnProperty('compose')

const isInline = (element: any): element is InlineComposable =>
  element._tag === 'Inline'

type Element = Composable | string
type InlineElement = InlineComposable | string

const composeElement = (el: Element): string =>
  isComposable(el) ? el.compose() : el

const composeInline = (el: InlineElement): string =>
  isInline(el) ? el.compose() : el

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

export const inline = (content: InlineElement): InlineElement => ({
  _tag: 'Inline',
  compose: () => composeInline(content),
})

export const italic = (content: InlineElement) => ({
  compose: () => `*${composeInline(content)}*`,
})
