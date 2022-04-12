//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//
import React from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FA5Icon from "react-native-vector-icons/FontAwesome5";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { App } from "models/app/App";
import { EmptyDialogs } from "./EmptyDialogs";
import { reactive } from "common/reactive";
import { ChatRoom, ChatType } from "models/data/ChatRoom";
import { Avatar } from "components/Avatar";
import dayjs from "dayjs";
import arrow from "assets/images/arrow.png";
import Icons from "react-native-vector-icons/AntDesign";
import { Message, MessageType } from "models/data/Message";
import GroupImage from "assets/images/grp-image/grp-image.png";
import { Monitors } from "models/app/Monitors";
import { StackScreenProps } from "@react-navigation/stack";
import { SocialStackPropsPerPath } from "navigation/params";
import { HeaderRight } from "components/HeaderRight";
import { Neomorph } from "react-native-neomorph-shadows";
import Icon from "rn-lineawesomeicons";
import { useNavigation } from "@react-navigation/native";
import { Transaction } from "reactronic";
import { ShadowButton } from "components/ShadowButton";

export function ChatList(
  p: StackScreenProps<SocialStackPropsPerPath, "ChatList">
): React.ReactElement | null {
  const social = App.social;
  const chatList = social.chatList;
  const chats = chatList.getFilteredChats();
  const singleChat = chats.filter((chat) => chat.type === ChatType.SingleChat);
  const groupChat = chats.filter((chat) => chat.type === ChatType.GroupChat);
   const [userData, setUserData] = React.useState(singleChat);

  React.useLayoutEffect(() => {
    p.navigation.setOptions({
      headerRight: (props) => (
        <HeaderRight
          tintColor={props.tintColor}
          buttons={[
            {
              simpleIcon: "note",
              onPress: () => {
                p.navigation.navigate("SelectFriend");
              },
            },
            {
              simpleIcon: "magnifier",
              onPress: () => {
                App.social.chatList.showFilter();
              },
            },
          ]}
        />
      ),
    });
  });

  return reactive(() => {
    const chatDataList = App.user.stored.chatData;
   

    return (
      <SafeAreaView style={styles.container}>
        <ChatListHeader setUserDataList={setUserData} />
        {chatList.filter !== undefined && (
          <View style={styles.searchBar}>
            <View style={styles.searchField}>
              <FA5Icon name="search" color={SearchIconColor} size={17} />
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Search"
                  defaultValue={chatList.filter}
                  onChangeText={(value) => chatList.setFilter(value)}
                />
              </View>
              {(chatList.filter?.length ?? 0) > 0 && (
                <FA5Icon
                  name="times-circle"
                  solid
                  color={SearchIconColor}
                  size={17}
                  onPress={() => chatList.clearFilter()}
                />
              )}
            </View>
            <View style={styles.searchBarClose}>
              <MaterialIcon
                name="close"
                color="black"
                size={20}
                onPress={() => chatList.closeFilter()}
              />
            </View>
          </View>
        )}
        <FlatList
          data={chats}
          ListEmptyComponent={() => <EmptyDialogs />}
          renderItem={({ item }) => {
            return <ChatItem chat={item} />;
          }}
          refreshing={Monitors.ChatListLoading.isActive}
          onRefresh={App.social.chatList.load}
          keyExtractor={getKey}
        />
      </SafeAreaView>
    );
  });
}

function getKey(item: ChatRoom): string {
  return item.group_id;
}

function Separator(): React.ReactElement {
  return <View style={styles.separator} />;
}

export function ChatItem({ chat }: { chat: ChatRoom }): React.ReactElement {
  const windowWidth = Dimensions.get("window").width;

  return reactive(() => {
    return (
      <Pressable
        style={styles.chat}
        onPress={async () => {
          await App.openChat(chat);
        }}
      >
        <View style={{ display: "flex", flexDirection: "column" }}>
          {chat.type === ChatType.GroupChat && !chat.image ? (
            <Avatar size={35} source={GroupImage} style={styles.avatar} />
          ) : (
            <Avatar size={35} source={chat.image} style={styles.avatar} />
          )}
          <Text style={styles.title}>{chat.group_title}</Text>
        </View>
        <View style={styles.chatDescription}>
          {/* <View style={styles.titleAndDate}>
          
            <Text style={styles.date}>
              {chat.lastMessage
                ? dayjs(chat.lastMessage.time * 1000).fromNow()
                : ""}
            </Text>
          </View> */}

          <View style={styles.Neomorphview}>
            <Neomorph
              inner // <- enable shadow inside of neomorph
              style={{
                // marginTop: 10,
                shadowRadius: 1,
                borderRadius: 5,
                shadowColor: "#000",
                shadowOffset: { width: 4, height: 4 },
                elevation: 2,
                backgroundColor: "#F7F7F7",
                width: (windowWidth / 100) * 70,
                height: (windowWidth / 100) * 9,
                overflow: "hidden",
              }}
            >
              <Text style={styles.neomorphtext} numberOfLines={1}>
                {LastMessageText(chat.lastMessage)}
              </Text>
            </Neomorph>
            {/* {chat.unreadCount !== undefined && chat.unreadCount !== 0 ? (
              <View style={styles.unreadCounter}>
                <Text style={styles.unreadCounterLabel}>
                  {chat.unreadCount}
                </Text>
              </View>
            ) : null} */}
          </View>
        </View>
      </Pressable>
    );
  });
}

