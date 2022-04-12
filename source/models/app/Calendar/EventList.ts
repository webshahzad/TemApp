//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, reaction, Transaction, transaction } from "reactronic";
import { EventInfo, EventType } from "models/data/EventInfo";
import { EventEditor } from "./EventEditor";
import { Api, ApiData } from "../Api";
import { populate } from "common/populate";
import { ToastAndroid } from "react-native";
import { showEventDetails } from "screens/calendar/Events";

export class EventList extends ObservableObject {
  events: EventInfo[];

  constructor() {
    super();
    this.events = [];
  }

  @transaction
  clear(): void {
    this.events = [];
  }

  @transaction
  addEvent(event: EventInfo): void {
    const eventsMutable = this.events.toMutable();
    eventsMutable.push(event);
    this.events = eventsMutable;
  }
  
  eventList = async (data: any): Promise<void> => {
    const datas = data?._id.owner;
    console.log("dataEvent1");

    const response: ApiData<EventEditor> = await Api.call(
      "POST",
      "events/listByDate",
      {
        startDate: datas?.startDate,
        endsOn: datas?.endsOn,
        endDate: datas?.endDate,
      }
    );

    ToastAndroid.show("Event List", ToastAndroid.SHORT);
    console.log("EventListresponse", response);
    this.events = []
    // response.data._id = id
  };

  hasEventsOfType(type: EventType): boolean {
    return this.events.find((e) => e.eventType === type) !== undefined;
  }
  
}
