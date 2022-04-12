//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, unobservable, transaction } from 'reactronic'

export interface TimerOptions {
  intervalMs?: number
  countUpToZero?: number
}

export class Timer extends ObservableObject {
  seconds: number = 0 // negative when countUpToZero is performed

  @unobservable private interval: number
  @unobservable private countUpToZero: number
  @unobservable private onZeroReached?: () => void
  @unobservable private timerHandle: any

  get isActive(): boolean {
    return (this.timerHandle !== undefined)
  }

  constructor() {
    super()
    this.interval = DefaultTimerIntervalMs
    this.countUpToZero = 0
    this.onZeroReached = undefined
    this.timerHandle = undefined
  }

  @transaction
  reset(options?: TimerOptions): this {
    this.pause()
    if (options) {
      this.countUpToZero = options.countUpToZero ?? this.countUpToZero
      this.interval = options.intervalMs ?? this.interval
    }
    this.seconds = (this.countUpToZero > 0) ? (-this.countUpToZero) : 0
    return this
  }

  start(): this {
    return this.reset().resume()
  }

  resume(): this {
    if (!this.isActive) {
      this.timerHandle = setInterval(() => {
        this.tick()
      }, this.interval)
    }
    return this
  }

  /**
   * Wait when `seconds` become 0. Resolves immediately if `seconds` are already >= 0
   */
  waitForZero(): Promise<void> {
    if (!this.isActive)
      this.resume()
    if (this.seconds < 0) {
      return new Promise(resolve => {
        this.onZeroReached = () => {
          this.onZeroReached = undefined
          resolve()
        }
      })
    }
    else {
      return Promise.resolve()
    }
  }

  pause(): void {
    if (this.isActive) {
      clearInterval(this.timerHandle)
      this.timerHandle = undefined
    }
  }

  @transaction
  private tick(): void {
    this.seconds += 1
    if (this.countUpToZero !== undefined && this.seconds === 0) {
      this.onZeroReached && this.onZeroReached()
    }
  }
}

const DefaultTimerIntervalMs = 1000
