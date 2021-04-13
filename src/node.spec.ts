import 'mocha'
import { expect } from 'chai'

import { BuildNode } from './node'

describe('BuildNode', () => {
  it('Builds a Node with the given tag & child Nodes', () => {
    const node = BuildNode<'ANode'>('ANode', ['a child', 'another child'])

    expect(node._tag).to.equal('ANode')
    expect(node.compose()).to.equal('a childanother child')
  })

  it('A node can have other nodes as children.', () => {
    const child = BuildNode<'Child'>('Child', ['child'])
    const node = BuildNode<'Parent'>('Parent', [child])

    expect(node.compose()).to.equal('child')
  })
})
