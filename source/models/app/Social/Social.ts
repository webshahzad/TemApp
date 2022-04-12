//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { LogBox } from 'react-native'
import { ObservableObject, unobservable, reaction } from 'reactronic'
import { Api } from '../Api'
import { ChatList } from './ChatList'
import { CreateGroup } from './CreateGroup'
import { EditGroup } from './EditGroup'

// this warning is shown because of setInterval with large time period
LogBox.ignoreLogs(['Setting a timer for a long period of time'])


export class Social extends ObservableObject {
  @unobservable readonly chatList: ChatList
  @unobservable readonly createGroup: CreateGroup
  @unobservable readonly editGroup: EditGroup

  @unobservable private refreshTimer: any = undefined

  constructor() {
    super()
    this.chatList = new ChatList()
    this.createGroup = new CreateGroup()
    this.editGroup = new EditGroup()
    console.log('======this.chatList ',this.chatList);
   
  }

 

  @reaction
  protected async init(): Promise<void> {
    if (Api.isAuthenticated()) {
      await this.chatList.load()
      this.clearChatListRefreshTimer()
      this.refreshTimer = setInterval(() => void this.chatList.load(), 120 * 1000) // 2 minutes
    }
    else {
      this.clearChatListRefreshTimer()
    }
  }

  private clearChatListRefreshTimer(): void {
    if (this.refreshTimer !== undefined) {
      clearInterval(this.refreshTimer)
      this.refreshTimer = undefined
    }
  }

  getUnreadMessageCount(): number {
    let result = 0
    this.chatList?.chats.forEach(c => {
      if (c.unreadCount !== undefined) {
        result += c.unreadCount
      }
    })
    return result
  }
}
