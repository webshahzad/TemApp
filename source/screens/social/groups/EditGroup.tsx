//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackPropsPerPath } from 'navigation/params'
import GroupImage from 'assets/images/grp-image/grp-image.png'
import TaskImage from 'assets/icons/TaskStroke/TaskStroke.png'
import ActImage from 'assets/icons/act/act.png'
import { ScrollView } from 'react-native-gesture-handler'
import AImage from 'react-native-autosize-image'
import { InputBadge } from 'components/InputBadge'
import { MultiplePickerBadge } from 'components/MultiplePickerBadge'
import { App } from 'models/app/App'
import { Ref } from 'reactronic'
import { Interest } from 'models/data/Interest'
import { reactive } from 'common/reactive'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { Api } from 'models/app/Api'
import { GrayColor, MainBlueColor } from 'components/Theme'
import { RoundButton } from 'components/RoundButton'
import { Checkbox } from 'components/Checkbox'
import { PressableBadge } from 'components/PressableBadge'
import AvatarImage from 'assets/icons/avatar/avatar.png'

export function EditGroup(p: StackScreenProps<RootStackPropsPerPath, 'EditGroup'>): React.ReactElement {
  return reactive(() => {
    const editGroup = App.social.editGroup
    return (
      <SafeAreaView style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.imageContainer}>
            <Pressable onPress={() => editGroup.selectImage()}>
              <Image source={editGroup.imageUri ? { uri: editGroup.imageUri } : GroupImage} style={styles.image} />
            </Pressable>
          </View>

          <InputBadge
            label='Name'
            icon={TaskImage}
            style={styles.input}
            model={Ref.to(editGroup).name}
            error='Please enter the name of your tēm'
            showError={Ref.to(editGroup).showNameValidationError}
          />
          <InputBadge
            label='Description'
            icon={TaskImage}
            style={styles.input}
            model={Ref.to(editGroup).description}
          />
          {App.interests.all.length > 0 && (
            <MultiplePickerBadge
              label='Interests'
              icon={ActImage}
              options={App.interests.all}
              model={Ref.to(App.interests).selected}
              renderPickerItem={renderInterest}
              renderSelectedItems={renderSelectedInterests}
              getKey={Interest.getKey}
              style={styles.input}
            />
          )}
          {editGroup.adminId === App.user.id ? (
            <>
              <PressableBadge
                label='Visibility'
                icon={AvatarImage}
                style={styles.input}
                onPress={editGroup.showVisibilitySelection}
                error='Please select visibility'
                text={Ref.to(editGroup).formattedVisibility}
              />
              {editGroup.editableByMembers !== undefined ? (
                <>
                  <View style={styles.toggle}>
                    <Text style={styles.toggleLabel}>Allow Members to Edit Group</Text>
                    <Checkbox model={Ref.to(editGroup).editableByMembers} />
                  </View>
                  <Text style={styles.toggleDescription}>
                    (when enabled, all members will be able to add/remove group members, change group name,
                    description, interests and avatar)
                  </Text>
                </>
              ) : null}
            </>
          ) : null}

          <RoundButton
            label='Update'
            background={MainBlueColor}
            color='white'
            style={styles.button}
            onPress={async () => {
              const id = await editGroup.submit()
              if (id) {
                await App.social.chatList.load() // workaround
                p.navigation.goBack()
              }
            }}
          />
        </ScrollView>
      </SafeAreaView>
    )
  })
}

function renderInterest(item: Interest, _: number, active: boolean): React.ReactElement {
  return (
    <View style={styles.interest}>
      <View style={styles.interestContent}>
        <AImage source={{ uri: Api.serverUrl + item.icon }} tintColor='black' mainAxisSize={25} style={styles.interestIcon} />
        <Text style={styles.interestLabel}>{item.name}</Text>
      </View>
      {active ? (
        <Icon name='check' color='#0096E5' size={16} />
      ) : null}
    </View>
  )
}

function renderSelectedInterests(interests: Interest[], active: boolean): React.ReactElement {
  return (
    <View style={styles.interestsPicker}>
      <Text style={styles.interestsPickerLabel} numberOfLines={1}>
        {interests.map((interest, index) => `${index !== 0 ? ', ' : ''}${interest.name}`)}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    height: '100%',
  },
  content: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },

  imageContainer: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  image: {
    height: 120,
    width: 120,
    borderRadius: 1000,
  },
  input: {
    marginBottom: 10,
  },

  interest: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: GrayColor,
    borderBottomWidth: 1,
  },
  interestContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interestIcon: {
    marginVertical: 7,
  },
  interestLabel: {
    fontSize: 16,
    marginLeft: 10,
  },
  interestsPicker: {
  },
  interestsPickerLabel: {
  },

  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontWeight: 'bold',
  },
  toggleDescription: {
    fontSize: 12,
    marginBottom: 20,
  },

  button: {
    marginTop: 10,
  },
})
