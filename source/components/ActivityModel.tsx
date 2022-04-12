import React,{useState} from 'react'
import Modal from "react-native-modal"
import CircularProgress from "components/CircularProgress"
import Icon from "react-native-vector-icons/Ionicons";
import { View, Pressable, Text, TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native';

export interface IModel {
    isModalVisible: boolean
    toggleModal: (e: GestureResponderEvent) => void | (() => void)
    name: string
}
export function ActivityModel(p: IModel): JSX.Element {
    
    return (
        <Modal
            onBackButtonPress={p.toggleModal}
            onBackdropPress={p.toggleModal}
            style={styles.modal}
            isVisible={p.isModalVisible}>
            <View style={styles.modalView}>
                <Pressable onPress={p.toggleModal} style={{ alignSelf: "flex-end" }} >
                    <Icon name="close" style={styles.goback_X} /></Pressable>
                <Text style={{ color: '#08FCF6', fontSize: 55, }}>{p.name}</Text>
                <TouchableOpacity style={styles.StartTouchable}>
                    <Text style={styles.StartText}>START</Text>
                    <CircularProgress
                        barWidth={2}
                        trailColor="#C7D3CA"
                        fill={10}
                        strokeColor="#0BF9F3"
                        radius={45}
                        styles={{
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: 10,
                            transform: [{ rotate: "-190deg" }],
                        }}
                    ></CircularProgress>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {

        borderRadius: 10,
        // height: "30%",
        width: '90%',
        backgroundColor: "#3E3E3E",
        position: 'absolute',
        bottom: 25,
    },
    modalView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    StartTouchable: {
        marginBottom: 10,
        backgroundColor: "#000",
        width: 100,
        height: 100,
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
        fontSize: 16,
        color: "#fff",
        position: "absolute",
        top: 40,
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        // marginLeft: 8,
        borderColor: "#FFFFFF",
        fontWeight: "500",
        textShadowColor: "rgba(0,0,0,0.5)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        shadowColor: "#000",
    },
    goback_X: {
        fontSize: 16,
        color: "#08FCF6",
        fontWeight: "500",
        textShadowColor: "rgba(0,0,0,0.5)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        shadowColor: "#000",
        paddingTop: 10,
        paddingRight: 10,
        paddingLeft: 20,
        paddingBottom: 20
    }
})
