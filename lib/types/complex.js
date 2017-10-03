import { atom } from 'yarpex'
import { encode as encodeTuple } from './tuple'
import { typesByTag } from './index'

export function encode(encoder) {
  return ({ type, value }) => {
    const tuple = [atom('bert')].append(type.encode({ type, value }))

    return encodeTuple({
      type,
      value: tuple,
    })
  }
}

export function decode(complex) {
  if (complex[0].type.name !== 'atom' && complex[0].value !== 'bert') {
    throw new Error('value cannot be decoded')
  }

  const tag = complex[1].value
  const type = typesByTag[tag]

  if (type == null) {
    throw new Error('unsupported type ' + tag)
  }

  return type.decodeComplex({ type, tag, value: complex.slice(2) })
}