interface Text {
  compose: () => string
}

export const text = (content: Array<string>): Text => ({
  compose: () => content.join(''),
})
