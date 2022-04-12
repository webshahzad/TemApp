import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity,Dimensions } from "react-native";
import active from "assets/images/active.png";
import active2 from "assets/images/active2.png";
import { standalone, Transaction } from "reactronic";
import { CalendarManager } from "models/app/Calendar/CalendarManager";
import { App } from "models/app/App";
import { EventEditor } from "models/app/Calendar/EventEditor";

export interface EditEventProps {
  editor: EventEditor;
}
export function ViewCalender(): JSX.Element {
  const d = new Date();
  let day = d.getDay();
  const windowWidth = Dimensions.get("window").width;
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container1}>
        <View
          style={{
            marginTop: 5,
            display: "flex",
            flexDirection: "row",            
            }} >
         <View>
         <Image 
          style={{position:'absolute',right:50}}
          source={day == 0 ? active : active2} />
         </View>
          <View>
            <Image
              style={{position:'absolute',right:29}}
              source={day == 1 ? active : active2}
            />
          </View>
          <View>
            <Image
              style={{position:'absolute',right:8}}
              source={day == 2 ? active : active2}
            />
          </View>
          <View>
            <Image
              style={{ }}
              source={day == 3 ? active : active2}
            />
          </View>
          <View>
            <Image style={{ position:'absolute',right:-22}} source={day == 4 ? active : active2} />
          </View>
          <View>
            <Image style={{position:'absolute',left:30}} source={day == 5 ? active : active2} />
          </View>
          <View>
            <Image 
            style={{position:'absolute',left:50}} 
            source={day == 6 ? active : active2} />
          </View>
        </View>
        <View style={styles.hr1}>
          <View style={styles.hr2}>
            <View style={styles.hr3} />
            <View style={styles.hr4} />
          </View>
          <View style={{justifyContent:'center',alignItems:'center' }}>
            <Text style={styles.weekname}>SMTWTFS</Text>
          </View>
        </View>
      </View>
      <View style={styles.container2}>
        <TouchableOpacity
          onPress={() => {
            const manager = standalone(() =>
              Transaction.run(() => new CalendarManager())
            );

            App.rootNavigation.push("Calendar", { manager });
          }}
        >
          <Text style={styles.viewCalender}>View Your Calender</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const windowWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  mainContainer: {
    marginTop:8,    
    backgroundColor: "#0682DC",
    zIndex: 1,
    width: (windowWidth/100)* 70,
    marginBottom: 175,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#0B82DC",
    borderRadius: 8,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.49,
    shadowRadius: 7.11,
    elevation: 11,
  },
  container1: {
    marginTop:5,
    display: "flex",
    flexDirection: "column",
    width: (windowWidth/100)* 60,
    // height: 75,
    backgroundColor: "#3e3e3e",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#0B82DC",
    borderRadius: 12,
    borderTopWidth: 8,
    borderRightWidth: 8,
    borderLeftWidth: 8,
    borderBottomWidth: 8,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 9,
  },
  container2: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#0B82DC",
    borderColor: "#0B82DC",
    borderRadius: 10,
    width: 190,
    // height:30,
    paddingVertical:8,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 5,
    marginBottom:5,
  },
  viewCalender: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 10,
    shadowColor: "#fff",
  },
  weekname: {
    color: "#0B82DC",
    letterSpacing: 14,
    marginTop: 5,
    marginBottom: 5,
    // borderRadius: 20,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 10,
    shadowColor: "#fff",
    fontSize:12,
  },
  hr1: {
    width: (windowWidth/100)* 45,
    justifyContent: "center",
    alignItems: "center",
  },
  hr2: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  hr3: {
    flex: 1,
    height: 1,
    backgroundColor: "#fff",
    // marginLeft: 14,
  },
  hr4: {
    flex: 1,
    height: 1,
    backgroundColor: "#fff",
    // marginRight: 14,
  },
});