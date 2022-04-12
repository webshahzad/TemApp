import { reactive } from "common/reactive";
import { App } from "models/app/App";
import { background } from 'native-base/lib/typescript/theme/styled-system'
import React from "react";
import { GestureResponderEvent, Text } from "react-native";
import Dialog, {
  SlideAnimation,
  DialogFooter,
  DialogButton,
  DialogContent,
} from "react-native-popup-dialog";

interface dialogProps {
  onPress: (e: GestureResponderEvent) => void;
}

export function DialougeBoxComp(p: dialogProps) {
  return reactive(() => {
    const user = App.user;
    return (
      <Dialog 
        visible={user.isJournal}
        dialogAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        footer={
          <DialogFooter >
            <DialogButton
              text="OK"
              textStyle={{ color: "black" }}
              onPress={p.onPress}
            />
          </DialogFooter>
        }
      >
        <DialogContent
          style={{
            width: 250,
            height: 70,
            justifyContent: "center",
            alignItems: "center",
            marginTop:20,
            fontSize:20,
           
          }}
        >
          <Text style={{ color: "black", fontWeight: "500",fontSize:13, }}>
            {App.user.dialogText}
          </Text>
        </DialogContent>
      </Dialog>
    );
  });
}
