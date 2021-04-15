import 'mocha'
import { expect } from 'chai'

import { Node, BuildNode } from './node'

describe('BuildNode', () => {
  it('Builds a Node with the given tag & child Nodes', () => {
    const node = BuildNode<'ANode'>('ANode', ['a child', 'another child'])

    expect(node._tag).to.equal('ANode')
    expect(node.compose()).to.equal('a childanother child')
  })

  it('Can have other nodes as children.', () => {
    const child = BuildNode<'Child'>('Child', ['child'])
    const node = BuildNode<'Parent'>('Parent', [child])

    expect(node.compose()).to.equal('child')
  })

  describe('Properties: prefix & suffix', () => {
    it('Can be given a prefix string that composes before the children.', () => {
      const node = BuildNode<'Node'>('Node', ['child'], { prefix: 'prefix:' })

      expect(node.compose()).to.equal('prefix:child')
    })

    it('Can be given a suffix string that composes after the children.', () => {
      const node = BuildNode<'Node'>('Node', ['child'], { suffix: ':suffix' })

      expect(node.compose()).to.equal('child:suffix')
    })
  })

  describe('Context-aware composition', () => {
    it('Knows what type of Node was composed directly before the one currently being composed.', () => {
      const first = BuildNode<'First'>('First', ['first'])
      const second = BuildNode<'Second'>('Second', ['second'])
      const container = BuildNode<'Container'>('Container', [first, second])

      let shouldBeFirst = ''

      second.compose = (previous?: Node<any>): string => {
        shouldBeFirst = previous?._tag ? previous._tag : ''

        return ''
      }

      container.compose()

      expect(shouldBeFirst).to.equal('First')
    })

    it('Knows what type of Node is the parent Node, if the one currently being composed is the frist child Node.', () => {
      const child = BuildNode<'Child'>('Child', ['child'])
      const parent = BuildNode<'Parent'>('Parent', [child])

      let shouldBeParent = ''

      child.compose = (previous?: Node<any>): string => {
        shouldBeParent = previous?._tag ? previous._tag : ''

        return ''
      }

      parent.compose()

      expect(shouldBeParent).to.equal('Parent')
    })
  })
})
