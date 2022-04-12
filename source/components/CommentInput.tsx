//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { Text, StyleSheet, ViewStyle, TextStyle, View, Image, ImageStyle, ImageSourcePropType, Dimensions } from 'react-native'
import { TextInput, TouchableNativeFeedback } from 'react-native-gesture-handler'

import { Transaction } from 'reactronic'
import { reactive } from 'common/reactive'
import { Ref } from 'reactronic'
import { Neomorph } from 'react-native-neomorph-shadows'

export interface CommentInputProps {
  style?: ViewStyle,
  model: Ref<string>
  userAvatar: ImageSourcePropType
  onPost: (text: string) => void
}

export function CommentInput(p: CommentInputProps): JSX.Element {
  const windowWidth = Dimensions.get("window").width;
  return reactive(() => {
    const hasText: boolean = (p.model.value !== undefined) && (p.model.value.trim() !== '')
    return (
      <View style={[styles.container, p.style]}>
        <View style={styles.authorAvatarContainer}>
          <Image source={p.userAvatar} style={styles.authorAvatar} />
        </View>
        <Neomorph  inner // <- enable shadow inside of neomorph
      style={{
        shadowRadius: 1,
        borderRadius: 20,
        marginLeft: 10,
        shadowColor: "#000",
        shadowOffset: { width: 4, height: 4 },
        elevation: 2,
        backgroundColor: "#F7F7F7",
        width: (windowWidth / 100) * 80,
        height: (windowWidth / 100) * 10,
      }}>
        <View style={{display: 'flex', flexDirection: 'row'}}>
        <View style={styles.inputContainer}>
          <TextInput
            multiline
            textAlignVertical='center'
            placeholder='comment...'
            style={styles.input}
            defaultValue={p.model.value}
            onChangeText={value => {
              Transaction.run(() => {
                p.model.value = value
              })
            }}
          />
        </View>
        <View style={styles.postButtonContainer}>
          <TouchableNativeFeedback
            style={styles.postButton}
            onPress={() => {
              if (hasText)
                p.onPost(p.model.value)
            }}
          >
            
            <Text
              style={
                hasText
                  ? styles.postButtonText
                  : styles.postButtonTextDisabled
              }
            >
              Post
            </Text>
          </TouchableNativeFeedback>
        </View>
        </View>
      </Neomorph>
       
       
      </View>
    )
  })
}

export const UserAvatarSize: number = 35

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
  } as ViewStyle,
  authorAvatarContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
  } as ViewStyle,
  authorAvatar: {
    height: UserAvatarSize,
    width: UserAvatarSize,
    borderRadius: UserAvatarSize / 2,
    marginTop: 2,
  } as ImageStyle,
  inputContainer: {
    marginLeft: 10,
    flex: 1,
    paddingVertical: 5,
    paddingLeft: 15,
  } as ViewStyle,
  input: {
    padding: 0,
    margin: 0,
  } as TextStyle,
  postButtonContainer: {
    justifyContent: 'flex-end',
    paddingVertical: 5,
  } as ViewStyle,
  postButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  } as ViewStyle,
  postButtonTextDisabled: {
    color: 'lightblue',
  } as TextStyle,
  postButtonText: {
    color: '#0A6AD0',
  } as TextStyle,
})
