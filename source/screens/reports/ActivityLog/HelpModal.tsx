//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { PropsWithChildren } from 'react'
import { ObservableObject, transaction } from 'reactronic'
import Modal from 'react-native-modal'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { reactive } from 'common/reactive'
import ScoreGraphImage from 'assets/images/scoregraph.png'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export function HelpModal({ children, manager }: PropsWithChildren<{ manager: HelpModalManager }>): React.ReactElement {
  return reactive(() => {
    return (
      <Modal
        isVisible={manager.visible}
        style={styles.modal}
        onBackButtonPress={manager.hideModal}
        onBackdropPress={manager.hideModal}
        propagateSwipe
        useNativeDriver
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.header}>Activity score</Text>
          <Text style={styles.description}>
            TĒM assesses data from your daily workouts and healthy behaviors
            and translates that data into a simple score, the Activity Score.
          </Text>
          <Image source={ScoreGraphImage} style={styles.image} />
          <View style={styles.table}>
            <View style={styles.column}>
              <Text style={styles.columnHeader}>Calibration period</Text>
              <Text style={styles.columnContent}>
                During the calibration period (typically the first 30 days
                depending on consistency) you will see vast fluctuations in
                your score. This is normal as TĒM begins to understand your
                behaviors. Physical Activity and Health Biomarkers are the
                main drivers during this period. Nutrition plays a smaller
                role in calibration.
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.columnHeader}>Management period</Text>
              <Text style={styles.columnContent}>
                During the management period you will begin to see smaller
                but more impactful changes in your score. Day 31 and beyond
                is when you have established your baseline and the app and
                TĒMai will help you manage and improve your score. With an
                understanding of your physical activity and accountability index,
                nutrition will take focus to help balance out your behavioral
                health and maximize its impact on your total health and HAIS.
              </Text>
            </View>
          </View>
        </ScrollView>

        <Icon
          name='close-circle'
          style={styles.closeButton}
          color='grey'
          size={25}
          onPress={manager.hideModal}
        />
      </Modal>
    )
  })
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 25,
    overflow: 'hidden',
  },
  content: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  header: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  image: {
    resizeMode: 'contain',
    width: '100%',
  },

  table: {
    width: '100%',
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    paddingHorizontal: 5,
  },
  columnHeader: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  columnContent: {
  },
})

export class HelpModalManager extends ObservableObject {
  visible: boolean = false

  @transaction
  showModal(): void {
    this.visible = true
  }

  @transaction
  hideModal(): void {
    this.visible = false
  }
}
