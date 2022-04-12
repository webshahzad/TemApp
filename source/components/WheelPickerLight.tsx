//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { reactive } from 'common/reactive'
import { Pressable, StyleSheet, View, Text, Alert } from 'react-native'
import Modal from 'react-native-modal'
import { WheelPicker } from 'react-native-wheel-picker-android'
import { Ref } from 'reactronic'
import { PressableBadgeProps } from './PressableBadge'
import { WheelPickerManager } from 'models/app/WheelPickerManager'
import { MainBlueColor } from 'components/Theme'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { InputBadge } from './InputBadge'
import Icon from "react-native-vector-icons/MaterialIcons";
import { App } from "models/app/App";

interface WheelPickerBadgeProps extends PressableBadgeProps {
  manager: WheelPickerManager,
  
}

export function WheelPickerProfile(p: WheelPickerBadgeProps): React.ReactElement {
  const manager = p.manager
  const hideModal = (): void => {
    manager.setVisible(false)
  }
  const save = (): void => {
    const result = manager.wheels.map(wheel => wheel.data[wheel.selectedIndex])
    const indexes = manager.wheels.map(wheel => wheel.selectedIndex)
    manager.onSave(result, indexes)
    hideModal()
  }
  const wheelWidth = Math.floor(100 / manager.wheels.length)

  return reactive(() => {
    const m = Ref.to(p.manager)
   
    return (
      <>
      <TouchableOpacity onPress={() => manager.setVisible(true)}>
        <View style={{backgroundColor: '#ffff', height: 35, marginBottom: 25, maxWidth: "100%" ,borderRadius: 45,justifyContent: 'center',marginHorizontal: 25}}>
              
               <Text style={{position:'absolute', top: 10,left:15,fontSize: 10,color: "grey"}}>{p.label}</Text>
               <Text style={{color: 'black', position: 'absolute', top: 10 ,left: 53,fontSize:12}}>{m.text.owner.text}</Text>
          </View>
       
              </TouchableOpacity>
        {/* <PressableBadge
          {...p}
          text={m.text}
          
        /> */}
        <Modal
          
          style={styles.modal}
          isVisible={manager.visible}
          onBackButtonPress={hideModal}
          onBackdropPress={hideModal}          
          propagateSwipe
          useNativeDriver
          
        >
          <View style={styles.modalContent}>
            <View style={styles.buttons}>
              <Pressable
                style={[styles.button, styles.cancel]}
                onPress={hideModal}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.done]}
                onPress={save}
              >
                <Text style={styles.buttonText}>Done</Text>
              </Pressable>
            </View>
            <View style={styles.pickers}>
              {manager.wheels.map((wheel, index) => {
                const data = wheel.data.slice() // to avoid weird WheelPicker undefined crash
                return (
                  <View
                    key={`${index}_${wheel.data[0]}`}
                    style={[styles.container, {width: `${wheelWidth}%`}]}
                  >
                    <WheelPicker
                      selectedItemTextFontFamily='Arial'
                      itemTextFontFamily='Arial'
                      selectedItem={wheel.selectedIndex}
                      data={data}
                       
                      onItemSelected={index =>{
                        
                         wheel.setSelectedIndex(index)}
                        }
                    />
                  </View>
                )
              })}
               
            </View>
          </View>
        </Modal>
      </>
    )
  })
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    maxHeight: '80%',
  },
  buttons: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: '50%',
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    textTransform: 'uppercase',
    color: 'white',
  },
  cancel: {
    backgroundColor: 'grey',
  },
  done: {
    backgroundColor: MainBlueColor,
  },
  pickers: {
    width: '100%',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
})