function LastMessageText(lastMessage?: Message): string {
  if (lastMessage)
    if (lastMessage.type === MessageType.Text) return lastMessage.text ?? "";
    else if (lastMessage.type === MessageType.Image) return "Photo";
    else if (lastMessage.type === MessageType.Video) return "Video";
  return "";
}

function ChatListHeader(p: StackScreenProps<SocialStackPropsPerPath, "Chat">) {
  const windowWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const social = App.social;
  const chatList = social.chatList;
   const chats = chatList.getFilteredChats();
  const singleChat = chats.filter((chat) => chat.type === ChatType.SingleChat);
   const groupChat = chats.filter((chat) => chat.type === ChatType.GroupChat);
   const MessageBg = App.user.stored.MessageBtnBg;
  const TemBg = App.user.stored.TemBtnBg;
  const msgColor = App.user.stored.MessageBtnColor;
  const TemColor = App.user.stored.TemBtnColor;
  React.useEffect(() => {
    Transaction.run(() => (App.user.stored.chatData = singleChat, App.user.stored.chatType = 1));
  }, []);
  return (
    <Neomorph
      inner // <- enable shadow inside of neomorph
      style={{
        shadowRadius: 1,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: { width: 4, height: 4 },
        elevation: 2,
        backgroundColor: "#F7F7F7",
        width: (windowWidth / 100) * 100,
        height: (windowWidth / 100) * 40,
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
        <TouchableOpacity style={styles.leftside}>
          <Icons
            name="search1"
            style={styles.Icons}
            onPress={() => {
              App.social.chatList.showFilter();
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={{ top: -15 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <ShadowButton
            BgColor={MessageBg}
            height={7}
            width={35}
            style={{ marginBottom: 10 }}
            borderRadius={9}
            text="Messages"
            textColor={msgColor}
            onPress={() =>
              Transaction.run(() => {
                App.user.stored.chatType = 1,
                App.user.stored.chatData = singleChat;
                App.user.stored.MessageBtnBg = "#0B82DC";
                App.user.stored.TemBtnBg = "#fff";
                App.user.stored.MessageBtnColor = "#fff";
                App.user.stored.TemBtnColor = "black";
                App.user.stored.isGroupChat = false;
              })
            }/>
          <ShadowButton
            BgColor={TemBg == "#0B82DC" ? "#0B82DC" : "#fff"}
            height={7}
            width={35}
            style={{ marginBottom: 10 }}
            text="TĒMS"
            borderRadius={9}
            textColor={TemColor}
            onPress={() =>
              Transaction.run(() => {
                App.user.stored.chatType = 2,
                App.user.stored.chatData = groupChat;
                App.user.stored.MessageBtnBg = "#fff";
                App.user.stored.TemBtnBg = "#0B82DC";
                App.user.stored.MessageBtnColor = "black";
                App.user.stored.TemBtnColor = "#fff";
                App.user.stored.isGroupChat = true;
              })
            }
          />
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            bottom: 10,
          }}
        >
          {App.user.stored.isGroupChat && (
            <TouchableOpacity
              style={styles.newTem}
              onPress={() => navigation.navigate("CreateGroup")}
            >
              <Text style={styles.newtem}>NEW TĒM</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Neomorph>
  );
}
const SearchBackground = "#efeff0";
const SearchIconColor = "darkgray";
const SearchBorderRadius = 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },

  chat: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
  },
  avatar: {
    marginRight: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  chatDescription: {
    flex: 1,
    justifyContent: "center",
    // backgroundColor:"red",
    alignItems:"center"
  },
  titleAndDate: {
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    flex: 1,
    fontSize: 10,
    width: "90%",
    flexWrap: "wrap",
  },
  messageAndUnreadCounter: {
    flexDirection: "row",
    backgroundColor: "red",
    // justifyContent: "space-between",
  },
  message: {
    color: "grey",
  },
  date: {
    textAlign: "right",
  },
  unreadCounter: {},
  unreadCounterLabel: {},

  separator: {
    borderTopWidth: 1,
    borderTopColor: "lightgrey",
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
  },

  searchBarClose: {
    marginRight: 10,
  },

  searchField: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    backgroundColor: SearchBackground,
    borderRadius: SearchBorderRadius,
    paddingHorizontal: 15,
  },

  inputWrapper: {
    flex: 1,
  },

  input: {
    flexGrow: 1,
    borderWidth: 0,
    backgroundColor: SearchBackground,
    borderRadius: SearchBorderRadius,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  // style
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
  leftside: {
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
  mainView: {
    marginTop: 20,
    backgroundColor: "#F7F7F7",
    width: "90%",
    height: 70,
    margin: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.29,
    shadowRadius: 2.65,
    elevation: 5,
  },
  mainView2: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    marginHorizontal: 10,
  },
  textbutton: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },
  buttontext: {
    fontSize: 12,
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    shadowColor: "#000",
  },
  buttontext1: {
    fontSize: 12,
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    shadowColor: "#000",
  },
  newtem: {
    justifyContent: "center",
    alignSelf: "center",
    color: "#0B82DC",
    marginTop: 5,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    shadowColor: "#000",
  },
  newTem: {
    backgroundColor: "#F7F7F7",
    width: "30%",
    height: 30,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.29,
    shadowRadius: 2.65,
    elevation: 5,
  },
  chatscreen: {},
  chatmain: {
    display: "flex",
    flexDirection: "row",
  },
  chatImg: {
    marginTop: 20,
    marginLeft: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  Neomorphview: {},
  neomorphtext: {
    justifyContent: "flex-start",
    alignItems: "center",
    fontSize: 16,
    margin: 6,
    color: "#5F5F5F",
  },
});
