//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { monitor, Ref, ObservableObject, transaction, reaction, unobservable, nonreactive } from 'reactronic'

import { EventInfo, EventRecurrence, EventType, InfiniteEvent } from 'models/data/EventInfo'
import { populate } from 'common/populate'
import { DatePickerManager } from '../DatePickerManager'
import { EventLocationManager } from './EventLocationManager'
import { App } from '../App'
import { PickerManager } from '../PickerManager'
import { formatShortDate } from 'common/datetime'
import { Api, ApiData } from '../Api'
import { EventDetailsModel, EventScope } from './EventDetailsModel'
import { ActivityMemberType } from 'models/data/GoalChallengeDetailsModel'
import { EventMember } from './EventMember'
import dayjs from 'dayjs'
import { ChatRoom } from 'models/data/ChatRoom'
import { Monitors } from '../Monitors'

export const EventRecurrenceNameMap: Map<EventRecurrence, string> = new Map<EventRecurrence, string>([
  [EventRecurrence.Single, 'Does Not Repeat'],
  [EventRecurrence.Daily, 'Every Day'],
  [EventRecurrence.Weekly, 'Every Week'],
  [EventRecurrence.EveryTwoWeeks, 'Every 2 Weeks'],
  [EventRecurrence.Monthly, 'Every Month']
])

export class EventEditor extends ObservableObject {
  event: EventInfo
  members: EventMember[]
  selectedGroup?: ChatRoom
  existing?: EventDetailsModel

  get isUpdating(): boolean {
    return this.existing !== undefined
  }

  start: Date
  end: Date
  deltaInMinutes: number

  location: EventLocationManager
  locationString: string

  recurrence: PickerManager<EventRecurrence>

  endsOnAvailable: boolean
  endsOn: string
  endsOnCalendarVisible: boolean

  startDateEditor: DatePickerManager
  endDateEditor: DatePickerManager

  isInvalid: boolean = false // validation
  isLocation: boolean = false // validation


  constructor(eventInfo?: EventDetailsModel) {
    super()
    this.existing = eventInfo

    this.event = new EventInfo()
    if (eventInfo) {
      populate(this.event, eventInfo.event)
    } else {
      const now = new Date()
      const start = dayjs(now).set('seconds', 0).set('milliseconds', 0).add(30, 'minutes')
      const end = start.add(1, 'hour')
      this.event.startDate = start.toString()
      this.event.endDate = end.toString()
    }
    this.members = eventInfo ? eventInfo.members.filter(m => m.userId !== eventInfo.event.userId) : []
    this.selectedGroup = undefined

    const startDate = this.event.startDate
    this.start = dayjs(startDate).toDate()

    const endDate = this.event.endDate
    console.log("endDate",endDate)
    this.end = dayjs(endDate).toDate()

    this.deltaInMinutes = 0

    const e = Ref.to(this.event)
    this.location = new EventLocationManager(App?.locationManager, e.location)
    this.locationString = ''

    this.recurrence = new PickerManager<EventRecurrence>([
      EventRecurrence.Single,
      EventRecurrence.Daily,
      EventRecurrence.Weekly,
      EventRecurrence.EveryTwoWeeks,
      EventRecurrence.Monthly
    ], e.reccurEvent)

    const ref = Ref.to(this)
    this.endsOnAvailable = this.event.reccurEvent !== EventRecurrence.Single
    this.endsOn = ''
    this.endsOnCalendarVisible = false
    
    this.startDateEditor = new DatePickerManager({
      model: ref.start,
      timePicker: true,
      convertToString: false,
      format: formatFullDateTime,
    })
    this.endDateEditor = new DatePickerManager({
      model: ref.end,
      timePicker: true,
      convertToString: false,
      format: formatFullDateTime,
    })
  }

  //#region Validation

  get hasValidTitle(): boolean {
    return this.event.title !== undefined && this.event.title.trim().length > 0
  }
  get hasValidUsername(): boolean {
    return this.event.title !== undefined && this.event.title.trim().length > 0
  }
  get hasValidDescription(): boolean {
    return this.event.description !== undefined && this.event.description.trim().length > 0
  }

  get hasValidEnd(): boolean {
    return dayjs(this.end).isAfter(this.start)
  }

  get hasValidCapacity(): boolean {
    const capacity = Number(this.event.membersCapacity)
    const result =
      this.event.eventType !== EventType.SignupSheet
      || this.hasInfiniteMembersCapacity()
      || (
        !Number.isNaN(capacity)
        && capacity > 0
        && capacity == Math.trunc(capacity)
      )
    return result
  }

  hasInfiniteMembersCapacity(): boolean {
    return this.event.membersCapacity === undefined
      || (this.event.membersCapacity as any) === ''
  }

  get canAccommodateAllMembers(): boolean {
    let result: boolean
    if (this.event.eventType === EventType.SignupSheet) {
      if (this.hasValidCapacity) {
        if (!this.hasInfiniteMembersCapacity()) {
          const capacity = Number(this.event.membersCapacity)
          result = this.members.length <= capacity
        }
        else
          result = true
      }
      else
        result = true
    }
    else
      result = true
    return result
  }

@reaction
isShowLocation():void{
  if(this.locationString.trim().length> 2){
    this.isLocation = true
  }else{
    this.isLocation = false
  }
}
  @transaction
  validate(): boolean {
    const isValid = this.hasValidTitle
      && this.hasValidEnd
      && this.hasValidDescription
      && this.hasValidCapacity
      && this.canAccommodateAllMembers
    this.isInvalid = !isValid
    return isValid
  }

