//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

// The below copyright notice and the license permission notice
// shall be included in all copies or substantial portions.
// Copyright (C) 2016-2020 Yury Chetyrko <ychetyrko@gmail.com>
// License: https://raw.githubusercontent.com/nezaboodka/reactronic/master/LICENSE

import * as React from 'react'
import {
  ObservableObject,
  Transaction,
  unobservable,
  reaction,
  cached,
  nonreactive,
  Reactronic,
} from 'reactronic'

export function reactive(render: (cycle: number) => React.ReactElement | null): React.ReactElement {
  const [state, refresh] = React.useState<ReactState>(createReactState)
  const rx = state.rx
  rx.cycle = state.cycle
  rx.refresh = refresh // just in case React will change refresh on each rendering

  React.useEffect(() => rx.unmount, [])
  return rx.render(render)
}

// Internal

type ReactState = { rx: Rx, cycle: number }

function nop(...args: any[]): void {
  // do nothing
}

class Rx extends ObservableObject {
  @unobservable cycle: number
  @unobservable refresh: (next: ReactState) => void
  @unobservable unmount: () => void

  constructor() {
    super()
    this.cycle = 0
    this.refresh = nop
    this.unmount = () => {
      nonreactive(() => Transaction.run(() => Reactronic.dispose(this)))
    }
  }

  @cached
  render(render: (cycle: number) => React.ReactElement | null): React.ReactElement {
    return render(this.cycle) as React.ReactElement
  }

  @reaction
  protected pulse(): void {
    if (!Reactronic.getController(this.render).isUpToDate) {
      const refresh = this.refresh
      setTimeout(() => nonreactive(refresh, { rx: this, cycle: this.cycle + 1 }), 0)
    }
  }

  static create(): Rx {
    return new Rx()
  }
}

function createReactState<V>(): ReactState {
  const rx = Transaction.run<Rx>(Rx.create)
  return { rx, cycle: 0 }
}
