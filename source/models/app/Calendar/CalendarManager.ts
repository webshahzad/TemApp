//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import {
  monitor,
  Ref,
  ObservableObject,
  transaction,
  reaction,
  unobservable,
  nonreactive,
} from "reactronic";
import { Api } from "../Api";
import { EventInfo } from "models/data/EventInfo";
import { populate } from "common/populate";
import { DateKind, DayInfo } from "./DayInfo";
import { CurrentDateManager } from "./CurrentDateManager";
import { Monitors } from "../Monitors";
import { EventType } from "models/data/EventInfo";
import EventImage from "assets/images/active.png";
import TaskStrokeImage from "assets/icons/TaskStroke/TaskStroke.png";
import GoalImage from "assets/icons/calendar/goals.imageset/goals.png";
import ChallengeImage from "assets/icons/calendar/challenges.imageset/challenges.png";

export enum CalendarDisplayMode {
  Grid,
  List,
}

export interface MonthInfo {
  month: number;
  year: number;
}

export type WeekDays = DayInfo[];
export type MonthDays = WeekDays[];
export type MonthRange = MonthDays[];

export const WeekDayNames = ["S", "M", "T", "W", "T", "F", "S"];
export const MonthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MonthsPerListPage = 5;
// export const ListMonthsBeforeCurrentOne = 12

export class CalendarManager extends ObservableObject {
  current: MonthInfo;
  months: MonthRange;
  displayMode: CalendarDisplayMode;
  dateManager: CurrentDateManager;
  selectedDate
  constructor() {
    super();

    const date = new Date();
    this.selectedDate = new Date();

    this.current = { month: date.getMonth(), year: date.getFullYear() };
    this.months = [];
    this.displayMode = CalendarDisplayMode.Grid;
    const ref = Ref.to(this);
    this.dateManager = new CurrentDateManager(ref.current);
  }

  getCurrentMonthDays(): MonthDays | undefined {
    return this.months.length ? this.months[0] : undefined;
  }

  getMonthInfo(days: MonthDays): MonthInfo {
    const validWeek = days[1]; // in order not to take possible days from previous month
    const validDay = validWeek[0];
    return {
      month: validDay.date.getMonth(),
      year: validDay.date.getFullYear(),
    };
  }

  getTitle(): string {
    return this.getMonthTitle(this.current);
  }

  getMonthTitle(info: MonthInfo): string {
    return `${MonthNames[info.month]} ${info.year}`;
  }

  getWeekTitle(week: WeekDays, month: MonthInfo): string {
    let startDate = undefined;
    let endDate = undefined;
    for (const day of week) {
      if (day.date.getMonth() === month.month) {
        // should skip earlier/later months
        if (startDate === undefined) {
          startDate = day.date;
        }
        endDate = day.date;
      } else if (startDate !== undefined) {
        break;
      }
    }

    return startDate !== undefined && endDate !== undefined
      ? `${this.getDayTitle(startDate)} - ${this.getDayTitle(endDate)}`
      : "";
  }

  getEventDays(week: WeekDays): DayInfo[] {
    const data = week.filter((day) => day.schedule.events.length > 0);
    console.log("week", data);

    return data;
  }

  @transaction
  showPreviousMonth(): void {
    this.current = this.getPrevMonth(this.current);
  }

  @transaction
  showNextMonth(): void {
    this.current = this.getNextMonth(this.current);
  }

  @transaction
  @monitor(Monitors.Loading)
  async setDisplayMode(value: CalendarDisplayMode,day:any): Promise<void> {
    console.log("CalendarDisplayMode",day);
    if (this.displayMode !== value) {
      this.displayMode = value;
      if (value === CalendarDisplayMode.Grid) {
        // No need to load more items - current month has already been loaded
        // const month = this.months[ListMonthsBeforeCurrentOne]
        // this.months = [month]
      } else {
        return this.loadDataImpl();
        // const monthsBefore = await this.loadMonths({ month: this.current.month, year: this.current.year - 1 },
        //   ListMonthsBeforeCurrentOne)
        // const monthsAfter = await this.loadMonths(this.getNextMonth(this.current), MonthsPerListPage - 1)
        // this.months.unshift(...monthsBefore)
        // this.months.push(...monthsAfter)
      }
    }
  }

  @transaction
  async loadNextMonths(): Promise<void> {
    const info = this.getMonthInfo(this.months[this.months.length - 1]);
    const nextRange = await this.loadMonths(
      this.getNextMonth(info),
      MonthsPerListPage
    );
    const monthsMutable = this.months.toMutable();
    monthsMutable.push(...nextRange);
    this.months = monthsMutable;
  }

  private canReload: boolean = false; // do not reload before initial reaction

  @transaction
  async reload(): Promise<void> {
    if (this.canReload) {
      for (const month of this.months) {
        for (const week of month) {
          for (const day of week) {
            day.schedule.clear();
          }
        }
      }
      await this.loadEvents(this.months);
      // await this.loadDataImpl()
    }
  }

  @reaction
  protected async initMonthRange(): Promise<void> {
    this.canReload = true;
    return this.loadDataImpl();
  }

  // Load previous months
  // private async loadDataImpl(): Promise<void> {
  //   const displayMode = unobservable(() => this.displayMode)
  //   const count = (displayMode === CalendarDisplayMode.Grid) ? 1 : (MonthsPerListPage + ListMonthsBeforeCurrentOne)
  //   const from = (displayMode === CalendarDisplayMode.Grid) ? this.current :
  //     { month: this.current.month, year: this.current.year - 1 }
  //   this.months = await this.loadMonths(from, count)
  // }

