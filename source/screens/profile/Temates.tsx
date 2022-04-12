//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from "react";
import { Transaction, Ref } from "reactronic";
import { reactive } from "common/reactive";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Dimensions,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

import { App } from "models/app/App";
import { TemateList, TemateActionButton } from "components/TemateList";
import { UserInfo } from "models/data/UserInfo";
import { PagedList } from "models/app/PagedList";
import { Bool } from "common/constants";
import { doAsync } from "common/doAsync";
import { AcceptOrReject, SearchMode } from "models/app/UserSearchManager";
import { showUserDetails } from "./OtherUser";
import { TemateSearchOptions } from "models/app/UserSearch";
import { MainBlueColor } from "components/Theme";
import { Neomorph } from "react-native-neomorph-shadows";
import { ChatHeader } from "components/Header";
import { useNavigation } from '@react-navigation/native'

export const Temates = (): React.ReactElement => {
  const windowWidth = Dimensions.get("window").width;
  return reactive(() => {
    const manager = App.userSearchManager;
    const m = Ref.to(manager);
   const navigation = useNavigation();
   
    return (
      <View style={styles.container}>
        <ScrollView>
          <ChatHeader rightIcon="cross" rightOnPress={()=> navigation.goBack()} />

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              backgroundColor: "#f7f7f7",
            }}
          >
            <View style={{ margin: 10 }}>
              <Neomorph
                inner // <- enable shadow inside of neomorph
                style={{
                  shadowRadius: 1,
                  borderRadius: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 4, height: 4 },
                  elevation: 2,
                  backgroundColor: "#F7F7F7",
                  width: (windowWidth / 100) * 30,
                  height: (windowWidth / 100) * 10,
                }}
              >
                <Pressable
                  style={[
                    styles.tab,
                    styles.tabLeft,
                    manager.searchMode ? undefined : styles.active,
                  ]}
                  onPress={() => manager.setSearchMode(SearchMode.Friends)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      manager.searchMode ? undefined : styles.active,
                    ]}
                  >
                    Current Tēmates
                  </Text>
                </Pressable>
              </Neomorph>
            </View>

            <View style={{ margin: 10 }}>
              <Neomorph
                inner // <- enable shadow inside of neomorph
                style={{
                  shadowRadius: 1,
                  borderRadius: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 4, height: 4 },
                  elevation: 2,
                  backgroundColor: "#F7F7F7",
                  width: (windowWidth / 100) * 30,
                  height: (windowWidth / 100) * 10,
                }}
              >
                <Pressable
                  style={[
                    styles.tab,
                    styles.tabRight,
                    manager.searchMode ? styles.active : undefined,
                  ]}
                  onPress={() => manager.setSearchMode(SearchMode.AllUsers)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      manager.searchMode ? styles.active : undefined,
                    ]}
                  >
                    Find New{" "}
                  </Text>
                </Pressable>
              </Neomorph>
            </View>
          </View>


  {manager.searchMode === SearchMode.AllUsers ? (
          <View style={styles.content}>
            <View style={styles.buttons}>
              <Pressable
                style={[styles.button, styles.search]}
                onPress={() => {
                  App.rootNavigation.push('SearchTemates', { options: TemateSearchOptions })
                }}
              >
                <Icon name='search' color={SearchColor} />
                <Text style={[styles.buttonText, styles.searchButtonText]}>Search</Text>
              </Pressable>
              {/* <View style={[styles.row, styles.social]}>
                <Pressable
                  style={[styles.button, styles.centered, styles.socialButton, styles.facebook]}
                  onPress={() => doAsync(() => manager.readFacebookContacts())}
                >
                  <Text style={[styles.buttonText, styles.socialButtonText]}>Facebook</Text>
                  <Icon name='facebook' color='white' />
                </Pressable>
                <Pressable
                  style={[styles.button, styles.centered, styles.socialButton, styles.contacts]}
                  onPress={() => void manager.readPhoneContacts()}
                >
                  <Text style={[styles.buttonText, styles.socialButtonText]}>Contacts</Text>
                </Pressable>
              </View> */}
            </View>
            <View style={[styles.temates, styles.suggested]}>
              <TemateList
                  list={manager.suggestions}
                  title='suggested tēmates'
                  onUserPressed={showUserDetails}
                  buttons={[{
                    id: 'add',
                    icon: 'plus',
                    title: 'Add',
                    shouldHide: user => user.is_friend === Bool.True,
                  onPress: user => doAsync(() => App.userSearchManager.sendRequest(user)),
                }]}
              />
            </View>
          </View>
        ) : (
          <View style={styles.content}>
            {(manager.pendingRequests.items.length > 0) && (
              <Requests
                list={manager.pendingRequests}
                expanded={m.pendingRequestsExpanded}
                title='Pending Requests'
                onUserPressed={showUserDetails}
                buttons={[{
                  id: 'accept',
                  icon: 'plus',
                  title: 'Accept',
                  
                  onPress: user => doAsync(() => App.userSearchManager.acceptOrRejectFriendRequest(user, AcceptOrReject.Accept)),
                }, {
                  id: 'reject',
                  icon: 'times',
                  onPress: user => doAsync(() => App.userSearchManager.acceptOrRejectFriendRequest(user, AcceptOrReject.Reject)),
                }]}
              />
            )}
            {(manager.sentRequests.items.length > 0) && (
              <Requests
                list={manager.sentRequests}
                expanded={m.sentRequestsExpanded}
                title='Sent Requests'
                onUserPressed={showUserDetails}
                buttons={[{
                  id: 'remind',
                  icon: 'plus',
                  title: 'Remind',
                  shouldHide: user => user.reminder_status !== Bool.True,
                  onPress: user => doAsync(() => App.userSearchManager.remindUser(user)),
                }, {
                  id: 'delete',
                  icon: 'times',
                  title: 'Remove',

                  onPress: user => doAsync(() => App.userSearchManager.deleteRequest(user)),
                }]}
              />
            )}
            <View style={styles.temates}>
              <TemateList
                list={manager.temates}
                title='tēmates'
                onUserPressed={showUserDetails}
              />
            </View>
          </View>
        )}


        </ScrollView>
      </View>
    );
  });
};

