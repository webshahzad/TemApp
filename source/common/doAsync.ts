//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

export function doAsync(func: () => Promise<any>): void {
  func().then(result => { /* nop */ }, error => { /* nop */ })
}
