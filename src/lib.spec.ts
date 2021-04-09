import 'mocha'
import { expect } from 'chai'

import { something } from './lib'

describe('something', () => {
  it('Equals 1.', () => {
    expect(something).to.equal(1)
  })
})
