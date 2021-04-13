type StringLiteral<T> = T extends string
  ? string extends T
    ? never
    : T
  : never

interface Compose {
  (): string
}

export interface Node<T> {
  _tag: StringLiteral<T>
  compose: Compose
}

export type Composable = Node<any> | string

const composeNode = (node: Composable): string =>
  typeof node === 'string' ? node : node.compose()

const composeArray = (array: Composable[]): string =>
  array.map(composeNode).join('')

export const BuildNode = <Tag>(
  tag: StringLiteral<Tag>,
  children: Composable[]
): Node<Tag> => ({
  _tag: tag,
  compose: () => composeArray(children),
})
