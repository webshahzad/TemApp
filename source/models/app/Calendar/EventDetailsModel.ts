//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { Reentrance, reentrance, ObservableObject, transaction, reaction, unobservable } from 'reactronic'
import { EventInfo, EventType } from 'models/data/EventInfo'
import { datesEqual } from './CalendarManager'
import { getTimeDescription } from './TimeManager'
import { Api, ApiData } from '../Api'
import { AcceptanceStatus, EventMember } from './EventMember'
import { populate } from 'common/populate'
import { App } from '../App'
import { Bool } from 'common/constants'
import { UserInfo } from 'models/data/UserInfo'
import { Alert } from 'react-native'

const WeekDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export enum EventScope {
  ThisOnly = 0,
  AllFutureEvents
}

export class EventDetailsModel extends ObservableObject {
  event: EventInfo
  members: EventMember[]
  owner: UserInfo

  constructor(event: EventInfo) {
    super()
    this.event = event
    this.members = []
    this.owner = new UserInfo()
  }

  getDateDescription(): string {
    const startDate = new Date(this.event.startDate)
    const endDate = new Date(this.event.endDate)
    return datesEqual(startDate, endDate) ? startDate.toLocaleDateString() :
      `${this.getDateString(startDate)} - ${this.getDateString(endDate)}`
  }

  getTimeDescription(): string {
    const startTime = new Date(this.event.startDate)
    const endTime = new Date(this.event.endDate)
    return `${getTimeDescription(startTime)} to ${getTimeDescription(endTime)}`
  }

  getMemberDescription(): string {
    const total = this.event.totalCount
    let result: string
    if (this.event.eventType === EventType.SignupSheet) {
      const count = this.event.acceptedCount
      result = (count === 1 ? '1 participant' : `${count} participants`)
      if (total > 0) // total = members capacity
        result += ' (' + total + ' max)'
    }
    else // total = overall members count
      result = (total === 1) ? '1 tēmate' : `${total} tēmates`
    return result
  }

  getMyAcceptanceStatus(): AcceptanceStatus | undefined {
    const me = this.getMe()
    return (me !== undefined) ? me.inviteAccepted : undefined
  }

  isEventOwner(): boolean {
    return this.event.userId === App.user.stored._id
  }

  isPastEvent(): boolean {
    const endDate = new Date(this.event.endDate)
    return endDate <= new Date()
  }

  @transaction @reentrance(Reentrance.CancelAndWaitPrevious)
  async setMyAcceptanceStatus(status: AcceptanceStatus): Promise<void> {
    if (status !== AcceptanceStatus.Pending) {
      const me = this.getMe()
      if (!me || (me.inviteAccepted !== status)) {
        try {
          const response = await Api.call<ApiData<string>>('POST', 'events/join', {
            eventId: this.event._id,
            status,
          })
          this.reloadEventInfoAndMembers()
          if (response.data === 'added-to-queue') {
            Alert.alert('', 'Unfortunately, there are no open slots in this event. We added you to the waiting list, and will send a notification once a slot becomes available')
          }
        }
        catch (e) {
          console.log(e)
        }
      }
    }
  }

  private getMe(): EventMember | undefined {
    const id = App.user.stored._id
    return this.members.find(m => m.userId === id)
  }

  // Custom solution due to a strange behavior while using 'options' parameter
  // ({ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  private getDateString(date: Date): string {
    const weekDay = WeekDayNames[date.getDay()]
    return `${weekDay}, ${date.toLocaleDateString()}`
  }

  @transaction
  reloadEventInfoAndMembers(): void {
    this.loadInfoAndMembersPulse = !this.loadInfoAndMembersPulse
  }

  loadInfoAndMembersPulse: boolean = false

  @reaction
  async loadInfoAndMembers(): Promise<void> {
    if (this.event._id) {
      this.loadInfoAndMembersPulse // subscribe to reaction manually
      try {
        const responseInfo = await Api.call<ApiData<EventInfo>>('GET', `events/${this.event._id}`)
        populate(this.event, responseInfo.data)
        console.log("responseInfo>>>>>", responseInfo.data)
        this.event.members // for subscription (due to possible update)
        const responseMembers = await Api.call('POST', `events/${this.event._id}/members`, {
          page: 0, /// !!!
          limit: 500,
        })
        console.log("memberss", responseMembers)
        App.members = responseMembers.data
        const data = (responseMembers as any).data
        this.members = data.map((m: any) => {
          const member = new EventMember()
          populate(member, m)
          console.log("memberInfo",member)
          return member
        })
      }
      catch (e) {
        console.log("memeberError", e)
      }
    }
    else {
      console.log('False update on unmount')
    }
  }

  @reaction
  async loadOwnerInfo(): Promise<void> {
    if (this.event.userId) {
      const response = await Api.call<ApiData<UserInfo>>('GET', `users/info/${this.event.userId}`)
      this.owner._id = this.event.userId
      populate(this.owner, response.data)
    }
  }

  @transaction
  async deleteEvent(scope: EventScope): Promise<void> {
    try {
      const updatedFor = (scope === EventScope.AllFutureEvents) ? 0 : this.event.startDate
      await Api.call('POST', 'events/update', {
        userId: App.user.stored._id,
        is_deleted: Bool.True,
        _id: this.event._id,
        reccurEvent: this.event.reccurEvent,
        updatedFor,
        updateAllEvents: scope,
      })
    }
    catch (e) {
      console.log(e)
    }
  }
}
