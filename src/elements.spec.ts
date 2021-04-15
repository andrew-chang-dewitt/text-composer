import 'mocha'
import { expect } from 'chai'

import {
  Container,
  Line,
  Italic,
  Link,
  List,
  Header,
  TitleSection,
  Section,
  SubSection,
  Paragraph,
} from './elements'

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

    it('Is preceded & followed by an empty line.', () => {
      const someList = List(['a list item'])

      expect(someList.compose()).to.match(/\n.*a list item\n\n/)
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

describe('TitleSection', () => {
  describe('compose()', () => {
    it('Contains a level 2 Header, followed by the given Elements.', () => {
      const someSection = TitleSection('title', [
        Line('content'),
        Line('more'),
        List(['']),
      ])

      expect(someSection.compose()).to.match(
        /title\n===[\s\S]*content[\s\S]*more[\s\S]*- /
      )
    })

    describe('Spacing', () => {
      it('Is preceded by exactly 0 empty lines.', () => {
        const someSection = TitleSection('title', [Line('content')])

        expect(someSection.compose()).to.match(/^title/)
      })

      it('Removes the suffix of the last content item in the section', () => {
        const list = List(['one', 'two'])
        const section = TitleSection('title', [list])

        expect(section.compose()).to.match(/two\n$/)
      })
    })
  })
})

describe('Section', () => {
  describe('compose()', () => {
    it('Contains a level 2 Header, followed by the given Elements.', () => {
      const someSection = Section('title', [
        'string',
        Line('content'),
        Line('more'),
        List(['']),
        'string',
      ])

      expect(someSection.compose()).to.match(
        /title\n---[\s\S]*stringcontent[\s\S]*more[\s\S]*- [\s\S]*string/
      )
    })

    describe('Spacing', () => {
      it('Is preceded by exactly 3 empty lines.', () => {
        const someSection = Section('title', [Line('content')])

        expect(someSection.compose()).to.match(/^\n\n\ntitle/)
      })

      it('Even when the predecessor is a List.', () => {
        const list = List(['item'])
        const section = Section('title', [])
        const parent = Container([list, section])

        expect(parent.compose()).to.match(/item\n\n\n\ntitle/)
      })

      it('Even when the predecessor is a Paragraph.', () => {
        const paragraph = Paragraph(['paragraph'])
        const section = Section('title', [])
        const parent = Container([paragraph, section])

        expect(parent.compose()).to.match(/paragraph\n\n\n\ntitle/)
      })

      it('Even when the predecessor is a Header.', () => {
        const header = Header(3, 'header')
        const section = Section('title', [])
        const parent = Container([header, section])

        expect(parent.compose()).to.match(/header\n\n\n\ntitle/)
      })

      it('Removes the suffix of the last content item in the section', () => {
        const list = List(['one', 'two'])
        const section = Section('title', [list])

        expect(section.compose()).to.match(/two\n$/)
      })
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

    describe('Spacing', () => {
      it('Is preceded by exactly 2 empty lines.', () => {
        const someSection = SubSection('title', [Line('content')])

        expect(someSection.compose()).to.match(/^\n\n### title/)
      })

      it('Even when the predecessor is a List.', () => {
        const list = List(['item'])
        const section = SubSection('title', [])
        const parent = Container([list, section])

        expect(parent.compose()).to.match(/item\n\n\n### title/)
      })

      it('Even when the predecessor is a Paragraph.', () => {
        const paragraph = Paragraph(['paragraph'])
        const section = SubSection('title', [])
        const parent = Container([paragraph, section])

        expect(parent.compose()).to.match(/paragraph\n\n\n### title/)
      })

      it('Even when the predecessor is a Header.', () => {
        const header = Header(3, 'header')
        const section = SubSection('title', [])
        const parent = Container([header, section])

        expect(parent.compose()).to.match(/header\n\n\n### title/)
      })

      it('Even when the parent is a Section.', () => {
        const section = SubSection('subSection', [])
        const parent = Section('section', [section])

        expect(parent.compose()).to.match(/section\n---\n\n\n### subSection/)
      })

      it('Removes the suffix of the last content item in the section', () => {
        const list = List(['one', 'two'])
        const section = Section('title', [list])

        expect(section.compose()).to.match(/two\n$/)
      })
    })
  })
})

describe('Paragraph', () => {
  describe('compose()', () => {
    it('Contains the given text, preceded by and followed by an empty line.', () => {
      const someParagraph = Paragraph(['A paragraph.'])

      expect(someParagraph.compose()).to.equal('\nA paragraph.\n\n')
    })

    it('Can be given multiple inline elements to put in paragraph.', () => {
      const someParagraph = Paragraph([
        'Normal text ',
        Italic('followed by italics, '),
        Link('some/link', 'including a link'),
        '.',
      ])

      expect(someParagraph.compose()).to.match(
        /Normal text.*followed by italics.*including a link/
      )
    })
  })
})
