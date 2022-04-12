import { ImageContainer } from "components/ImageContainer/ImageContainer";
import React from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HomeBg from "assets/images/HomeBg.png";
import { Header } from "components/Header";
import { App } from "models/app/App";
import { Neomorph } from "react-native-neomorph-shadows";
import { EmptyDialogs } from "screens/social/EmptyDialogs";
import Image1 from "assets/slicing/Rectangle2/image2.png";
import Image2 from "assets/nutrition.png";
import Image3 from "assets/TemTv.png";
import Image4 from "assets/slicing/Rectangle4/image4.png";
import Image5 from "assets/slicing/Rectangle4/Ride.png";

// import Image6 from "assets/slicing/Rectangle1/image1.png";
import { useNavigation } from "@react-navigation/native";
import { ShadowButton } from 'components/ShadowButton'
import { DialougeBoxComp } from "components/DialougeBox";
import { Transaction } from 'reactronic'

const data = [
  {
    id: 1,
    image: Image1,
    heading: "What's New",
    description: "See whats going on in the app",
    screenName: "Notifications",
   },
   {
    id: 2,
    image: Image5,
    heading: "Florida Challenge",
    description: "ride and madd",
    screenName: "",
    alertMsg: "Join the Ride like MADD Florida Challenge when it opens on April 4th"
  },
  {
    id: 3,
    image: Image2,
    heading: "Nutrition Awareness",
    description: "Push Up challenge",
    screenName: "",
  },
  {
    id: 4,
    image: Image3,
    heading: "Tem Tv",
    description: "Watch Video",
    screenName: "chat",
    alertMsg: 'Comming Soon!'
  
  },
   {
    id: 5,
    image: Image4,
    heading: "Goals & Challenges",
    description: "See whats going on in the app",
    screenName: "GoalsAndChallenges",
    
    },
 
  // {
  //   id: 6,
  //   image: Image6,
  //   heading: "What's New",
  //   description: "See whats going on in the app",
  //   screenName: "GoalsAndChallenges",
  //   openPath: "",
  //   visible: "",
  //   popupText: "",
  //   closePath: "",
  // },

];
export function ContentCarousel() {
  const windowWidth = Dimensions.get("window").width;
  return (
    <ImageBackground source={HomeBg} resizeMode="stretch" style={{ flex: 1 }}>
      <Header
        rightIcon="search"
        rightOnPress={() => App.globalSearch.show()}
        icons
        isChildren={false}
        rightblackstyle={{}}
        rightIconStyle={{}}
        children={undefined}
      />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 50,
        }}
      >             
        <ShadowButton
            BgColor="#fff"
            height={8}
            width={37}
            borderRadius={9}
            style={{ marginBottom: 10 }}
            text="my content"
            textColor="#00253D"
            onPress={() => {}}
            />
        <ShadowButton
            BgColor="#00253D"
            height={8}
            borderRadius={9}
            width={37}
            style={{ marginBottom: 10 }}
            text="content market"
            textColor="#f7f7f7"
            onPress={() => {}}
            />
      </View>
      <ContentList />
      {/* <DialougeBoxComp /> */}
    </ImageBackground>
  );
}

function ContentList() {
  const navigation = useNavigation();
  return (
    <View>
      <FlatList
        data={data}
        //   ListEmptyComponent={() => <EmptyDialogs />}
        contentContainerStyle={{
          width: "100%",
          // justifyContent: "center",
          // alignItems: "center",
          marginHorizontal: 25,
          paddingBottom: 200,
        }}
        renderItem={({ item }) => {
          return (
            <>
            <Pressable key={item.id} style={styles.main} 
         
             >
              <Image style={styles.images} source={item.image} />

              <View style={styles.row}>
                <Text
                  style={[
                    styles.Text,
                    { fontSize: 15, textTransform: "capitalize" },
                  ]}
                >
                  {item.heading}
                </Text>
                <Text style={[styles.Text, { fontSize: 12 }]}>
                  {item.description}
                </Text>
                <Text
                  style={[styles.Text, {fontSize: 15, marginTop: 20 }]}
                  onPress={() =>{
                    if(item.heading==="What's New" || item.heading==="Goals & Challenges"){
                      navigation.navigate(item.screenName)
                    }else{
                     
                      // Transaction.run(() => (App.user.TemTv))
                      // Alert.alert("TimeTv")
                      let msg = item.alertMsg ? item.alertMsg : 'Coming Soon!';
                      Transaction.run(() => {App.user.isJournal = true; App.user.dialogText=msg})
                    }
                   
                    
                  } }
                >
                  Details...
                </Text>
              </View>
            </Pressable>
          </>
          );
        }}
        //   refreshing={Monitors.ChatListLoading.isActive}
        //   onRefresh={App.social.chatList.load}
        //   keyExtractor={getKey}
      />
      <DialougeBoxComp onPress={()=>Transaction.run(() => {App.user.isJournal = false; App.user.dialogText=''})} />
    </View>
  );
}

const styles = StyleSheet.create({
  textbutton: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },
  buttontext: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    shadowColor: "#000",
  },
  images: {
    width: 140,
    height: 90,
  },
  main: {
    width: "100%",
    flexDirection: "row",
    marginTop: 20,
  },
  row: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 10,
  },
  Text: {
    color: "#FFFFFF",
    fontWeight: "600",
    textShadowColor: "rgba(255,255,255,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 10,
    shadowColor: "#000000",
  },
});
