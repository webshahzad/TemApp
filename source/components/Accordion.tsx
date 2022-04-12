//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { reactive } from 'common/reactive'
import { View, StyleSheet, Pressable, Text } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'

import { AccordionManager } from 'models/app/AccordionManager'
import { GrayColor, MainBlueColor } from 'components/Theme'

export interface AccordionProps {
  manager: AccordionManager
}

export function Accordion(p: AccordionProps): React.ReactElement {
  return reactive(() => {
    return (
      <View style={styles.container}>
        {p.manager.sections.map((section, index) => {
          const expanded = index === p.manager.expandedSection
          return (
            <View key={section.name} style={styles.section}>
              <Pressable
                style={styles.header}
                onPress={() => p.manager.toggle(index)}
              >
                <Text style={[styles.headerText, expanded ? styles.expanded : undefined]}>{section.name}</Text>
                <Icon name={expanded ? 'chevron-down' : 'chevron-right'} size={12} style={styles.arrow}></Icon>
              </Pressable>
              {expanded && (
                <View style={styles.content}>
                  {section.content}
                </View>
              )}
            </View>
          )
        })}
      </View>
    )
  })
}

const Padding = 15

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  section: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: GrayColor,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    padding: Padding,
  },
  headerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  arrow: {
    paddingHorizontal: 5,
  },
  expanded: {
    color: MainBlueColor,
  },
  content: {
    width: '100%',
    paddingHorizontal: Padding,
    paddingBottom: Padding,
  },
})