  getInvalidCapacityText(): string {
    if (this.canAccommodateAllMembers)
      return 'Please enter positive integer number'
    else
      return `Please specify capacity to accommodate all selected temates (min. ${this.members.length})`
  }

  //#endregion

  getEndsOnDescription(value: number): string {
    return (value === InfiniteEvent) ? 'Never' : 'Select End Date'
  }

  getEndsOnString(value: number): string {
    if (this.endsOnAvailable) {
      return (value === InfiniteEvent) ? 'Never' : formatShortDate(new Date(this.event.endsOn))
    } else {
      return ''
    }
  }

  get tematesString(): string {
    return this.selectedGroup?.group_title || this.members.map(m => m.getFullName()).join(', ')
  }

  @transaction
  setInfiniteEvent(): void {
    this.event.endsOn = InfiniteEvent
  }

  @transaction
  selectEndsOnDate(): void {
    this.endsOnCalendarVisible = true
  }

  @transaction
  setEndsOn(date: Date): void {
    this.event.endsOn = date.toString()
  }

  @transaction
  setEndsOnCalendarVisible(value: boolean): void {
    this.endsOnCalendarVisible = value
  }

  @transaction @monitor(Monitors.Loading)
  async saveChanges(scope: EventScope = EventScope.AllFutureEvents): Promise<void> {
    const start = this.start
    let end = this.end
    if (start > end) {
      end = start
    }

    if (this.event.endsOn !== InfiniteEvent) {
      const endsOn = new Date(this.event.endsOn).getTime()
      const endValue = end.getTime()
      if (endsOn < endValue) {
        this.event.endsOn = end.toString()
      }
    }

    const membersCapacity = Number(this.event.membersCapacity)
    if (
      this.event.eventType === EventType.SignupSheet
      && !Number.isNaN(membersCapacity)
      && membersCapacity > 0
    ) {
      this.event.membersCapacity = membersCapacity
    }
    else {
      this.event.membersCapacity = undefined
    }

    this.event.startDate = start.toString()
    this.event.endDate = end.toString()

    const members = this.event.members.filter(m => m.userId === this.event.userId)
    if (this.members.length) {
      members.push(...this.members.map(m => {
        return {
          userId: m.userId ?? m.getId(),
          inviteAccepted: m.inviteAccepted,
          memberType: ActivityMemberType.Temate,
        }
      }))
      this.event.members = members
    }
    else if (this.selectedGroup) {
      console.log(this.selectedGroup.members)
      const response = await Api.call<ApiData<ChatRoom>>('POST', 'chat/info', { chat_room_id: this.selectedGroup.group_id })
      populate(this.selectedGroup, response.data)
      members.push(...this.selectedGroup.members.map(m => {
        return {
          userId: m.user_id,
          memberType: ActivityMemberType.Tem,
          groupId: this.selectedGroup?.group_id,
        }
      }))
      const thisUserId = App.user.getUserId()._id
      this.event.members = members.filter(m => m.userId !== thisUserId)
    }

    try {
      if (this.existing) {
        const updatedFor = (scope === EventScope.AllFutureEvents) ? 0 : this.event.startDate
        const response = await Api.call('POST', 'events/update', {
          ...this.event,
          userId: App.user.stored._id,
          updatedFor,
          updateAllEvents: scope,
        })
        const data = (response as any).data
        populate(this.event, data)
        populate(this.existing.event, this.event)
      } else {
        const response = await Api.call('POST', 'events', this.event)
        const data = (response as any).data
        populate(this.event, data)
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  @reaction
  protected initLocationString(): void {
    this.locationString = this.event.location?.location ?? ''
  }

  @reaction
  protected initEndsOnAvailable(): void {
    this.endsOnAvailable = this.event.reccurEvent !== EventRecurrence.Single
  }

  @reaction
  protected initEndsOnValue(): void {
    this.endsOn = this.endsOnAvailable ?
      ((this.event.endsOn === InfiniteEvent) ? 'Never' : formatShortDate(new Date(this.event.endsOn))) : ''
  }

  @reaction
  protected updateDurationInMinutes(): void {
    let fullStart: dayjs.Dayjs = dayjs()
    nonreactive(() => {
      fullStart = dayjs(this.start)
    })
    const fullEnd = dayjs(this.end)
    this.deltaInMinutes = fullEnd.diff(fullStart, 'minutes')
  }

  private isInitialChangeOfStart: boolean = true

  // @reaction
  protected updateEndDateTime(): void {
    // subscribe
    this.start
    if (!this.isInitialChangeOfStart) {
      nonreactive(() => {
        const fullStart = dayjs(this.start)
        const fullEnd = fullStart.add(this.deltaInMinutes, 'minutes')
        console.log("fullEnd",fullEnd)
        this.end = fullEnd.toDate()
      })
    }
    else {
      this.isInitialChangeOfStart = false
    }
  }
}

export function formatFullDateTime(date: dayjs.ConfigType): string {
  const result = dayjs(date).format('MMM DD, YYYY [at] hh:mm a')
  return result
}
