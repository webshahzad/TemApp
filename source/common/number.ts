//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

export function toFixedPadded(num: number, integerSize: number, fractionSize: number = 0): string {
  const negative = num < 0
  num = Math.abs(num)
  // integerSize = Math.max(integerSize, Math.ceil(Math.log10(num)))
  let fractionResult
  if (fractionSize > 0) {
    const radix = 10 ** fractionSize
    fractionResult = (Math.trunc(num * radix) / radix).toFixed(fractionSize)
    fractionResult = fractionResult.substring(fractionResult.lastIndexOf('.'))
    num = Math.trunc(num)
  } else {
    fractionResult = ''
    num = Math.round(num)
  }
  const integerResult = num.toString().padStart(integerSize, '0')
  const result = `${negative ? '-' : ''}${integerResult}${fractionResult}`
  return result
}
