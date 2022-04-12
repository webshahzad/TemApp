import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  GestureResponderEvent,
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import FAIcons from "react-native-vector-icons/FontAwesome";
import { Neomorph } from "react-native-neomorph-shadows";
import { useNavigation } from "@react-navigation/native";

export interface HeaderProps {
  rightOnPress: (e: GestureResponderEvent) => void;
  rightIcon?: string | undefined;
  icons?: boolean;
  children?: React.ReactNode 
  isChildren?: boolean,
  rightIconStyle?: object,
  rightblackstyle?:object,

  
}

export function ChatHeader(p: HeaderProps) {
  const windowWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

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
        height: (windowWidth / 100) * (p.isChildren ? 40 :25),
      }}
    >
      <View style={styles.mainhader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.imgview}
        >
          <Icon name="chevron-left" style={styles.rightIcons} />
        </TouchableOpacity>
        <View style={styles.temapp}>
          <Text style={styles.app}>THE TĒM APP</Text>
        </View>
       <TouchableOpacity style={styles.rightsideView} onPress={p.rightOnPress}>
          {p.icons ? (
            <FAIcons name={p.rightIcon} style={styles.Icons} />
          ) : (
            <Icon name={p.rightIcon} style={[styles.Icons, p.rightIconStyle]}  />
          )}
        </TouchableOpacity>
      </View>
      <View>
        {p.children}
      </View>
    </Neomorph>
  );
}

export function Header(p: HeaderProps) {
  const windowWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  return (
    <View style={[styles.mainhader, { backgroundColor: "transparent" }]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.imgview}
      >
        <Icon name="chevron-left" style={[styles.rightIcons, {color:"white"}]} />
      </TouchableOpacity>
      <View style={styles.temapp}>
        <Text style={[styles.app, { color: "white" }]}>THE TĒM APP</Text>
      </View>
      <TouchableOpacity style={[styles.rightside, p.rightblackstyle]} onPress={p.rightOnPress}>
        {p.icons ? (
          <FAIcons
            name={p.rightIcon}
            style={[styles.Icons, { color: "#f7f7f7" }]}
          />
        ) : (
          <Icon
            name={p.rightIcon}
            style={[styles.Icons, { color: "#f7f7f7" }]}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: "#00253D",
    width: 40,
    height: 40,
    // marginTop: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#f7f7f7",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 7.65,
    elevation: 15,
  },
  rightsideView: {
    marginRight: 20,
    backgroundColor: "#f7f7f7",
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
    fontSize: 17,
    fontWeight: "600",
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
  rightIcons: {
    fontSize: 22,
    fontWeight: "600",
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
 
});
