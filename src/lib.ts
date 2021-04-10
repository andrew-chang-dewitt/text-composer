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

interface LineOptions {
  prefix?: string
}

export const line = (content: Element, options?: LineOptions): Line => ({
  _tag: 'Line',
  compose: () => {
    const prefix = options?.prefix ? options.prefix : ''

    return `${prefix}${composeElement(content)}\n`
  },
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

export const list = (items: Element[]) => ({
  _tag: 'List',
  compose: () =>
    composeArray(items.map((item) => line(item, { prefix: '- ' }))),
})