  private async loadDataImpl(): Promise<void> {
    const displayMode = nonreactive(() => this.displayMode);
    const count =
      displayMode === CalendarDisplayMode.Grid ? 1 : MonthsPerListPage;
    const from =
      displayMode === CalendarDisplayMode.Grid
        ? this.current
        : { month: this.current.month, year: this.current.year };
    this.months = await this.loadMonths(from, count);
  }

  private async loadMonths(
    from: MonthInfo,
    count: number
  ): Promise<MonthRange> {
    const months: MonthRange = [];
    for (
      let i = 0, info = from;
      i < count;
      i++, info = this.getNextMonth(info)
    ) {
      months.push(this.generateMonth(info));
    }
    await this.loadEvents(months);
    return months;
  }

  private generateMonth(info: MonthInfo): MonthDays {
    const days: MonthDays = [];
    const now = new Date();
    const dayCount = this.getDaysInMonth(info);
    const firstDay = new Date(info.year, info.month, 1);
    const dayOfWeek = firstDay.getDay();

    let startDay = 1;
    if (dayOfWeek > 0) {
      // Adjust the first week from previous month if necessary
      const prev = this.getPrevMonth(info);
      const prevDayCount = this.getDaysInMonth(prev);
      const week: DayInfo[] = new Array<DayInfo>(7);
      let prevDay = prevDayCount - 1;
      for (let i = dayOfWeek - 1; i >= 0; i--) {
        const date = new Date(prev.year, prev.month, prevDay);
        week[i] = new DayInfo(date, this.getDateKind(date, now), true);
        prevDay--;
      }
      for (let i = dayOfWeek; i < 7; i++) {
        const date = new Date(info.year, info.month, startDay);
        week[i] = new DayInfo(date, this.getDateKind(date, now), false);
        startDay++;
      }
      days.push(week);
    }

    let otherMonth = false;
    let current = info;
    while (startDay <= dayCount && !otherMonth) {
      const week: DayInfo[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(current.year, current.month, startDay);
        week.push(new DayInfo(date, this.getDateKind(date, now), otherMonth));
        startDay++;
        if (startDay > dayCount) {
          // Finish the last week with next month days if necessary
          otherMonth = true;
          startDay = 1;
          current = this.getNextMonth(info);
        }
      }
      days.push(week);
    }

    return days;
  }

  private getDaysInMonth(info: MonthInfo): number {
    const next = this.getNextMonth(info);
    return new Date(next.year, next.month, 0).getDate();
  }

  private getDateKind(date: Date, now: Date): DateKind {
    if (datesEqual(date, now)) {
      return DateKind.Now;
    } else {
      return date < now ? DateKind.Earlier : DateKind.Later;
    }
  }

  private getPrevMonth(info: MonthInfo): MonthInfo {
    const month = info.month > 0 ? info.month - 1 : 11;
    const year = info.month > 0 ? info.year : info.year - 1;
    return { month, year };
  }

  private getNextMonth(info: MonthInfo): MonthInfo {
    const month = info.month < 11 ? info.month + 1 : 0;
    const year = info.month < 11 ? info.year : info.year + 1;
    return { month, year };
  }

  private async loadEvents(range: MonthRange): Promise<void> {
    const startDate = range[0][0][0].date;
    const lastMonth = range[range.length - 1];
    const lastDate = lastMonth[lastMonth.length - 1][6].date;
    const endDate = new Date(
      lastDate.getFullYear(),
      lastDate.getMonth(),
      lastDate.getDate(),
      23,
      59,
      59
    );
    const response = await Api.call("POST", "events/listByDate", {
      startDate,
      endDate,
    });
    const data = (response as any).data;
    const events = data.map((e: any) => {
      const event = new EventInfo();
      populate(event, e);
      return event;
    });
    for (const event of events) {
      const startDate = event.getStartDate();
      const endDate = event.getEndDate();

      let firstOccurrence = false;
      let lastOccurrence = false;
      for (const month of range) {
        for (let i = 0; i < month.length; i++) {
          for (let j = 0; j < 7; j++) {
            const day = month[i][j];

            let isEventDay = false;
            if (datesEqual(endDate, day.date)) {
              isEventDay = firstOccurrence = lastOccurrence = true;
            } else if (datesEqual(startDate, day.date)) {
              isEventDay = firstOccurrence = true;
            } else if (day.date > startDate && day.date < endDate) {
              isEventDay = true;
            }
            if (isEventDay) {
              day.schedule.addEvent(event);
            }

            if (firstOccurrence && lastOccurrence) {
              break;
            }
          }
          if (firstOccurrence && lastOccurrence) {
            break;
          }
        }
        if (firstOccurrence && lastOccurrence) {
          break;
        }
      }
    }
  }

  private getDayTitle(day: Date): string {
    const month = day.toLocaleString("en-Us", { month: "short" });
    return `${day.getDate()} ${month}`;
  }
}

export function datesEqual(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export const eventIconMap: Map<EventType, number> = new Map<EventType, number>([
  [EventType.Regular, EventImage],
  [EventType.SignupSheet, TaskStrokeImage],
  [EventType.Goal, GoalImage],
  [EventType.Challenge, ChallengeImage],
]);