interface RequestsParams {
  list: PagedList<UserInfo>;
  expanded: Ref<boolean>;
  title: string;
  buttons?: TemateActionButton[];
  onUserPressed?: (user: UserInfo) => void;
}

function Requests(p: RequestsParams): JSX.Element {
  return reactive(() => {
    let collapsedTitle = `${p.list.totalCount} ${p.title}`;
    if (p.list.totalCount === 1) {
      collapsedTitle = collapsedTitle.slice(0, collapsedTitle.length - 1);
    }
    return p.expanded.value ? (
      <View style={styles.temates}>
        <TemateList
          list={p.list}
          title={p.title}
          onUserPressed={p.onUserPressed}
          buttons={p.buttons}
        />
      </View>
    ) : (
      <Pressable
        style={[styles.collapsed, styles.temates]}
        onPress={() => {
          Transaction.run(() => {
            p.expanded.value = true;
          });
        }}
      >
        <Text style={styles.collapsedText}>{collapsedTitle}</Text>
        <Icon name="chevron-right" />
      </Pressable>
    );
  });
}

const PanelRadius = 10;
const SearchColor = "gray";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  tabs: {
    flexDirection: "row",
    width: "90%",
    backgroundColor: "white",
    marginVertical: 10,
    borderRadius: PanelRadius,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  tabText: {
    color: "black",
  },
  tabLeft: {
    borderTopLeftRadius: PanelRadius,
    borderBottomLeftRadius: PanelRadius,
  },
  tabRight: {
    borderTopRightRadius: PanelRadius,
    borderBottomRightRadius: PanelRadius,
  },
  active: {
    backgroundColor: MainBlueColor,
    color: "white",
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    width: "100%",
    alignItems: "center",
  },
  temates: {
    width: "90%",
    marginVertical: 15,
  },
  buttons: {
    width: "80%",
    marginTop: 5,
    justifyContent: "center",
  },
  button: {
    flexDirection: "row",
    // alignItems: 'center',
    borderRadius: 20,
    padding: 10,
  },
  centered: {
    justifyContent: "center",
  },
  buttonText: {
    marginHorizontal: 5,
  },
  social: {
    marginVertical: 15,
    position: "relative",
    justifyContent: "space-between",
  },
  search: {
    // flex: 1,
    // paddingHorizontal: 15,
    backgroundColor: "white",
  },
  searchButtonText: {
    color: SearchColor,
  },
  socialButton: {
    width: "48%",
  },
  socialButtonText: {
    color: "white",
  },
  facebook: {
    backgroundColor: "#5c70a8",
  },
  contacts: {
    backgroundColor: MainBlueColor,
  },
  suggested: {
    marginTop: 15,
  },
  collapsed: {
    flexDirection: "row",
    borderRadius: PanelRadius,
    backgroundColor: "white",
    padding: 10,
    alignItems: "center",
  },
  collapsedText: {
    flex: 1,
    paddingRight: 5,
  },
});
