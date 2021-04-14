import 'mocha'
import { expect } from 'chai'

import {
  Container,
  Line,
  Italic,
  Link,
  List,
  Header,
  Section,
  SubSection,
} from './elements'

describe('Container', () => {
  describe('compose()', () => {
    it('Returns a composed string of the elements given to the Container object.', () => {
      const someContainer = Container(['A string'])

      expect(someContainer.compose()).to.equal('A string')
    })

    it('Returns a new string composed of all elements in the Container object.', () => {
      const someContainer = Container(['Child One', 'Child Two', 'Child Three'])

      expect(someContainer.compose()).to.equal('Child OneChild TwoChild Three')
    })
  })
})

describe('Line', () => {
  describe('compose()', () => {
    it('Returns the given content, followed by a newline.', () => {
      const someLine = Line('Content')

      expect(someLine.compose()).to.equal('Content\n')
    })
  })
})

describe('Italic', () => {
  describe('compose()', () => {
    it('Returns the given content, wrapped in asterisks.', () => {
      const someItalic = Italic('Content')

      expect(someItalic.compose()).to.equal('*Content*')
    })

    it('Can wrap in-line Elements.', () => {
      const someInline = Link('in-line')
      const someItalic = Italic(someInline)

      // use a regex to match the Link's contents and the asterisks
      // but not the other characters that depend on Link's implementation.
      expect(someItalic.compose()).to.match(/\*.*in-line.*\*/)
    })
  })
})

describe('Link', () => {
  describe('compose()', () => {
    it('Wraps a url in angle brackets.', () => {
      const someLink = Link('link')

      expect(someLink.compose()).to.equal('<link>')
    })

    it('Or creates a Link with the given display text.', () => {
      const someLink = Link('link', 'text')

      expect(someLink.compose()).to.equal('[text](link)')
    })

    it('The display text can also be an inline element.', () => {
      const someInline = Italic('italic text')
      const someLink = Link('link', someInline)

      // use regex to match italic content, but not composition
      expect(someLink.compose()).to.match(/\[.*italic text.*\]\(link\)/)
    })
  })
})

describe('List', () => {
  describe('compose()', () => {
    it('Composes a List of multiple Elements', () => {
      const someElement = Link('a link')
      const someList = List(['a list item', someElement])

      expect(someList.compose()).to.match(/- .*\n- .*\n/)
    })
  })
})

describe('Header', () => {
  describe('Raises an error if not 1>=level<=6.', () => {
    it('Must be less than or equal to 6.', () => {
      expect(() => Header(7, 'text')).to.throw(
        RangeError,
        /must be less than or equal to 6/
      )
    })

    it('Must be greater than or equal to 1.', () => {
      expect(() => Header(0, 'text')).to.throw(
        RangeError,
        /must be greater than or equal to 1/
      )
    })

    it('Must be an integer.', () => {
      expect(() => Header(1.1, 'text')).to.throw(
        RangeError,
        /must be an integer/
      )
    })
  })

  describe('compose()', () => {
    it('Contains the given text.', () => {
      const someHeader = Header(1, 'someHeader')
      const anotherHeader = Header(1, 'anotherHeader')

      expect(someHeader.compose()).to.contain('someHeader')
      expect(anotherHeader.compose()).to.contain('anotherHeader')
    })

    it('Is always preceded by an empty line.', () => {
      const someHeader = Header(1, 'someHeader')

      expect(someHeader.compose()).to.match(/^\n.*/)
    })

    it('Is always followed by an empty line.', () => {
      const someHeader = Header(1, 'someHeader')

      expect(someHeader.compose()).to.match(/.*\n\n$/)
    })

    describe('Composes the given level & content.', () => {
      it('1 composes with equal signs after text', () => {
        const someHeader = Header(1, 'text')

        expect(someHeader.compose()).to.contain('text\n===')
      })

      it('2 composes with subtraction signs after text', () => {
        const someHeader = Header(2, 'text')

        expect(someHeader.compose()).to.contain('text\n---')
      })

      it('3 composes with 3 pound characters before text', () => {
        const someHeader = Header(3, 'text')

        expect(someHeader.compose()).to.contain('### text')
      })

      it('4 composes with 4 pound characters before text', () => {
        const someHeader = Header(4, 'text')

        expect(someHeader.compose()).to.contain('#### text')
      })

      it('5 composes with 5 pound characters before text', () => {
        const someHeader = Header(5, 'text')

        expect(someHeader.compose()).to.contain('##### text')
      })

      it('6 composes with 6 pound characters before text', () => {
        const someHeader = Header(6, 'text')

        expect(someHeader.compose()).to.contain('###### text')
      })
    })
  })
})

describe('Section', () => {
  describe('compose()', () => {
    it('Contains a level 2 Header, followed by the given Elements.', () => {
      const someSection = Section('title', [
        Line('content'),
        Line('more'),
        List(['']),
      ])

      expect(someSection.compose()).to.match(
        /title\n---[\s\S]*content[\s\S]*more[\s\S]*- /
      )
    })

    it('Is preceded by exactly 3 empty lines.', () => {
      const someSection = Section('title', [Line('content')])

      expect(someSection.compose()).to.match(/^\n\n\ntitle/)
    })
  })
})

describe('Subsection', () => {
  describe('compose()', () => {
    it('Contains a level 3 Header, followed by the given Elements.', () => {
      const someSection = SubSection('title', [
        Line('content'),
        Line('more'),
        List(['']),
      ])

      expect(someSection.compose()).to.match(
        /### title[\s\S]*content[\s\S]*more[\s\S]*- /
      )
    })

    it('Is preceded by exactly 2 empty lines.', () => {
      const someSection = SubSection('title', [Line('content')])

      expect(someSection.compose()).to.match(/^\n\n### title/)
    })
  })
})
