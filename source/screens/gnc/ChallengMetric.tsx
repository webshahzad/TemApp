//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { reactive } from 'common/reactive';
import { App } from 'models/app/App';
import React, { useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, GestureResponderEvent, Alert, Pressable } from 'react-native'
import { Transaction } from 'reactronic';
import Icon from "react-native-vector-icons/Ionicons";
import CircularProgress from "../../components/CircularProgress"
export interface Hexaprops {
    HexaonPress: (e: GestureResponderEvent) => void;
    ishexagon: boolean;
}
function ChallengMetric(p: Hexaprops) {
    return reactive(() => {

        return (
            <>
                <View style={styles.Cross}  >
                    <Icon name="close" onPress={() => { Transaction.run(() => App.user.metricDrawer = false) }
                    } style={styles.goback_X} />
                </View>
                <View>
                    <Text style={styles.choose}>CHALLENGE</Text>
                    <Text style={styles.Matric}>Choose your Metrics(</Text>
                    <Text style={styles.Select}>Select that all apply)</Text>
                </View>

                <View style={styles.Matricmain}>
                    <TouchableOpacity style={styles.MatricView}>
                        <View style={styles.matricLeft}>
                            <Text style={{ fontSize: 18 }}>TOTAL EFFORT</Text>
                            <Text style={{ fontSize: 12 }}>ALL METRICS</Text>
                        </View>
                        <View style={styles.hexaRight}>
                            <TouchableOpacity onPress={p.HexaonPress}>
                                {p.ishexagon ?
                                    <View style={styles.hexagon}>
                                        <View style={styles.hexagonInner}><Text style={{
                                            fontSize: 9, color: '#fff', fontWeight: 'bold', textShadowColor: "rgba(0,0,0,0.5)",
                                            textShadowOffset: { width: -1, height: -1 },
                                            textShadowRadius: 5,
                                            shadowColor: "#fff",
                                        }}>ADDED</Text></View>
                                        <View style={styles.hexagonBefore} />
                                        <View style={styles.hexagonAfter} />
                                    </View>
                                    :
                                    <View style={styles.hexagon1}>
                                        <View style={styles.hexagonInner1}><Text style={{
                                            fontSize: 9, color: '#fff', fontWeight: 'bold', textShadowColor: "rgba(0,0,0,0.5)",
                                            textShadowOffset: { width: -1, height: -1 },
                                            textShadowRadius: 5,
                                            shadowColor: "#fff",
                                        }}>+ ADD</Text></View>
                                        <View style={styles.hexagonBefore1} />
                                        <View style={styles.hexagonAfter1} />
                                    </View>
                                }
                            </TouchableOpacity>

                        </View>
                    </TouchableOpacity>


                    <TouchableOpacity style={styles.MatricView}>
                        <View style={styles.matricLeft}>
                            <Text style={{ fontSize: 18 }}>MAX DISTANCE</Text>
                            
                        </View>
                        <View style={styles.hexaRight}>
                            <TouchableOpacity onPress={p.HexaonPress}>
                                {p.ishexagon ?
                                    <View style={styles.hexagon}>
                                        <View style={styles.hexagonInner}><Text style={{
                                            fontSize: 9, color: '#fff', fontWeight: 'bold', textShadowColor: "rgba(0,0,0,0.5)",
                                            textShadowOffset: { width: -1, height: -1 },
                                            textShadowRadius: 5,
                                            shadowColor: "#fff",
                                        }}>ADDED</Text></View>
                                        <View style={styles.hexagonBefore} />
                                        <View style={styles.hexagonAfter} />
                                    </View>
                                    :
                                    <View style={styles.hexagon1}>
                                        <View style={styles.hexagonInner1}><Text style={{
                                            fontSize: 9, color: '#fff', fontWeight: 'bold', textShadowColor: "rgba(0,0,0,0.5)",
                                            textShadowOffset: { width: -1, height: -1 },
                                            textShadowRadius: 5,
                                            shadowColor: "#fff",
                                        }}>+ ADD</Text></View>
                                        <View style={styles.hexagonBefore1} />
                                        <View style={styles.hexagonAfter1} />
                                    </View>
                                }
                            </TouchableOpacity>

                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.MatricView}>
                        <View style={styles.matricLeft}>
                            <Text style={{ fontSize: 18 }}>MAX CALORIES</Text>
                        </View>
                        <View style={styles.hexaRight}>
                            <TouchableOpacity onPress={p.HexaonPress}>
                                {p.ishexagon ?
                                    <View style={styles.hexagon}>
                                        <View style={styles.hexagonInner}><Text style={{
                                            fontSize: 9, color: '#fff', fontWeight: 'bold', textShadowColor: "rgba(0,0,0,0.5)",
                                            textShadowOffset: { width: -1, height: -1 },
                                            textShadowRadius: 5,
                                            shadowColor: "#fff",
                                        }}>ADDED</Text></View>
                                        <View style={styles.hexagonBefore} />
                                        <View style={styles.hexagonAfter} />
                                    </View>
                                    :
                                    <View style={styles.hexagon1}>
                                        <View style={styles.hexagonInner1}><Text style={{
                                            fontSize: 9, color: '#fff', fontWeight: 'bold', textShadowColor: "rgba(0,0,0,0.5)",
                                            textShadowOffset: { width: -1, height: -1 },
                                            textShadowRadius: 5,
                                            shadowColor: "#fff",
                                        }}>+ ADD</Text></View>
                                        <View style={styles.hexagonBefore1} />
                                        <View style={styles.hexagonAfter1} />
                                    </View>
                                }
                            </TouchableOpacity>

                        </View>
                    </TouchableOpacity>


                    <TouchableOpacity style={styles.MatricView}>
                        <View style={styles.matricLeft}>
                            <Text style={{ fontSize: 18 }}>TOTAL ACTIVITES</Text>
                       
                        </View>
                        <View style={styles.hexaRight}>
                            <TouchableOpacity onPress={p.HexaonPress}>
                                {p.ishexagon ?
                                    <View style={styles.hexagon}>
                                        <View style={styles.hexagonInner}><Text style={{
                                            fontSize: 9, color: '#fff', fontWeight: 'bold', textShadowColor: "rgba(0,0,0,0.5)",
                                            textShadowOffset: { width: -1, height: -1 },
                                            textShadowRadius: 5,
                                            shadowColor: "#fff",
                                        }}>ADDED</Text></View>
                                        <View style={styles.hexagonBefore} />
                                        <View style={styles.hexagonAfter} />
                                    </View>
                                    :
                                    <View style={styles.hexagon1}>
                                        <View style={styles.hexagonInner1}><Text style={{
                                            fontSize: 9, color: '#fff', fontWeight: 'bold', textShadowColor: "rgba(0,0,0,0.5)",
                                            textShadowOffset: { width: -1, height: -1 },
                                            textShadowRadius: 5,
                                            shadowColor: "#fff",
                                        }}>+ ADD</Text></View>
                                        <View style={styles.hexagonBefore1} />
                                        <View style={styles.hexagonAfter1} />
                                    </View>
                                }
                            </TouchableOpacity>

                        </View>
                    </TouchableOpacity>


                    <TouchableOpacity style={styles.MatricView}>
                        <View style={styles.matricLeft}>
                            <Text style={{ fontSize: 18 }}>TOTAL TIME</Text>
                        </View>
                        <View style={styles.hexaRight}>
                            <TouchableOpacity onPress={p.HexaonPress}>
                                {p.ishexagon ?
                                    <View style={styles.hexagon}>
                                        <View style={styles.hexagonInner}><Text style={{
                                            fontSize: 9, color: '#fff', fontWeight: 'bold', textShadowColor: "rgba(0,0,0,0.5)",
                                            textShadowOffset: { width: -1, height: -1 },
                                            textShadowRadius: 5,
                                            shadowColor: "#fff",
                                        }}>ADDED</Text></View>
                                        <View style={styles.hexagonBefore} />
                                        <View style={styles.hexagonAfter} />
                                    </View>
                                    :
                                    <View style={styles.hexagon1}>
                                        <View style={styles.hexagonInner1}><Text style={{
                                            fontSize: 9, color: '#fff', fontWeight: 'bold', textShadowColor: "rgba(0,0,0,0.5)",
                                            textShadowOffset: { width: -1, height: -1 },
                                            textShadowRadius: 5,
                                            shadowColor: "#fff",
                                        }}>+ ADD</Text></View>
                                        <View style={styles.hexagonBefore1} />
                                        <View style={styles.hexagonAfter1} />
                                    </View>
                                }
                            </TouchableOpacity>

                        </View>
                    </TouchableOpacity>

                    

                    <View style={styles.modalView}>
                        <TouchableOpacity style={styles.StartTouchable}>
                            <Text style={styles.StartText}>SAVE</Text>
                            <CircularProgress
                                barWidth={4}
                                trailColor="#C7D3CA"
                                fill={40}
                                strokeColor="#0BF9F3"
                                radius={27}
                                styles={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginBottom: 8,
                                    transform: [{ rotate: "-190deg" }],
                                }}>
                            </CircularProgress>
                        </TouchableOpacity>
                    </View>
                </View>
            </>

        )
    })
}
export default ChallengMetric;

