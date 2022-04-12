//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from "react";
import { reactive } from "common/reactive";
import { View, Text, Image, Pressable, StyleSheet, ImageBackground } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

import { PagedList } from "models/app/PagedList";
import { UserInfo } from "models/data/UserInfo";
import { doAsync } from "common/doAsync";
import { MainBlueColor } from "components/Theme";
import hexagon from "assets/images/honey-blue-border/honey-blue-border1.png"

export interface TemateActionButton {
  id: string;
  icon: string;
  title?: string;

  shouldHide?: (user: UserInfo) => boolean;
  onPress: (user: UserInfo) => void;
}

export interface TemateListProps {
  list: PagedList<UserInfo>;
  title: string;
  buttons?: TemateActionButton[];
  onUserPressed?: (user: UserInfo) => void;
}

export function TemateList(p: TemateListProps): JSX.Element {
  return reactive(() => {
    const buttons: TemateActionButton[] = p.buttons || [];
    return (
      <View style={styles.container}>
        <Text style={styles.header}>{p.title}</Text>
        {p.list.items.map((user) => (
          <TemateItem
            key={user.getId()}
            user={user}
            buttons={buttons}
            onUserPressed={p.onUserPressed}
          />
        ))}
        {p.list.hasMoreItems() && (
          <Pressable
            style={styles.showMore}
            onPress={() => doAsync(p.list.loadMoreItems)}
          >
            <Text style={styles.showMoreText}>Show More</Text>
          </Pressable>
        )}
      </View>
    );
  });
}

export interface TemateItemProps {
  user: UserInfo;
  buttons?: TemateActionButton[];
  onUserPressed?: (user: UserInfo) => void;
}

export function TemateItem(p: TemateItemProps): JSX.Element {
  const user = p.user;
  return reactive(() => {
    const location = user.getLocation();
    const buttons: TemateActionButton[] = p.buttons || [];
    return (
      <>
        {
          <View style={[styles.temate, styles.row]}>
            <Image source={user.getAvatar()} style={styles.userAvatar} />
            <Pressable
              style={styles.info}
              onPress={() => p.onUserPressed && p.onUserPressed(user)}
            >
              <Text style={styles.name}>{user.getFullName()}</Text>
              {location.length > 0 && (
                <View style={styles.row}>
                  <Icon name="map-marker-alt" size={12}></Icon>
                  <Text style={styles.location}>{user.getLocation()}</Text>
                </View>
              )}
            </Pressable>
            {buttons.map((button) => {
              const id = `${user.getId()}_${button.id}`;
              const hidden = button.shouldHide && button.shouldHide(user);
              const labelled = button.title !== undefined;
              return (
                <>
                  <Pressable
                    key={id}
                    style={[
                      styles.button,
                      labelled ? styles.labelled : undefined,
                      hidden ? styles.hidden : undefined,
                    ]}
                    onPress={() => button.onPress(user)}
                  >
                    <ImageBackground source={hexagon} style={{width:50,height:50}} >
                    {/* <View style={styles.hexagonInner}> */}
                     <View style={{justifyContent:'center',alignItems:'center',marginTop:10}}>
                     <Icon
                        name={button.icon}
                        color={labelled ? "#fff" : "black"}
                        style={{ fontSize: 10,justifyContent:"center",alignItems:'center' }}
                      />
                      <Text
                        style={{
                          color: labelled ? "#fff" : "black",
                          fontSize: 10,
                        }}
                      >
                        {button.title}
                      </Text>
                     </View>
                    {/* </View> */}
                    </ImageBackground>
                   
                  </Pressable>
                </>
              );
            })}
          </View>
        }
      </>
    );
  });
}

const PanelRadius = 10;
const PanelPadding = 10;
const UserAvatarSize = 50;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  header: {
    padding: PanelPadding,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  temate: {
    width: "100%",
    margin: 5,
    height: 70,
    padding: PanelPadding,
    backgroundColor: "#F7F7F7",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    justifyContent: "center",
  },
  userAvatar: {
    width: UserAvatarSize,
    height: UserAvatarSize,
    borderRadius: UserAvatarSize / 2,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
  },
  location: {
    marginLeft: 5,
  },
  showMore: {
    paddingVertical: 5,
    alignItems: "center",
  },
  showMoreText: {
    color: "gray",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    
  },
  labelled: {
    // backgroundColor: MainBlueColor,
    // borderRadius: 15,
    // paddingVertical: 5,s
    // paddingHorizontal: 10,
  },
  buttonText: {
    marginLeft: 5,
  },
  labelledText: {
    color: "white",
  },
  hidden: {
    display: "none",
  },
  hexagon: {
    width: 100,
    height: 25,
    // marginTop: 5,
    position: "absolute",
    right: 0,
    top: 15,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  hexagonInner: {
    width: 48,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B82DC",
  },
  hexagonAfter: {
    position: "absolute",
    bottom: -15,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 24,
    borderLeftColor: "transparent",
    borderRightWidth: 24,
    borderRightColor: "transparent",
    borderTopWidth: 15,
    borderTopColor: "#0B82DC",
  },
  hexagonBefore: {
    position: "absolute",
    top: -14,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 24,
    borderLeftColor: "transparent",
    borderRightWidth: 24,
    borderRightColor: "transparent",
    borderBottomWidth: 15,
    borderBottomColor: "#0B82DC",
  },
  AddText: {
    fontSize: 9,
    color: "#fff",
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    shadowColor: "#fff",
  },
});
