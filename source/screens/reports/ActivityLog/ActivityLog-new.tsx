//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { PropsWithChildren, useState } from 'react'
import { Pressable, StyleSheet, Text, View, ViewStyle, Dimensions, Alert, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { Honeycomb } from 'components/Honeycomb/Honeycomb'
import { HexPatternStrokeColor } from 'components/Theme'
import { CellCustomization, HoneycombArrangement } from 'components/Honeycomb/HoneycombProps'
import { toFixedPadded } from 'common/number'
import { App } from 'models/app/App'
import { ReportFlag } from 'models/data/UserReport'
import { reactive } from 'common/reactive'
import { ActivityGraph } from './ActivityGraph'
import { ActivityReport } from './ActivityReport'
import { ChallengesReport, GoalsReport } from './GoalsAndChallengesReport'
import { HelpModal, HelpModalManager } from './HelpModal'
import { Transaction } from 'reactronic'
import { ImageContainer } from 'components/ImageContainer/ImageContainer'
import { Header } from "components/Header"
import { LinearTextGradient } from "react-native-text-gradient"
import { Neomorph } from 'react-native-neomorph-shadows'
import { ActivityModel } from 'components/ActivityModel'

export function ActivityLog(): React.ReactElement {

  return reactive(() => {
    const modalManager = Transaction.run(() => new HelpModalManager())

    const honeycombCells: CellCustomization[] = []
    honeycombCells[3] = {
      backgroundColor: ReportFlag.color(App.user.report.totalActivityReport.totalActivityScore.flag),
      content: {
        image: ReportFlag.icon(App.user.report.totalActivityReport.totalActivityScore.flag),
        h1: App.user.report.totalActivityReport.totalActivityScore.value !== undefined ?
          toFixedPadded(App.user.report.totalActivityReport.totalActivityScore.value, 1, 2) :
          undefined,
        h2: 'Activity score',
      },
      helpOnPress: () => modalManager.showModal(),
    }
    const windowWidth = Dimensions.get("window").width
    const renderList = () => {
      if (App.user.PhysicalFitness) {
        return <PhysicalFitness />
      } else if (App.user.NutritionAwareness) {
        return <NutritionAwareness />
      } else if (App.user.Sports) {
        return <Sports />
      } else if (App.user.Lifestyle) {
        return <Lifestyle />
      } else if (App.user.MentalStrength) {
        return <MentalStrength />
      }
    }
    return (
      <SafeAreaView style={styles.screen}>
        <ImageContainer blackBG>
          <ScrollView contentContainerStyle={styles.content}>
            <Header rightIcon='plus' rightblackstyle={styles.blackBGstyle} />

            <View style={styles.mainDailyView}>
              <View style={styles.DailyView}>
                <View style={styles.linearView}>
                  <LinearTextGradient
                    style={{
                      fontWeight: "bold",
                      textShadowColor: "rgba(0,0,0,0.5)",
                      textShadowOffset: { width: -1, height: -1 },
                      textShadowRadius: 10,
                      shadowColor: "#fff",
                    }}
                    locations={[0, 1, 2]}
                    colors={["#F7B500", "#B620E0", "#32C5FF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={{ color: "#fff", fontSize: 14 }}>Daliy</Text>
                  </LinearTextGradient>
                  <LinearTextGradient
                    style={{
                      fontWeight: "bold",
                      textShadowColor: "rgba(0,0,0,0.5)",
                      textShadowOffset: { width: -1, height: -1 },
                      textShadowRadius: 10,
                      shadowColor: "#fff",
                    }}
                    locations={[0, 1, 2]}
                    colors={["#F7B500", "#B620E0", "#32C5FF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={{ color: "#fff", fontSize: 14 }}>Inspirational</Text>
                  </LinearTextGradient>
                  <LinearTextGradient
                    style={{
                      fontWeight: "bold",
                      textShadowColor: "rgba(0,0,0,0.5)",
                      textShadowOffset: { width: -1, height: -1 },
                      textShadowRadius: 10,
                      shadowColor: "#fff",
                    }}
                    locations={[0, 1, 2]}
                    colors={["#F7B500", "#B620E0", "#32C5FF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={{ color: "#fff", fontSize: 14 }}>Quote</Text>
                  </LinearTextGradient>
                </View>
              </View>
            </View>

            <View style={styles.PressableView}>
              <View style={styles.pressViwe}>
                <Pressable style={[styles.pressableButton, { backgroundColor: App.user.PhysicalFitness ? "#04FCF6" : "black" }]}
                  onPress={() => Transaction.run(() => {
                    // if(!App.user.PhysicalFitness){
                    App.user.PhysicalFitness = true
                    App.user.NutritionAwareness = false
                    App.user.Sports = false
                    App.user.Lifestyle = false
                    App.user.MentalStrength = false
                    // }
                  })}>
                  <Text style={[styles.pressableText, { color: !App.user.PhysicalFitness ? "#04FCF6" : "black" }]}>Physical Fitness</Text>
                </Pressable>
              </View>

              <View style={styles.pressViwe}>
                <Pressable style={[styles.pressableButton, { backgroundColor: App.user.NutritionAwareness ? "#04FCF6" : "black" }]}
                  onPress={() => Transaction.run(() => {
                    //  if(!App.user.NutritionAwareness) {                                     
                    App.user.PhysicalFitness = false
                    App.user.NutritionAwareness = true
                    App.user.Sports = false
                    App.user.Lifestyle = false
                    App.user.MentalStrength = false
                    //  }
                  })} >
                  <Text style={[styles.pressableText, { color: !App.user.NutritionAwareness ? "#04FCF6" : "black" }]}>Nutrition Awareness</Text>
                </Pressable>
              </View>

              <View style={styles.pressViwe}>
                <Pressable style={[styles.pressableButton, { backgroundColor: App.user.Sports ? "#04FCF6" : "black" }]}
                  onPress={() => Transaction.run(() => {
                    //  if(!App.user.Sports){
                    App.user.PhysicalFitness = false
                    App.user.NutritionAwareness = false
                    App.user.Sports = true
                    App.user.Lifestyle = false
                    App.user.MentalStrength = false
                    //  }
                  })}>
                  <Text style={[styles.pressableText, { color: !App.user.Sports ? "#04FCF6" : "black" }]}>Sports</Text>
                </Pressable>
              </View>

              <View style={styles.pressViwe}>
                <Pressable style={[styles.pressableButton, { backgroundColor: App.user.Lifestyle ? "#04FCF6" : "black" }]}
                  onPress={() => Transaction.run(() => {
                    //  if(!App.user.Lifestyle){
                    App.user.PhysicalFitness = false
                    App.user.NutritionAwareness = false
                    App.user.Sports = false
                    App.user.Lifestyle = true
                    App.user.MentalStrength = false
                    //  }
                  })} >
                  <Text style={[styles.pressableText, { color: !App.user.Lifestyle ? "#04FCF6" : "black" }]}>Lifestyle</Text>
                </Pressable>
              </View>

              <View style={styles.pressViwe}>
                <Pressable style={[styles.pressableButton, { backgroundColor: App.user.MentalStrength ? "#04FCF6" : "black" }]}
                  onPress={() => Transaction.run(() => {
                    // if(!App.user.MentalStrength){
                    App.user.PhysicalFitness = false
                    App.user.NutritionAwareness = false
                    App.user.Sports = false
                    App.user.Lifestyle = false
                    App.user.MentalStrength = true
                    // }
                  })}>
                  <Text style={[styles.pressableText, { color: !App.user.MentalStrength ? "#04FCF6" : "black" }]}>Mental Strength & Conditioning</Text>
                </Pressable>
              </View>
            </View>
            {/*                 
                <Honeycomb
            style={styles.honeycomb}
            columns={3}
            arrangement='cover'
            heightShift={-0.25}
            stroke={HexPatternStrokeColor}
            strokeWidth={2}
            textColor='white'
            contentImageWidth={35}
            cells={honeycombCells}
          /> */}
            {/* <Card style={styles.firstCard}>
            <ActivityGraph userReport={App.user.report} />
          </Card>
          <Card>
            <ActivityReport />
          </Card>
          <Card>
            <ChallengesReport />
          </Card>
          <Card>
            <GoalsReport />
          </Card> */}

            <View style={{ marginTop: "10%" }}>
              <Neomorph
                inner // <- enable shadow inside of neomorph
                style={{
                  marginTop: 10,
                  shadowRadius: 1,
                  borderRadius: 1,
                  shadowColor: "#fff",
                  shadowOffset: { width: 4, height: 4 },
                  elevation: 10,
                  backgroundColor: "#000000d9",
                  width: (windowWidth / 100) * 100,
                  height: 10,
                }}
              />
            </View>
            {renderList()}

          </ScrollView>
          <HelpModal
            manager={modalManager}
          />
        </ImageContainer>
      </SafeAreaView>
    )
  })
}

function Card({ children, style }: PropsWithChildren<{ style?: ViewStyle }>): React.ReactElement {
  return (
    <View style={[style, styles.card]}>
      {children}
    </View>
  )
}
export function PhysicalFitness() {
  const [isModalVisible, setModalVisible] = useState(false)
  const toggleModal = () => {
    setModalVisible(!isModalVisible)
  };

  const [basketVisible, setBasketVisible] = useState(false)
  const basketModal = () => {
    setBasketVisible(true)
  };

  const [boxingVisible, setBoxingVisible] = useState(false)
  const boxingModal = () => {
    setBoxingVisible(true)
  };

  const [coreVisible, setCoreVisible] = useState(false)
  const coreModal = () => {
    setCoreVisible(true)
  };

  const [danceVisible, setDanceVisible] = useState(false)
  const danceModal = () => {
    setDanceVisible(true)
  };
  
  const [ellipVisible, setEllipVisible] = useState(false)
  const ellipModal = () => {
    setEllipVisible(true)
  };

  const [flagVisible, setFlagVisible] = useState(false)
  const flagModal = () => {
    setFlagVisible(true)
  };

  const [golfVisible, setGolfVisible] = useState(false)
  const golfModal = () => {
    setGolfVisible(true)
  };
  return (
    <>
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: "10%" }}>
        <View style={styles.listView}>
          <ScrollView>
            <View style={{ margin: 20 }}>
              <ActivityModel isModalVisible={isModalVisible} toggleModal={() => setModalVisible(false)} name="Run" />
              <Pressable style={styles.listblack} onPress={toggleModal} >
                <Text style={styles.lister}>
                  Run
                </Text>
              </Pressable>

              <Pressable style={styles.listblack} onPress={basketModal} >
                <ActivityModel isModalVisible={basketVisible} name="BASKETBALL" toggleModal={() => setBasketVisible(false)} />

                <Text style={styles.lister}>
                  BASKETBALL
                </Text>
              </Pressable>
              <Pressable style={styles.listblack} onPress={boxingModal}>
                
              <ActivityModel isModalVisible={boxingVisible} toggleModal={() => setBoxingVisible(false)} name="BOXING" />
                <Text style={styles.lister}>
                  BOXING
                </Text>
              </Pressable>

              <Pressable style={styles.listblack} onPress={coreModal}>
              <ActivityModel isModalVisible={coreVisible} toggleModal={() => setCoreVisible(false)} name="CORE" />
                <Text style={styles.lister}>
                  CORE
                </Text>
              </Pressable>
              <Pressable style={styles.listblack} onPress={danceModal}>
              <ActivityModel isModalVisible={danceVisible} toggleModal={() => setDanceVisible(false)} name="DANCE" />
                <Text style={styles.lister}>
                  DANCE
                </Text>
              </Pressable>
              <Pressable style={styles.listblack} onPress={ellipModal}>
               <ActivityModel isModalVisible={ellipVisible} toggleModal={() => setEllipVisible(false)} name="ELLIPTICAL" />
                <Text style={styles.lister}>
                  ELLIPTICAL
                </Text>
              </Pressable>

              <Pressable style={styles.listblack}onPress={flagModal}>
               <ActivityModel isModalVisible={flagVisible} toggleModal={() => setFlagVisible(false)} name="FLAG FOOTBALL GOLF" />
                <Text style={styles.lister}>
                  FLAG FOOTBALL GOLF
                </Text>
              </Pressable>
              <Pressable style={styles.listblack}onPress={golfModal}>
               <ActivityModel isModalVisible={golfVisible} toggleModal={() => setGolfVisible(false)} name="GOLF" />
                <Text style={styles.lister}>
                  GOLF
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  )
}

function NutritionAwareness() {
  return (
    <>
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: "10%" }}>
        <View style={styles.listView}>
          <ScrollView>
            <View style={{ margin: 20 }}>
              <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Text style={{ color: 'gray', fontSize: 20 }}>You don't have Activity NutritionAwareness</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  )
}
function Sports() {
  return (
    <>
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: "10%" }}>
        <View style={styles.listView}>
          <ScrollView>
            <View style={{ margin: 20 }}>
              <Pressable style={styles.listblack}>
                <Text style={styles.lister}>
                  Basketball
                </Text>
              </Pressable>
              <Pressable style={styles.listblack}>
                <Text style={styles.lister}>
                  Boxing
                </Text>
              </Pressable>
              <Pressable style={styles.listblack}>
                <Text style={styles.lister}>
                  Flage Football
                </Text>
              </Pressable>
              <Pressable style={styles.listblack}>
                <Text style={styles.lister}>
                  Golf
                </Text>
              </Pressable>
              <Pressable style={styles.listblack}>
                <Text style={styles.lister}>
                  Kicball
                </Text>
              </Pressable>
              <Pressable style={styles.listblack}>
                <Text style={styles.lister}>
                  Martial Arts
                </Text>
              </Pressable>
              <Pressable style={styles.listblack}>
                <Text style={styles.lister}>
                  Soccre
                </Text>
              </Pressable>
              <Pressable style={styles.listblack}>
                <Text style={styles.lister}>
                  Softball/Baseball
                </Text>
              </Pressable>
              <Pressable style={styles.listblack}>
                <Text style={styles.lister}>
                  Team Sport
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  )
}
function Lifestyle() {
  return (
    <>
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: "10%" }}>
        <View style={styles.listView}>
          <ScrollView>
            <View style={{ margin: 20 }}>
              <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Text style={{ color: 'gray', fontSize: 20 }}>You don't have Activity Lifestyle</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  )
}

function MentalStrength() {
  return (
    <>
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: "10%" }}>
        <View style={styles.listView}>
          <ScrollView>
            <View style={{ margin: 20 }}>
              <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Text style={{ color: 'gray', fontSize: 20 }}>You don't have Activity MentalStrength</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  )
}



