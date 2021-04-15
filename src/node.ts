export type StringLiteral<T> = T extends string
  ? string extends T
    ? never
    : T
  : never

interface Compose {
  (previous?: Node<any>): string
}

export interface Node<T> {
  _tag: StringLiteral<T>
  children: Composable[]
  compose: Compose
  prefix: string
  suffix: string
}

export type Composable = Node<any> | string

const composeNode = (current: Composable, previousNode?: Node<any>): string =>
  typeof current === 'string' ? current : current.compose(previousNode)

export const composeArray = (
  array: Composable[],
  parentNode?: Node<any>
): string =>
  array
    .map((current, index, array) => {
      // short-circuit finding previous Node if the current node is the first
      // one (which is at index 1 since index 0 will be the parent node's prefix);
      // instead, send the parent (if given)
      if (index === 1) return composeNode(current, parentNode)

      // pass previous Composable to composeNode if and only if it both:
      // 1) exists
      // 2) is a Node, not a string
      // otherwise, pass undefined
      const prevIndex = index - 1
      const previousComposable = prevIndex >= 0 ? array[prevIndex] : undefined
      const previousNode =
        typeof previousComposable === 'string' ? undefined : previousComposable

      return composeNode(current, previousNode)
    })
    .join('')

interface NodeOptions {
  prefix?: string
  suffix?: string
}

export const BuildNode = <Tag>(
  tag: StringLiteral<Tag>,
  children: Composable[],
  options?: NodeOptions
): Node<Tag> => ({
  // used to identify a Node's sub-type
  _tag: tag,
  children: children,
  // by using function declaration instead of arrow function, we get access
  // to instance values via `this`
  compose: function () {
    // which means we can access an instance's prefix & suffix properties
    // at composition time, allowing a user to change the prefix or suffix, if needed
    return composeArray([this.prefix, ...this.children, this.suffix], this)
  },
  // if prefix or suffix is given, use it; otherwise, use empty string
  prefix: options?.prefix ? options.prefix : '',
  suffix: options?.suffix ? options.suffix : '',
})
