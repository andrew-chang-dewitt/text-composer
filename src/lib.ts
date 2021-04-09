/*
 * Shared functionality
 *
 */

interface Compose {
  (): string
}

export interface Composable {
  compose: Compose
}

const isComposable = (element: any): element is Composable =>
  element.hasOwnProperty('compose')

type Element = Composable | string
type InlineElement = Link | Italic | string

const composeElement = (el: Element): string =>
  isComposable(el) ? el.compose() : el

const composeArray = (array: Element[]): string =>
  array.map(composeElement).join('')

/*
 * Elements
 *
 */

interface Container extends Composable {
  _tag: 'Container'
}

export const container = (content: Array<Element>): Container => ({
  _tag: 'Container',
  compose: () => composeArray(content),
})

interface Line extends Composable {
  _tag: 'Line'
}

export const line = (content: Element): Line => ({
  _tag: 'Line',
  compose: () => composeElement(content) + '\n',
})

interface Italic extends Composable {
  _tag: 'Italic'
}

export const italic = (content: InlineElement): Italic => ({
  _tag: 'Italic',
  compose: () => `*${composeElement(content)}*`,
})

interface Link extends Composable {
  _tag: 'Link'
}

export const link = (url: string, text?: InlineElement): Link => ({
  _tag: 'Link',
  compose: () => (text ? `[${composeElement(text)}](${url})` : `<${url}>`),
})
