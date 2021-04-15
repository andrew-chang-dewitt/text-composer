import {
  composeNode,
  getPreviousNode,
  BuildNode,
  Node,
  Composable,
  StringLiteral,
} from './node'

export const Container = (content: Composable[]): Node<'Container'> =>
  BuildNode<'Container'>('Container', content)

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

export const Line = (content: Composable): Node<'Line'> =>
  BuildNode<'Line'>('Line', [content], { suffix: '\n' })

export const Paragraph = (content: InlineComposable[]): Node<'Paragraph'> =>
  BuildNode<'Paragraph'>('Paragraph', content, {
    prefix: '\n',
    suffix: '\n\n',
  })

const ListItem = (
  item: InlineComposable,
  index: number,
  array: InlineComposable[]
): Node<'ListItem'> =>
  BuildNode<'ListItem'>('ListItem', [item], {
    prefix: '- ',
    suffix: index === array.length - 1 ? '' : '\n',
  })

export const List = (items: InlineComposable[]) =>
  BuildNode<'List'>('List', items.map(ListItem), {
    prefix: '\n',
    suffix: '\n\n',
  })

/* istanbul ignore next */
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

  if (level > 6) throw RangeError('Level must be less than or equal to 6.')
  if (level < 1) throw RangeError('Level must be greater than or equal to 1.')
  if (!Number.isInteger(level)) throw RangeError('Level must be an integer.')

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
      /* istanbul ignore next */
      default:
        return assertUnreachable()
    }
  }

  return BuildNode<'Header'>('Header', [...buildContent(level, text)], {
    prefix: '\n',
    suffix: '\n',
  })
}

const emptyLines = (count: number): string =>
  count > 0
    ? Array.from(Array(count))
        .map(() => '\n')
        .join('')
    : ''

const BuildSection = <T>(
  title: InlineComposable,
  content: Composable[],
  headerSize: number,
  precedingEmptyLineCount: number,
  sectionType: StringLiteral<T>
): Node<T> => {
  const node = BuildNode<T>(
    sectionType,
    [Header(headerSize, title), ...content],
    {
      prefix: emptyLines(precedingEmptyLineCount),
      suffix: '\n\n',
    }
  )

  node.compose = function (previous?: Node<any>) {
    if (previous) {
      switch (previous._tag) {
        case 'List':
        case 'Paragraph':
        case 'Header':
        case 'Section':
        case 'TitleSection':
        case 'SubSection': {
          this.prefix = emptyLines(precedingEmptyLineCount - 1)
          break
        }
      }
    }

    const firstNode = this.children[0]
    // coverage ignores else branch of next line
    // because the first node will always be a Header, which is a
    // Composable object
    /* istanbul ignore else */
    if (typeof firstNode !== 'string') firstNode.prefix = ''

    const secondNode = this.children[1]
    if (secondNode && typeof secondNode !== 'string') secondNode.prefix = ''

    const lastNode = this.children[this.children.length - 1]
    if (typeof lastNode !== 'string') lastNode.suffix = ''

    return [this.prefix, ...this.children, this.suffix]
      .map((current, index, array) => {
        const previousNode = getPreviousNode(index, array, this)

        return composeNode(current, previousNode)
      })
      .join('')
  }

  return node
}

export const TitleSection = (
  title: InlineComposable,
  content: Composable[]
): Node<'TitleSection'> =>
  BuildSection<'TitleSection'>(title, content, 1, 0, 'TitleSection')

export const Section = (
  title: InlineComposable,
  content: Composable[]
): Node<'Section'> => BuildSection<'Section'>(title, content, 2, 3, 'Section')

export const SubSection = (
  title: InlineComposable,
  content: Composable[]
): Node<'SubSection'> =>
  BuildSection<'SubSection'>(title, content, 3, 2, 'SubSection')
