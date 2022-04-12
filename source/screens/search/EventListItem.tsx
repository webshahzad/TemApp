//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { reactive } from 'common/reactive'
import { EventInfo, EventType } from 'models/data/EventInfo'
import { loadAndShowEventDetails } from 'screens/calendar/Events'
import { formatFullDateTime } from 'models/app/Calendar/EventEditor'
import ActivityIcon from 'assets/icons/act/act.png'
import TaskStrokeImage from 'assets/icons/TaskStroke/TaskStroke.png'

export function EventListItem({ event }: { event: EventInfo }): React.ReactElement {

  return reactive(() => {
    const title = event.title
    const icon = event.eventType === EventType.SignupSheet
      ? TaskStrokeImage
      : ActivityIcon
    return (
      <Pressable
        style={styles.event}
        onPress={async () => {
          void loadAndShowEventDetails(event._id!)
        }}
      >
        <Image source={icon} style={styles.icon} />
        <View style={styles.titleAndDate}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>
            {title}
          </Text>
          <View style={styles.details}>
            <View style={styles.dateDetails}>
              <View style={styles.dateTitles}>
                <Text style={styles.dateValue}>Start</Text>
                <Text style={styles.dateValue}>End</Text>
              </View>
              <View style={styles.dateValues}>
                <Text style={styles.dateValue}>{formatFullDateTime(event.getStartDate())}</Text>
                <Text style={styles.dateValue}>{formatFullDateTime(event.getEndDate())}</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    )
  })
}

const styles = StyleSheet.create({
  event: {
    backgroundColor: 'white',
    padding: 10,
    flexDirection: 'row',
  },
  icon: {
    resizeMode: 'contain',
    height: '100%',
    width: 30,
  },
  titleAndDate: {
    marginLeft: 10,
    flex: 1,
  },
  title: {
    width: '100%',
  },
  details: {},
  dateDetails: {
    flexDirection: 'row',
  },
  dateTitles: {},
  dateValues: {
    marginLeft: 5,
  },
  dateValue: {
    fontSize: 12,
    color: 'gray',
  },
})
