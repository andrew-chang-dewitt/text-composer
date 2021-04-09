import 'mocha'
import { expect } from 'chai'

import { text } from './lib'

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
