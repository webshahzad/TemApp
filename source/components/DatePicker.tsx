//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useState } from "react";
import { reactive } from "common/reactive";
import { StyleSheet, View, Text } from "react-native";
import { DatePickerManager } from "models/app/DatePickerManager";
import { BadgeProps } from "./Badge";
import { Transaction, Ref } from "reactronic";
import DateTimePicker from "react-native-datepicker";
import { Focus } from "common/Focus";

export interface DatePickerProps extends Omit<BadgeProps, "selected"> {
  manager: DatePickerManager;
  minimumDate?: Date;
  title: string;
  color: string;
}

export function DatePicker(p: DatePickerProps): JSX.Element {
  const [pickerFocus] = React.useState(() =>
    Transaction.run(() => new Focus())
  );

  return reactive(() => {
    return (
      <>
        <View style={{ display: "flex", flexDirection: "column" }}>
          <Text style={styles.title}>{p.title}*</Text>
          <DateTimePicker
            date={p.manager.model.value}
            mode={p.manager.mode}
            format="DD-MM-YYYY"
            is24Hour={false}
            minDate={p.minimumDate}
            placeholder={p.label}
            androidMode="calendar"
            onDateChange={p.onDateChange}
            style={{
              width: "93%",
              fontSize: 12,

              color: "red",
            }}
            customStyles={{
              dateColor: {
                color: "red",
              },
              dateIcon: {
                display: "none",
              },
              dateText: {
                color: "white",
              },
              dateInput: {
                marginLeft: 25,
                backgroundColor: "#2e2e2e",
                borderWidth: 0,
                borderColor: "#fff",
                borderRadius: 5,
                flex: 1,
                alignItems: "flex-start",
                paddingLeft: 15,
                height: 41,
                shadowColor: "#fff",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.58,
                shadowRadius: 8.0,
                elevation: 2,
              },
              placeholderText: { fontSize: 10, color: p.color, paddingLeft: 0 },
            }}
          />
        </View>
      </>
    );
  });
}

const styles = StyleSheet.create({
  title: {
    color: "#0B82DC",
    width: "93%",
    paddingLeft: 30,
    marginTop:10
  },
});
