//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { Gradient } from 'components/Honeycomb/HoneycombProps'

export const DefaultHexGradient: Gradient = {
  x1: 0,
  y1: 1,
  x2: 1,
  y2: 0,
  stops: [
    { offset: 0, color: '#3A7ED1' },
    { offset: 1, color: '#0096E5' },
  ],
}

export const GoodHexGradient: Gradient = {
  x1: 0,
  y1: 1,
  x2: 1,
  y2: 0,
  stops: [
    { offset: 0, color: '#498D52' },
    { offset: 1, color: '#72BA7B' },
  ],
}

// TODO: red color
export const BadHexGradient: Gradient = {
  x1: 0,
  y1: 1,
  x2: 1,
  y2: 0,
  stops: [
    { offset: 0, color: '#498D52' },
    { offset: 1, color: '#72BA7B' },
  ],
}

export const NotificationGradient: Gradient = {
  x1: 0,
  y1: 1,
  x2: 1,
  y2: 0,
  stops: [
    { offset: 0, color: '#EB9605' },
    { offset: 1, color: '#F9A602' },
  ],
}

export enum Bool {
  False = 0,
  True = 1,
}
