import 'mocha'
import { expect } from 'chai'

import { text, line, inline, italic } from './lib'

describe('Text', () => {
  describe('compose()', () => {
    it('Returns a composed string of the elements given to the Text object.', () => {
      const someText = text(['A string'])

      expect(someText.compose()).to.equal('A string')
    })

    it('Returns a new string composed of all elements in the Text object.', () => {
      const someText = text(['A string', 'more string\n', 'final string'])

      expect(someText.compose()).to.equal('A stringmore string\nfinal string')
    })

    it('Can compose any Composable object, as well as strings.', () => {
      const someComposable = {
        compose: () => 'a composable',
      }
      const someString = 'a string'
      const someText = text([someComposable, someString])

      expect(someText.compose()).to.equal('a composablea string')
    })
  })
})

describe('line', () => {
  describe('compose()', () => {
    it('Returns the given content, followed by a newline.', () => {
      const someLine = line('Content')

      expect(someLine.compose()).to.equal('Content\n')
    })

    it('Can be given a Composable as content.', () => {
      const someComposable = {
        compose: () => 'a composable',
      }
      const someLine = line(someComposable)

      expect(someLine.compose()).to.equal('a composable\n')
    })
  })
})

describe('italic', () => {
  describe('compose()', () => {
    it('Returns the given content, wrapped in astricks.', () => {
      const someItalic = italic('Content')

      expect(someItalic.compose()).to.equal('*Content*')
    })

    it('Can wrap in-line Elements.', () => {
      const someInline = inline('in-line')
      const someItalic = italic(someInline)

      expect(someItalic.compose()).to.equal('*in-line*')
    })
  })
})
