//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from "react";
import { reactive } from "common/reactive";
import { DatePickerManager } from "models/app/DatePickerManager";
import { BadgeProps } from "./Badge";
import { Transaction, Ref } from "reactronic";
import DateTimePicker from "react-native-datepicker";
import { Focus } from "common/Focus";
import { View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { App } from "models/app/App";


export interface DatePickerProps extends Omit<BadgeProps, "selected"> {
  manager: DatePickerManager;
  minimumDate?: Date;
}

export function DatePickerLight(p: DatePickerProps): JSX.Element {
  const [pickerFocus] = React.useState(() =>
    Transaction.run(() => new Focus())
  );

  return reactive(() => {
      const iconName =
    App.user.dateValue ? "check-circle-outline": "error-outline";
  const iconColor =App.user.dateValue ? "green" : "red";
    return (
      <View>
        <DateTimePicker
          // date={p.manager.model.value}
          mode={p.manager.mode}
          format="DD-MM-YYYY"
          is24Hour={false}
          minDate={p.minimumDate}
          textColor="red"
          placeholder={p.label}
          onDateChange={p.onDateChange}
          style={{
            width: "93%",
            fontSize: 12,
            color: "black",
            
          }}
          customStyles={{
            dateIcon: {
              display: "none",
            },
          dateText:{
            color:"green"
          },
            dateInput: {
              marginLeft: 20,
              backgroundColor: "#fff",
              borderWidth: 0,
              borderColor: "#fff",
              borderRadius: 45,
              flex: 1,
              alignItems: "flex-start",
              paddingLeft: 15,
              height: 41,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.29,
              shadowRadius: 4.65,
              elevation: 7,
            },
            placeholderText: { fontSize: 10, color: "gray", paddingLeft: 0 },
          }}
        />
         {/* <Icon
                  style={{ position: "absolute", right: 38, bottom: 10 }}
                  name={iconName}
                  size={15}
                  color={iconColor}
                /> */}
      </View>
    );
  });
}