const styles = StyleSheet.create({
    hexagon1: {
        width: 100,
        height: 25,
        marginTop: 5,
        position: 'absolute',
        right: -50,
        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    hexagonInner1: {
        width: 48,
        height: 25.50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0B82DC'
    },
    hexagonAfter1: {
        position: 'absolute',
        bottom: -15,
        left: 0,
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderLeftWidth: 24,
        borderLeftColor: 'transparent',
        borderRightWidth: 24,
        borderRightColor: 'transparent',
        borderTopWidth: 15,
        borderTopColor: '#0B82DC'
    },
    hexagonBefore1: {
        position: 'absolute',
        top: -15,
        left: 0,
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderLeftWidth: 24,
        borderLeftColor: 'transparent',
        borderRightWidth: 24,
        borderRightColor: 'transparent',
        borderBottomWidth: 15,
        borderBottomColor: '#0B82DC'

    },

    hexagon: {
        width: 100,
        height: 25,
        marginTop: 5,
        position: 'absolute',
        right: -50,
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#08E5DF'
    },
    hexagonAfter: {
        position: 'absolute',
        bottom: -15,
        left: 0,
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderLeftWidth: 24,
        borderLeftColor: 'transparent',
        borderRightWidth: 24,
        borderRightColor: 'transparent',
        borderTopWidth: 15,
        borderTopColor: '#08E5DF'
    },
    hexagonBefore: {
        position: 'absolute',
        top: -15,
        left: 0,
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderLeftWidth: 24,
        borderLeftColor: 'transparent',
        borderRightWidth: 24,
        borderRightColor: 'transparent',
        borderBottomWidth: 15,
        borderBottomColor: '#08E5DF'

    },
    choose: {
        fontSize: 12,
        color: "#0B82DC",
        fontWeight: "bold",
        textAlign: "center",
        paddingBottom: 5
    },
    Matric: {
        fontSize: 12,
        color: "#0B82DC",
        textAlign: 'center',
        paddingTop: 10
    },
    Select: {
        fontSize: 12,
        color: "#0B82DC",
        textAlign: 'center',
        paddingBottom: 20
    },
    // border: {
    //     borderBottomColor: "#f7f7f7",
    //     borderBottomWidth: 5,
    //     width: "100%",
    // },
    MatricView: {
        flexDirection: "row",
        justifyContent: 'space-between',
        backgroundColor: "#f7f7f7",
        borderRadius: 5,
        // padding: 10,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        marginRight: 10,
        marginLeft: 10,
        marginBottom: 20,
        height: 60
    },
    Matricmain: {
        paddingTop: 40,
        borderTopColor:"#f7f7f7",
        borderTopWidth:5
    },
    hexaRight: {
        paddingLeft: 60,
        justifyContent: "space-between"
    },
    matricLeft: {
        marginRight: 90,
        justifyContent: 'center'
    },
    StartTouchable: {
        marginBottom: 10,
        backgroundColor: "#fff",
        width: 70,
        height: 70,
        borderRadius: 50,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.29,
        shadowRadius: 5.65,
        elevation: 2,
    },
    StartText: {
        fontSize: 10,
        color: "#0B82DC",
        position: "absolute",
        top: 29,
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        borderColor: "#FFFFFF",
        fontWeight: "500",
        textShadowColor: "rgba(0,0,0,0.5)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        shadowColor: "#000",
    },
    modalView: {
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    goback_X: {
        fontSize: 18,
        color: "#0B82DC",
        fontWeight: "500",
        textShadowColor: "rgba(0,0,0,0.5)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        shadowColor: "#000",
        // position:'absolute',
        // top:0,
        // left:20
    },
    Cross: {
        textAlign: 'left',
        // backgroundColor:"red",
        padding: 10,
        position: 'absolute',
        left: 0
    }
})
