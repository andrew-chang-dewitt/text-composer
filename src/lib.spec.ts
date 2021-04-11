import 'mocha'
import { expect } from 'chai'

import { container, line, italic, link, list } from './lib'

describe('Container', () => {
  describe('compose()', () => {
    it('Returns a composed string of the elements given to the Container object.', () => {
      const someContainer = container(['A string'])

      expect(someContainer.compose()).to.equal('A string')
    })

    it('Returns a new string composed of all elements in the Container object.', () => {
      const someContainer = container([
        'A string',
        'more string\n',
        'final string',
      ])

      expect(someContainer.compose()).to.equal(
        'A stringmore string\nfinal string'
      )
    })

    it('Can compose any Composable object, as well as strings.', () => {
      const someComposable = {
        compose: () => 'a composable',
      }
      const someString = 'a string'
      const someContainer = container([someComposable, someString])

      expect(someContainer.compose()).to.equal('a composablea string')
    })
  })
})

describe('Line', () => {
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

describe('Italic', () => {
  describe('compose()', () => {
    it('Returns the given content, wrapped in asterisks.', () => {
      const someItalic = italic('Content')

      expect(someItalic.compose()).to.equal('*Content*')
    })

    it('Can wrap in-line Elements.', () => {
      const someInline = link('in-line')
      const someItalic = italic(someInline)

      // use a regex to match the link's contents and the asterisks
      // but not the other characters that depend on link's implementation.
      expect(someItalic.compose()).to.match(/\*.*in-line.*\*/)
    })
  })
})

describe('Link', () => {
  describe('compose()', () => {
    it('Wraps a url in angle brackets.', () => {
      const someLink = link('link')

      expect(someLink.compose()).to.equal('<link>')
    })

    it('Or creates a link with the given display text.', () => {
      const someLink = link('link', 'text')

      expect(someLink.compose()).to.equal('[text](link)')
    })

    it('The display text can also be an inline element.', () => {
      const someInline = italic('italic text')
      const someLink = link('link', someInline)

      // use regex to match italic content, but not composition
      expect(someLink.compose()).to.match(/\[.*italic text.*\]\(link\)/)
    })
  })
})

describe('List', () => {
  describe('compose()', () => {
    it('Composes a list of multiple Elements', () => {
      const someElement = link('a link')
      const someList = list(['a list item', someElement])

      expect(someList.compose()).to.match(/- .*\n- .*\n/)
    })
  })
})
