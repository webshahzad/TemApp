//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject } from 'reactronic'
import { populate } from './populate'

export abstract class Refreshable extends ObservableObject {
  private $refreshed_at$: number = 0

  async load(): Promise<void> {
    // if (Date.now() - this.$refreshed_at$ > 2 * 60 * 1000) // 2 minutes
    await this.refresh()
  }

  protected apply(updates: any): void {
    populate(this, updates)
    this.$refreshed_at$ = Date.now()
  }

  protected abstract refresh(): Promise<void>
}
