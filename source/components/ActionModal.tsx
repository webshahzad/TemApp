//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from "react";
import {
  View,
  StyleSheet,
  ImageSourcePropType,
  Text,
  Pressable,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";

import { reactive } from "common/reactive";
import { DangerColor } from "./Theme";
import { ObservableObject, transaction } from "reactronic";
import CircularProgress from "components/CircularProgress";
import Icon from "react-native-vector-icons/Feather";
import { baseFontSize } from "native-base/lib/typescript/theme/tools";

interface ActionModalProps {
  manager: ActionModalManager;
  icon?: ImageSourcePropType;
}

export function ActionModal(p: ActionModalProps): React.ReactElement {
  const manager = p.manager;

  const dismiss = (): void => {
    manager.hide();
  };

  return reactive(() => {
    return (
      <Modal
        style={styles.modal}
        isVisible={manager.visible}
        onBackButtonPress={dismiss}
        onBackdropPress={dismiss}
        onModalWillHide={manager.doAction}
        propagateSwipe
        useNativeDriver
      >
        <View style={styles.modalContent}>
          <View style={{ width: 100, marginLeft: "100%" }}>
            <Pressable
              onPress={() => {
                dismiss();
              }}
            >
              <Icon name="x" style={{ fontSize: 20 }} />
            </Pressable>
          </View>
          <ScrollView>
            {manager.actions.map((a, i) => {
              let color: string;
              switch (a.actionType) {
                case "danger":
                  color = DangerColor;
                  break;
                case "major":
                  color = "black";
                  break;
                case "normal":
                case undefined:
                  color = "gray";
                  break;
              }
              return (
                <>
                  <TouchableOpacity
                    key={i.toString()}
                    style={styles.donetext1}
                    onPress={() => {
                      manager.setCurrentAction(a.onPress);
                      dismiss();
                    }}
                  >
                    <Text style={[styles.text, { top: i == 1 ? 30 : 30 }]}>
                      {a.name}
                    </Text>
                    <CircularProgress
                      barWidth={5}
                      trailColor="#C7D3CA"
                      fill={30}
                      strokeColor="#0BF9F3"
                      radius={27}
                      styles={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 8,
                        transform: [{ rotate: "-190deg" }],
                      }}
                    ></CircularProgress>
                  </TouchableOpacity>
                </>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    );
  });
}

export interface ActionItem {
  name: string;
  actionType?: "danger" | "major" | "normal";
  onPress: () => void;
}

export class ActionModalManager extends ObservableObject {
  visible: boolean = false;
  actions: ActionItem[] = [];
  currentAction?: () => void = undefined;

  constructor() {
    super();
  }

  @transaction
  setCurrentAction(onPress: () => void): void {
    this.currentAction = onPress;
  }

  @transaction
  doAction(): void {
    this.currentAction && this.currentAction();
    this.currentAction = undefined;
  }

  @transaction
  show(actions: ActionItem[]): void {
    this.visible = true;
    this.actions = actions.slice();
  }

  @transaction
  hide(): void {
    this.visible = false;
  }
}

const ContentPaddingTop = 10;
const IconSize = 70;

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    paddingTop: ContentPaddingTop,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    maxHeight: "50%",
    backgroundColor: "#ffffffd1",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    height: IconSize,
    width: IconSize,
    alignSelf: "center",
    resizeMode: "contain",
    marginTop: -(IconSize / 2 + ContentPaddingTop),
  },
  // pressable: {
  //   paddingVertical: 20,
  //   borderTopColor: 'lightgray',
  //   borderTopWidth: 1,
  // },
  text: {
    fontSize: 10,
    textAlign: "center",
    color: "#0B82DC",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    marginLeft: 8,
    borderColor: "#FFFFFF",
    fontWeight: "500",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    shadowColor: "#000",
  },
  donetext1: {
    marginBottom: 10,
    backgroundColor: "#F7F7F7",
    width: 70,
    height: 70,
    borderRadius: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.29,
    shadowRadius: 5.65,
    elevation: 2,
  },
});
