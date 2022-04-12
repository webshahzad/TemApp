//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { EventInfo, EventType } from 'models/data/EventInfo'
import { App } from '../App'
import { datesEqual } from './CalendarManager'
import { EventList } from './EventList'
import { AcceptanceStatus } from './EventMember'

export enum DateKind {
  Now,
  Later,
  Earlier
}

export class DayInfo {
  date: Date
  kind: DateKind
  otherMonth: boolean
  schedule: EventList

  constructor(date: Date, kind: DateKind, otherMonth: boolean) {
    this.date = date
    this.kind = kind
    this.otherMonth = otherMonth
    this.schedule = new EventList()
  }

  getAcceptanceStatus(event: EventInfo): AcceptanceStatus {
    const id = App.user.stored._id
    let result: AcceptanceStatus
    if (event.challengeCreatedBy === id) {
      result = AcceptanceStatus.Accepted
    } else if (event.eventType === EventType.SignupSheet && event.userId === id) {
      result = AcceptanceStatus.Accepted
    } else if (event.members.length) {
      const me = event.members.find(x => (x.id ?? x.userId) === id)
      result = me?.inviteAccepted ?? AcceptanceStatus.Pending
    } else {
      result = AcceptanceStatus.Pending
    }
    return result
  }

  getEventTime(event: EventInfo): string {
    const eventStart = new Date(event.startDate)
    const eventEnd = new Date(event.endDate)
    const startTime = datesEqual(this.date, eventStart) ? eventStart :
      new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDay(), 0, 0, 0)
    const endTime = datesEqual(this.date, eventEnd) ? eventEnd :
      new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDay(), 23, 59, 59)
    return `${this.getShortTimeString(startTime)} - ${this.getShortTimeString(endTime)}`
  }

  getShortTimeString(date: Date): string {
    return date.toLocaleTimeString('en-Us', { hour: '2-digit', minute: '2-digit' })
  }

  getEventName(event: EventInfo): string {
    let result
    if (event.eventType === EventType.Regular) {
      const startDate = new Date(event.startDate)
      const endDate = new Date(event.endDate)
      const fixedStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime()
      const fixedEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59).getTime()
      const totalDays = getDifferenceInDays(fixedEndDate, fixedStartDate) + 1
      if (totalDays > 1) {
        const currentDay = getDifferenceInDays(this.date.getTime(), fixedStartDate) + 1
        result = `${event.getName()} (Day ${currentDay}/${totalDays})`
      }
    }
    return result ?? event.getName()
  }
}

const MsecsPerDay = 1000 * 3600 * 24

function getDifferenceInDays(d1: number, d2: number): number {
  const difference = Math.abs(d1 - d2)
  return Math.floor(difference / MsecsPerDay)
}
