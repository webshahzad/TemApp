//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { toFixedPadded } from './number'

type Time = {
  hours: number
  minutes: number
  seconds: number
  milliseconds?: number

  fullSeconds?: number
  fullMinutes?: number
}

export function timeFromSeconds(fullSeconds: number): Time {
  const seconds: number = Math.trunc(fullSeconds % 60)
  const fullMinutes: number = Math.trunc(fullSeconds / 60)
  const minutes: number = fullMinutes % 60
  const hours: number = Math.trunc(fullMinutes / 60)
  return { hours, minutes, seconds, fullSeconds, fullMinutes }
}

function timeFromHours(totalHours: number): Time {
  const hours = Math.trunc(totalHours)
  let remaining = 60 * (totalHours - hours)
  const minutes = Math.trunc(remaining)
  remaining = 60 * (remaining - minutes)
  const seconds = Math.trunc(remaining)
  return { hours, minutes, seconds }
}

export function formatTimeFromSecondsWithTicks(fullSeconds: number): string {
  const time = timeFromSeconds(fullSeconds)
  return `${toFixedPadded(time.fullMinutes ?? 0, 2)}'${toFixedPadded(time.seconds, 2)}"`
}

export function formatTimeFromSeconds(fullSeconds: number): string {
  const time = timeFromSeconds(fullSeconds)
  return `${toFixedPadded(time.hours, 2)}:${toFixedPadded(time.minutes, 2)}:${toFixedPadded(time.seconds, 2)}`
}

export function formatTimeFromHours(totalHours: number): string {
  const { hours, minutes, seconds } = timeFromHours(totalHours)
  return `${hours} hrs ${minutes} mins ${seconds} secs`
}

export function formatTimeDelta(now: number, then: number): string {
  const deltaMs = then - now
  const time = timeFromSeconds(deltaMs / 1000)

  const minutes = Math.trunc(time.minutes)
  const totalHours = time.hours
  const hours = Math.trunc(totalHours % 24)
  const totalDays = Math.trunc(totalHours / 24)
  const days = totalDays % 7
  const weeks = Math.trunc(totalDays / 7)

  const parts: string[] = []
  if (weeks > 0)
    parts.push(`${weeks} Week${weeks === 1 ? '' : 's'}`)
  if (days > 0)
    parts.push(`${days} Day${days === 1 ? '' : 's'}`)
  if (hours > 0)
    parts.push(`${hours} Hour${hours === 1 ? '' : 's'}`)
  if (minutes > 0)
    parts.push(`${minutes} Minute${minutes === 1 ? '' : 's'}`)
  if (parts.length === 0)
    parts.push('Less than a minute')
  const result = parts.join(', ')
  return result
}

export function formatDateTime(date: Date): string {
  return `${date.getFullYear()}-${toFixedPadded(date.getMonth() + 1, 2)}-${toFixedPadded(date.getDate(), 2)}` +
    ` ${toFixedPadded(date.getHours(), 2)}:${toFixedPadded(date.getMinutes(), 2)}:${toFixedPadded(date.getSeconds(), 2)}`
}

export function formatDate(date: Date): string {
  return `${date.getMonth() + 1}-${toFixedPadded(date.getDate(), 2)}-${date.getFullYear()}`
}

export function formatShortDate(date: Date): string {
  const parts = date.toDateString().split(' ')
  parts.splice(0, 1) // remove day of week name
  parts[1] += ',' // add comma after day number
  const result = parts.join(' ')
  return result
}

export function formatDateDayShortMonthYear(date: Date): string {
  const parts = date.toDateString().split(' ')
  parts.splice(0, 1) // remove day of week name
  // swap month and day
  const tmp = parts[0]
  parts[0] = parts[1]
  parts[1] = tmp
  const result = parts.join(' ')
  return result
}

export function formatGoalStartDate(date: Date): string {
  return `${toFixedPadded(date.getDate(), 2)}-${toFixedPadded(date.getMonth() + 1, 2)}-${date.getFullYear()}`
}

export function formatTimeAmPm(date: Date): string {
  const minutes = date.getMinutes()
  let hours = date.getHours()
  const amPm: string = (hours >= 12) ? 'PM' : 'AM'
  hours = hours % 12
  hours = (hours > 0) ? hours : 12
  const strTime = `${hours}:${toFixedPadded(minutes, 2, 0)} ${amPm}`
  return strTime
}
