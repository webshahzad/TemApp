import { standalone, Transaction } from "reactronic";
import { EventEditor } from "models/app/Calendar/EventEditor";
import { App } from "models/app/App";
import { EventDetailsModel } from "models/app/Calendar/EventDetailsModel";
import { Api, ApiData } from "models/app/Api";
import { EventInfo } from "models/data/EventInfo";
import { populate } from "common/populate";
import { Alert, ToastAndroid } from "react-native";
import { useNavigation } from "@react-navigation/native";

export function openEditEvent(event?: EventDetailsModel): void {
  const editor = standalone(() =>
    Transaction.run(() => new EventEditor(event))
  );
  App.rootNavigation.push("EditEvent", { editor });
}

export async function loadAndShowEventDetails(
  id: string,
  replaceCurrentNavigation: boolean = false
): Promise<void> {
  const response: ApiData<EventInfo> = await Api.call("GET", "events/" + id);
  response.data._id = id;

  const event = Transaction.run(() => populate(new EventInfo(), response.data));
  showEventDetails(event, replaceCurrentNavigation);
}
export async function addEvent(data: any): Promise<void> {
  const datas = data?._id.owner;
   const response: ApiData<EventEditor> = await Api.call("POST", "events/", {
   
    description: datas?.description,
    startDate: datas?.startDate,
    eventType: datas?.eventType,
    reccurEvent: datas?.reccurEvent,
    is_deleted: 0,
    endsOn: datas?.endsOn,
    title: datas?.title,
    visibility: datas?.visibility,
    endDate: datas?.endDate,
    members: datas?.members,
    eventReminder: datas?.eventReminder,
  });

  ToastAndroid.show("Event created", ToastAndroid.SHORT);
}

export async function eventList(data: any, event: EventInfo): Promise<void> {
  const datas = data;

  const response: ApiData<EventEditor> = await Api.call(
    "POST",
    "events/listByDate",
    {
      startDate: "2022-02-02T07:17:00.000Z",
      endsOn: "2022-02-07T08:17:00.000Z",
      endDate: "2022-02-07T08:17:00.000Z",
    }
  );
  const eventlist = Transaction.run(() => (App.eventList = response.data));
}
export function showEventDetails(
  event: EventInfo,
  replaceCurrentNavigation: boolean = false
): void {
  const model = standalone(() =>
    Transaction.run(() => new EventDetailsModel(event))
  );
  replaceCurrentNavigation
    ? App.rootNavigation.replace("EventDetails", { model })
    : App.rootNavigation.push("EventDetails", { model });
}
