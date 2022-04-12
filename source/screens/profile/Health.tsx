//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { reactive } from 'common/reactive'
import { Text, View, StyleSheet, Pressable, ToastAndroid } from 'react-native'
import { Ref } from 'reactronic'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { ObservableObject, transaction, Transaction } from 'reactronic'

import { App } from 'models/app/App'
import { InputBadge } from 'components/InputBadge'
import { Hexagon } from 'components/Hexagon/Hexagon'
import { CellCustomization } from 'components/Hexagon/HexagonProps'
import { Checkbox } from 'components/Checkbox'
import { RoundButton } from 'components/RoundButton'
import { DefaultHexGradient } from 'common/constants'
import { WeightManager } from 'models/app/WeightManager'
import { HeightManager } from 'models/app/HeightManager'
import { WheelPickerBadge } from 'components/WheelPickerBadge'
import { doAsync } from 'common/doAsync'

class HealthManager extends ObservableObject {
  panelExpanded: boolean

  constructor() {
    super()
    this.panelExpanded = false
  }

  @transaction
  togglePanelExpanded(): void {
    this.panelExpanded = !this.panelExpanded
  }
}

export const Health = (p: { onSubmit?: () => void }): React.ReactElement => {
  const [manager] = React.useState(() => Transaction.run(() => new HealthManager()))
  const [weight] = React.useState(() => Transaction.run(() => new WeightManager()))
  const [height] = React.useState(() => Transaction.run(() => new HeightManager()))

  return reactive(() => {
    const user = App.user
    const hais = user.hais
    const biomarker = Ref.to(user.editedBiomarker)
    const pressure = Ref.to(user.editedBiomarker.blood_pressure_obj)
    const panel = Ref.to(user.editedBiomarker.panel)

    // TODO: refresh hais
    const cells: CellCustomization[] = [{
      content: {
        h1: hais.sum.toFixed(2),
        h1size: 22,
        h2: 'HAIS',
        h2size: 17,
      },
      fitStroke: true,
      backgroundGradient: DefaultHexGradient,
    }]
    // const m = Ref.to(Manager)

    return (
      <View style={styles.container}>
        <View style={styles.main}>
          <View style={styles.badge}>
            <Hexagon
              columns={1}
              rows={1}
              textColor='white'
              cells={cells}
              stroke='lightgray'
              strokeWidth={5}
            />
          </View>
          <WheelPickerBadge
            manager={height}
            label='Height'
            labelBackgroundColor='white'
            icon='male'
            style={styles.input}
          />
          <WheelPickerBadge
            manager={weight}
            label='Weight'
            labelBackgroundColor='white'
            icon='weight'
            style={styles.input}
          />
          <InputBadge
            label='BMI'
            icon='people-arrows'
            labelBackgroundColor='white'
            model={biomarker.bmi}
            style={styles.input}
            keyboardType='number-pad'
          />
          <InputBadge
            label='V02 Max'
            icon='lungs'
            labelBackgroundColor='white'
            model={biomarker.v02_max}
            style={styles.input}
            keyboardType='number-pad'
          />
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Happiness Survey</Text>
            <Checkbox model={biomarker.happyness_index} style={styles.switch} />
          </View>
          <InputBadge
            label='Happiness'
            icon='laugh'
            labelBackgroundColor='white'
            editable={biomarker.happyness_index}
            model={biomarker.happyness_index}
            style={styles.input}
            keyboardType='number-pad'
          />
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Self Assessment</Text>
            <Checkbox model={biomarker.self_assessment} style={styles.switch} />
          </View>
          <InputBadge
            label='Self Assessment'
            icon='thumbs-up'
            labelBackgroundColor='white'
            editable={biomarker.self_assessment}
            model={biomarker.self_assessment}
            style={styles.input}
            keyboardType='number-pad'
          />
          <InputBadge
            label='Body Fat (%)'
            icon='burn'
            labelBackgroundColor='white'
            model={biomarker.body_fat}
            style={styles.input}
            keyboardType='number-pad'
          />
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Do you track your Nutrition?</Text>
            <Checkbox model={biomarker.nutrition_tracker_status} style={styles.switch} />
          </View>
          <InputBadge
            label='Nutrition Tracking (%)'
            icon='seedling'
            labelBackgroundColor='white'
            editable={biomarker.nutrition_tracker_status}
            model={biomarker.nutrition_tracker_value}
            style={styles.input}
            keyboardType='number-pad'
          />
          <InputBadge
            label='Blood Pressure (systolic)'
            icon='hand-holding-heart'
            labelBackgroundColor='white'
            model={pressure.systolic}
            style={styles.input}
            keyboardType='number-pad'
          />
          <InputBadge
            label='Blood Pressure (diastolic)'
            icon='hand-holding-heart'
            labelBackgroundColor='white'
            model={pressure.diastolic}
            style={styles.input}
            keyboardType='number-pad'
          />
          <InputBadge
            label='Resting Heart Rate'
            icon='heartbeat'
            labelBackgroundColor='white'
            model={biomarker.resting_heart_rate}
            style={styles.input}
            keyboardType='number-pad'
          />
          <InputBadge
            label='Waist Circumference (in inches)'
            icon='child'
            labelBackgroundColor='white'
            model={biomarker.waist_circumference}
            style={styles.input}
            keyboardType='number-pad'
          />
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Panel Complete</Text>
            <Checkbox model={biomarker.panel_completed} style={styles.switch} />
          </View>
        </View>
        <View style={styles.aux}>
          <Pressable
            style={styles.panel}
            onPress={() => manager.togglePanelExpanded()}
          >
            <Text style={styles.panelText}>Panel</Text>
            <Icon name={manager.panelExpanded ? 'chevron-down' : 'chevron-right'} size={12}></Icon>
          </Pressable>
          {manager.panelExpanded && (
            <View style={styles.panelContent}>
              <InputBadge
                label='LDL'
                icon='heartbeat'
                labelBackgroundColor='white'
                editable={biomarker.panel_completed}
                model={panel.ldl}
                style={styles.input}
                keyboardType='number-pad'
              />
              <InputBadge
                label='HDL'
                icon='heartbeat'
                labelBackgroundColor='white'
                editable={biomarker.panel_completed}
                model={panel.hdl}
                style={styles.input}
                keyboardType='number-pad'
              />
              <InputBadge
                label='Cholesterol'
                icon='heartbeat'
                labelBackgroundColor='white'
                editable={biomarker.panel_completed}
                model={panel.cholesterol}
                style={styles.input}
                keyboardType='number-pad'
              />
              <InputBadge
                label='Hba1c'
                icon='hand-holding-heart'
                labelBackgroundColor='white'
                editable={biomarker.panel_completed}
                model={panel.hba1c}
                style={styles.input}
                keyboardType='number-pad'
              />
              <InputBadge
                label='Triglycerides'
                icon='burn'
                labelBackgroundColor='white'
                editable={biomarker.panel_completed}
                model={panel.triglycerides}
                style={styles.input}
                keyboardType='number-pad'
              />
            </View>
          )}
        </View>
        <View style={styles.submit}>
          <RoundButton
            color='white'
            background='#0096E5'
            label='Submit'
            style={styles.button}
            onPress={() => doAsync(async () => {
              await user.saveBiomarkerChanges()
              await user.updateFilledPercentage()
              ToastAndroid.show('Your Health data was successfully updated', ToastAndroid.SHORT)
              p.onSubmit && p.onSubmit()
            })}
          />
        </View>
      </View>
    )
  })
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  main: {
    width: '100%',
    alignItems: 'stretch',
    position: 'relative',
    padding: 15,
    paddingBottom: 0,
  },
  aux: {
    width: '100%',
  },
  badge: {
    width: '40%',
    marginTop: 5,
    marginBottom: 10,
    alignSelf: 'center',
  },
  input: {
    marginVertical: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchLabel: {
    flex: 1,
    textAlign: 'left',
  },
  switch: {
    marginHorizontal: -10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#59cbf5',
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  panel: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#e0dde0',
  },
  panelText: {
    flex: 1,
    textAlign: 'left',
  },
  panelContent: {
    paddingHorizontal: 15,
  },
  submit: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '25%',
  },
})
