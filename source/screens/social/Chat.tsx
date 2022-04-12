//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useEffect } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { SocialStackPropsPerPath } from "navigation/params";
import {
  Dimensions,
  DrawerLayoutAndroid,
  Image,
  LogBox,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { App } from "models/app/App";
import { reactive } from "common/reactive";
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Time,
} from "react-native-gifted-chat";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { MessageImage } from "./MessageImage";
import {
  ChatRoom,
  ChatStatus,
  ChatType,
  ChatWindowType,
  GroupChatStatus,
} from "models/data/ChatRoom";
import { Chat as ChatModel } from "models/app/Social/Chat";
import { GroupChatDrawer } from "./groups/GroupChatDrawer";
import arrow from "assets/images/arrow.png";
import { useNavigation } from "@react-navigation/native";
import Tems from "assets/images/dashboard/tems.png";
import Dummy from "assets/images/user-dummy.png";
import { MorphShadow } from "components/MorphShadow";

// Yellow box warning appears because messages array is hooked by reactronic.
LogBox.ignoreLogs([
  "Warning: Failed prop type: Invalid prop `messages` of type `object` supplied",
]);

export function Chat(
  p: StackScreenProps<SocialStackPropsPerPath, "Chat">
): React.ReactElement {
  useEffect(() => {
    void App.chat?.onOpenChat();
    return () => void App.chat?.onCloseChat();
  }, []);

  const windowWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  return reactive(() => {
    const chat = App?.chat;
    console.log("chat111111>>>>", chat);
    if (!chat) return UnitializedChatLabel();

    if (chat.chatWindowType === ChatWindowType.Normal) {
      chat.group.addedToDashboard; // explicit subscription
    }

    return (
      <SafeAreaView style={styles.screen}>
        <MorphShadow
          shadowStyle={{
            backgroundColor: "#F7F7F7",
            shadowColor: "#000",
            width: (windowWidth / 100) * 100,
            height: (windowWidth / 100) * 50,
          }}
        >
          <View style={styles.mainhader}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.imgview}
            >
              <Image source={arrow} />
            </TouchableOpacity>
            <View style={styles.temapp}>
              <Text style={styles.app}>THE TĒM APP</Text>
            </View>
            <TouchableOpacity
              style={styles.rightside}
              onPress={() => {
                Keyboard.dismiss();
                chat.group.drawer.toggle;
              }}
            >
              <Image source={Tems} style={{ width: 25, height: 25 }} />
            </TouchableOpacity>
          </View>
          <View style={styles.Viewcenter}>
            <View style={styles.leftsideImg}>
              <Image
                source={
                  chat.chatInfo?.image ? { uri: chat.chatInfo?.image } : Dummy
                }
                style={{ width: 70, height: 70, borderRadius: 35 }}
              />
              <View style={styles.TestingView}>
                <Text style={styles.TestingText}>
                  {chat?.chatInfo?.group_title}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.exitView}
              onPress={chat.group.askExitGroup}
            >
              <Text style={styles.exitText}>Exit</Text>
            </TouchableOpacity>
          </View>
        </MorphShadow>

        {/* <Image source={HoneycombImage} style={styles.backgroundImage} /> */}

        {chat.chatInfo.type !== undefined ? (
          chat.chatInfo.type === ChatType.GroupChat ? (
            <DrawerLayoutAndroid
              renderNavigationView={() => <GroupChatDrawer chat={chat} />}
              drawerWidth={300}
              drawerPosition="right"
              ref={chat.group.drawer.saveRef}
            >
              <ChatContent chat={chat} />
            </DrawerLayoutAndroid>
          ) : (
            <ChatContent chat={chat} />
          )
        ) : null}
      </SafeAreaView>
    );
  });
}

function ChatContent({ chat }: { chat: ChatModel }): React.ReactElement {
  return reactive(() => {
    return (
      <>
        {/* <View style={{backgroundColor:'red'}}> */}

        <GiftedChat
          messages={chat.messages}
          user={chat.currentUser}
          onSend={(event)=>{chat.sendMessages(event)
            Keyboard.dismiss();
          }}
          renderInputToolbar={
            chat.isActive() ? undefined : renderHiddenChatInput
          }
          keyboardShouldPersistTaps="never"
          renderActions={renderChatActions}
          renderMessageImage={MessageImage}
          messagesContainerStyle={{ backgroundColor: "#F7F7F7" }}
          placeholder="Message..."
          renderBubble={(props) => {
            return (
              <Bubble
                {...props}
                textStyle={{
                  right: {
                    color: "gray",
                  },

                  left: {
                    color: "#5F5F5F",
                  },
                }}
                wrapperStyle={{
                  right: {
                    marginBottom: 5,
                    backgroundColor: "#F7F7F7",
                    borderWidth: 1,
                    borderColor: "#F7F7F7",
                    borderRadius: 5,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowOpacity: 0.29,
                    shadowRadius: 4.65,
                    elevation: 3,
                  },
                  left: {
                    marginBottom: 5,
                    backgroundColor: "#E3E3E3",
                    borderWidth: 1,
                    borderColor: "#E3E3E3",
                    borderRadius: 5,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowOpacity: 0.29,
                    shadowRadius: 4.65,
                    elevation: 3,
                  },
                }}
              />
            );
          }}
          renderTime={(props) => {
            return (
              <Time
                {...props}
                timeTextStyle={{
                  left: {
                    color: "black",
                  },
                  right: {
                    color: "#5F5F5F",
                  },
                }}
              />
            );
          }}
          renderInputToolbar={(props) => {
            return (
              <InputToolbar
                {...props}
                containerStyle={{
                  backgroundColor: "#F7F7F7",
                  borderTopColor: "#F7F7F7",
                }}
                textInputStyle={{
                  backgroundColor: "#F7F7F7",
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowOpacity: 0.29,
                  shadowRadius: 4.65,
                  elevation: 7,
                }}
              />
            );
          }}
          renderCustomView={() => {
            return <View></View>;
          }}
        />

        {chat.isActive() ? null : <BlockedChatInput chat={chat.chatInfo} />}
      </>
    );
  });
}

