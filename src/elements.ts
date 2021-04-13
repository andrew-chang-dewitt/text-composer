import { Node, BuildNode, Composable } from './node'

export const Container = (children: Composable[]): Node<'Container'> =>
  BuildNode<'Container'>('Container', children)

export const Line = (content: Composable): Node<'Line'> =>
  BuildNode<'Line'>('Line', [content, '\n'])

type InlineComposable = string | Node<'Italic'> | Node<'Link'>

export const Italic = (content: InlineComposable): Node<'Italic'> =>
  BuildNode<'Italic'>('Italic', ['*', content, '*'])

export const Link = (
  href: string,
  display?: InlineComposable
): Node<'Link'> => {
  const content: Composable[] = display
    ? ['[', display, '](', href, ')']
    : ['<', href, '>']

  return BuildNode<'Link'>('Link', content)
}

const ListItem = (item: InlineComposable): Node<'ListItem'> =>
  BuildNode<'ListItem'>('ListItem', ['- ', Line(item)])

export const List = (items: InlineComposable[]) =>
  BuildNode<'List'>('List', items.map(ListItem))

const assertUnreachable = (): never => {
  throw Error('This should never happen.')
}

export const Header = (
  level: number,
  text: InlineComposable
): Node<'Header'> => {
  const buildPoundHeder = (
    level: number,
    text: InlineComposable
  ): Node<'Line'> => {
    const pounds = Array.from(Array(level))
      .map(() => '#')
      .join('')

    return Line(`${pounds} ${text}`)
  }

  const buildContent = (
    level: number,
    text: InlineComposable
  ): Composable[] => {
    switch (level) {
      case 1:
        return [Line(text), Line('===')]
      case 2:
        return [Line(text), Line('---')]
      case 3:
      case 4:
      case 5:
      case 6:
        return [buildPoundHeder(level, text)]
      default:
        return assertUnreachable()
    }
  }

  return BuildNode<'Header'>('Header', [
    '\n',
    ...buildContent(level, text),
    '\n',
  ])
}

export const Section = (
  title: InlineComposable,
  content: Composable[]
): Node<'Section'> =>
  BuildNode<'Section'>('Section', ['\n\n', Header(2, title), ...content])

export const SubSection = (
  title: InlineComposable,
  content: Composable[]
): Node<'Section'> =>
  BuildNode<'Section'>('Section', ['\n', Header(3, title), ...content])
