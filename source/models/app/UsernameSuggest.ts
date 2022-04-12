//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, transaction } from 'reactronic'
import { Api, ApiData } from './Api'

export class UsernameSuggest extends ObservableObject {
  suggestions: string[]
  currentIndex: number

  constructor() {
    super()
    this.suggestions = []
    this.currentIndex = -1
  }

  get current(): string {
    return ((this.currentIndex > -1) && (this.currentIndex < this.suggestions.length)) ?
      this.suggestions[this.currentIndex] : ''
  }

  @transaction
  next(): string {
    if (this.suggestions.length > 0) {
      this.currentIndex = (this.currentIndex < (this.suggestions.length - 1)) ?
        (this.currentIndex + 1) : 0
    }
    return this.current
  }

  @transaction
  async loadSuggestions(): Promise<void> {
    try {
      const result: ApiData<string[]> = await Api.call('GET', 'profile/suggestion')
      this.suggestions = result.data
      this.currentIndex = (result.data.length > 0) ? 0 : -1
    }
    catch (e) {
      console.log(e)
    }
  }
}