function renderHiddenChatInput(): undefined {
  return undefined;
}

function BlockedChatInput({
  chat,
}: {
  chat: ChatRoom;
}): React.ReactElement | null {
  let text: string = "";
  if (chat.type === ChatType.SingleChat) {
    if (chat.chat_status === ChatStatus.Blocked)
      text = "You can't send messages to this conversation.";
    else if (
      chat.chat_status === ChatStatus.BlockedByAdmin ||
      chat.chat_status === ChatStatus.ProfileDeleted
    )
      text = "You can't send messages to this conversation.";
    else if (chat.chat_status === ChatStatus.Unfriend)
      text = "You can't send messages to this user as you are not tēmates.";
  } else {
    if (chat.group_chat_status !== GroupChatStatus.Active) {
      if (chat.chatWindowType === ChatWindowType.Challenge)
        text =
          "You can't send messages to this group because you are not the part of this challenge.";
      else if (chat.chatWindowType === ChatWindowType.Goal)
        text =
          "You can't send messages to this group because you are not the part of this goal.";
      else {
        if (chat.group_chat_status === GroupChatStatus.NoLongerPartOfGroup)
          text =
            "You can't send messages to this group because you're no longer a participant.";
        else if (chat.group_chat_status === GroupChatStatus.Observer)
          text =
            "You can't send messages to this group because you're not a participant. Please join the group.";
      }
    }
  }
  return (
    <View style={styles.blockedChatInput}>
      <Text style={styles.blockedChatInputText}>{text}</Text>
    </View>
  );
}

function renderChatActions(): React.ReactElement {
  return (
    <Pressable
      style={styles.chatAction}
      onPress={App?.chat!.selectAndSendImage}
    >
      <Icon name="plus" size={25} style={styles.chatActionIcon} />
    </Pressable>
  );
}

function UnitializedChatLabel(): React.ReactElement {
  return (
    <SafeAreaView style={[styles.screen, styles.unitializedChat]}>
      <Text style={styles.unitializedChatLabel}>
        There is no anyone to start a chat with :(
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  rightHeaderButtons: {
    flexDirection: "row",
  },
  groupInfoButton: {
    marginRight: 15,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
  },

  chatAction: {
    marginLeft: 15,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F7F7",
    width: 30,
    height: 30,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  chatActionIcon: {
    fontWeight: "500",
    color: "#0B82DC",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    shadowColor: "#000",
    fontSize: 14,
  },

  blockedChatInput: {
    borderTopWidth: 1,
    borderTopColor: "lightgrey",
    backgroundColor: "white",
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 10,
  },
  blockedChatInputText: {
    textAlign: "center",
    color: "grey",
  },

  unitializedChat: {
    justifyContent: "center",
    alignItems: "center",
  },
  unitializedChatLabel: {},
  maincontainer: {
    backgroundColor: "#F7F7F7",
    width: "100%",
    height: "100%",
  },
  mainhader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 80,
    width: "100%",
  },
  imgview: {
    marginLeft: 20,
  },
  temapp: {},
  app: {
    fontWeight: "500",
    color: "#0B82DC",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    shadowColor: "#000",
  },
  rightside: {
    marginRight: 20,
    backgroundColor: "#F7F7F7",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  Icons: {
    fontSize: 21,
    color: "#0B82DC",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.29,
    shadowRadius: 2.65,
    elevation: 5,
  },

  Viewcenter: {
    marginHorizontal: 25,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftsideImg: {},
  exitView: {
    backgroundColor: "#F7F7F7",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  exitText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#0B82DC",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    shadowColor: "#000",
  },
  TestingView: {
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: 90,
  },
  TestingText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#0B82DC",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    shadowColor: "#000",
    position: "absolute",
    bottom: 5,
    left: 5,
  },
  lestNeomeph: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginRight: 20,
    marginTop: 20,
  },
  leftchat: {
    display: "flex",
    flexDirection: "row",
    marginLeft: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  leftImg: {},
  rightNeomeph: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: 20,
    marginTop: 20,
  },
});