const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height
const styles = StyleSheet.create({
  screen: {
    height: '100%',
  },
  content: {
    minHeight: 200,
  },

  honeycomb: {
    ...StyleSheet.absoluteFillObject,
  },

  card: {
    backgroundColor: 'white',
    marginHorizontal: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
    // shadow generator: https://ethercreative.github.io/react-native-shadow-generator/
    elevation: 3,         // shadow for android
    shadowColor: '#000',  // shadow for ios (incl. following styles)
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  firstCard: {
    marginTop: 200,
  },
  blackBGstyle: {
    marginRight: 20,
    backgroundColor: "#000",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 7.65,
    elevation: 15,
  },
  DailyView: {
    backgroundColor: '#3E3E3E',
    width: "60%",
    height: 100,
    borderRadius: 10,
  },
  mainDailyView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: "10%"
  },
  linearView: {
    margin: 20,
  },
  PressableView: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 50,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%'
  },
  pressViwe: {
    display: 'flex',
    flexDirection: 'row',
  },
  pressableButton: {
    width: 60,
    height: 47,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#fff",
    marginBottom: 5,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 10,
  },
  pressableText: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 8,
    margin: 5,
    fontWeight: '500',
  },

  listView: {
    backgroundColor: '#3E3E3E',
    width: (windowWidth / 100) * 100,
    height: (windowHeight / 100) * 50,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  listblack: {
    backgroundColor: 'black',
    width: "100%",
    height: 50,
    borderRadius: 8,
    shadowColor: "#fff",
    marginBottom: 15,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 10,
  },
  lister: {
    fontWeight: "500",
    color: "#0B82DC",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    shadowColor: "#000",
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    margin: 15,
    textTransform: 'uppercase',
  },

})
