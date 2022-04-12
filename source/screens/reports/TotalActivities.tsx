//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useCallback, useEffect } from 'react'
import { createDrawerNavigator, DrawerScreenProps, useIsDrawerOpen } from '@react-navigation/drawer'
import { View, Text, Alert, StyleSheet, Image, Pressable, ColorValue, ToastAndroid } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SwipeListView } from 'react-native-swipe-list-view'
import { DrawerActions, useFocusEffect } from '@react-navigation/native'
import { StackScreenProps, HeaderTitle, createStackNavigator } from '@react-navigation/stack'
import { ReportsStackPropsPerPath, EmptyProps } from 'navigation/params'
import AutosizeImage from 'react-native-autosize-image'
import { Hexagon } from 'components/Hexagon/Hexagon'
import { GoodHexGradient, BadHexGradient, DefaultHexGradient } from 'common/constants'
import { reactive } from 'common/reactive'
import { App } from 'models/app/App'
import { ReportFlag } from 'models/data/UserReport'
import { MainBlueColor, Theme, TransparentHeaderOptions } from 'components/Theme'
import { Monitors } from 'models/app/Monitors'
import { ActivitySummary } from 'models/data/Activity'
import { TotalActivitiesSideMenu } from './TotalActivitiesSideMenu'
import { ActivityResults } from 'screens/activity/ActivityResults'
import { ActivityResultsProps } from 'screens/activity/ActivityResultsProps'
import { doAsync } from 'common/doAsync'

import UpImage from 'assets/images/dashboard/up.png'
import FilterIcon from 'assets/icons/filter/filter.png'
import { ActivityOrigin } from 'models/app/Fit/ActivityOrigin'

type LocalDrawerPropsPerPath = {
  LocalStack: EmptyProps
}

const Drawer = createDrawerNavigator<LocalDrawerPropsPerPath>()

const TotalActivitiesRouteName = 'TotalActivities'

export function TotalActivitiesWithSideMenu(p: StackScreenProps<ReportsStackPropsPerPath, 'TotalActivities'>): JSX.Element {
  return (
    <Drawer.Navigator
      drawerType='front'
      drawerPosition='right'
      drawerContent={() => (
        <TotalActivitiesSideMenu />
      )}
    >
      <Drawer.Screen
        name='LocalStack'
        component={LocalStack}
        options={{
          swipeEnabled: false,
        }}
      />
    </Drawer.Navigator >
  )
}

type LocalStackPropsPerPath = {
  TotalActivities: EmptyProps
  ActivityResults: ActivityResultsProps
}

const Stack = createStackNavigator<LocalStackPropsPerPath>()

function LocalStack(p: DrawerScreenProps<LocalDrawerPropsPerPath, 'LocalStack'>): JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name={TotalActivitiesRouteName} component={TotalActivities} options={{ title: 'Total Activities' }} />
      <Stack.Screen name='ActivityResults' component={ActivityResults} options={TransparentHeaderOptions} />
    </Stack.Navigator >
  )
}

function TotalActivities(p: StackScreenProps<LocalStackPropsPerPath, 'TotalActivities'>): JSX.Element {
  const listViewRef: React.Ref<SwipeListView<ActivitySummary>> = React.useRef(null)
  const manager = App.activityManager

  // refresh list on drawer close (also runs on first render as drawer is closed)
  const drawerOpen: boolean = useIsDrawerOpen()
  useEffect(() => {
    if (!drawerOpen) {
      if (manager.needToRefreshUserActivities) {
        listViewRef.current?.scrollToOffset({ offset: 0, animated: true })
        void manager.refreshUserActivities()
      }
    }
  }, [drawerOpen])

  useFocusEffect(useCallback(() => {
    if (manager.hasNewActivities) {
      console.log('**** HAS NEW ACTIVITIES')
      if (manager.needToRefreshUserActivities)
        console.log('**** [canceled due to filter refresh]')
    }
    if (manager.hasNewActivities && !manager.needToRefreshUserActivities) {
      listViewRef.current?.scrollToOffset({ offset: 0, animated: true })
      void manager.refreshUserActivities()
    }
  }, [manager.hasNewActivities]))

  useEffect(() => p.navigation.setOptions({
    // scroll to top on title press
    headerTitle: h => (
      <HeaderTitle
        onPress={() => listViewRef.current?.scrollToOffset({ offset: 0, animated: true })}
        style={h.style}
      >
        {h.children}
      </HeaderTitle>
    ),
    // filter button
    headerRight: props => (
      <Pressable style={{ marginRight: 20 }} onPress={() => p.navigation.dispatch(DrawerActions.toggleDrawer())}>
        <Image source={FilterIcon} style={{ width: 20, height: 20, resizeMode: 'contain' }} tintColor={props.tintColor} />
      </Pressable>
    ),
  }))

  return reactive(() => {
    return (
      <SafeAreaView>
        <SwipeListView
          useFlatList
          disableRightSwipe
          closeOnRowBeginSwipe
          closeOnRowPress
          closeOnScroll
          tension={300}
          friction={50}
          rightOpenValue={-2 * RowControlButtonWidth}
          onRowOpen={key => {
            // trick to make TotalActivities swipe-list work correctly
            manager.setKeyToDelete(key)
          }}
          onRowDidClose={key => {
            // trick to make TotalActivities swipe-list work correctly
            if (manager.keyToDelete === key) {
              manager.setKeyToDelete('')
            }
          }}
          listViewRef={listViewRef as any} // fix type mismatch
          style={{ backgroundColor: '#f4f4f4' }}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          ListHeaderComponent={renderHeader}
          // ListEmptyComponent={() => (
          //   <Text>TODO: Empty list component</Text>
          // )}
          ItemSeparatorComponent={renderSeparator}
          data={manager.userActivities}
          keyExtractor={getItemKey}
          renderItem={({ item, index }, rowMap) => (
            <Pressable
              style={styles.pressableItem}
              onPress={() => {
                const key = getItemKey(item, index)
                if (manager.keyToDelete) {
                  rowMap[key].closeRow()
                }
                else {
                  p.navigation.push('ActivityResults', { summary: item, showNewButton: false })
                }
              }}
            >
              <ActivityItem item={item} />
            </Pressable>
          )}
          renderHiddenItem={(rowData, rowMap) => {
            const closeRow: () => void = () => rowMap[getItemKey(rowData.item, rowData.index)].closeRow()
            return ActivityRowControl(rowData.item, closeRow)
          }}
          extraData={manager.userActivities.map(a => a.updatedAt)} // to update rowMap
          onEndReachedThreshold={1} // number of screens left to load more
          onEndReached={() => {
            if (manager.needToLoadMoreUserActivities) {
              void manager.loadMoreUserActivities()
            }
          }}
          refreshing={Monitors.Refreshing.isActive}
          onRefresh={async () => {
            await manager.refreshUserActivities()
          }}
        />
      </SafeAreaView>
    )
  })
}

function getItemKey(item: ActivitySummary, index: number): string {
  return (item._id ?? index.toString())
}

function renderHeader(): JSX.Element {
  return reactive(() => {
    const report = App.user.report.totalActivityReport
    const totalCount: number = report.totalActivities.value ?? 0
    const statsFlag: ReportFlag = report.totalActivities.flag ?? ReportFlag.SameStats

    let hexBackground: any
    if (statsFlag === ReportFlag.HighStats)
      hexBackground = GoodHexGradient
    else if (statsFlag === ReportFlag.LowStats)
      hexBackground = BadHexGradient
    else
      hexBackground = DefaultHexGradient

    return (
      <Hexagon
        columns={3}
        rows={1}
        extraRows
        stroke='#d8d8d8'
        strokeWidth={2}
        textColor='white'
        contentImageWidth={30}
        cells={[
          undefined,
          {
            backgroundGradient: hexBackground,
            content: {
              image: UpImage,
              h1: totalCount.toString(),
              h1size: 24,
              h2: 'TOTAL ACTIVITIES',
            },
          },
        ]}
      />
    )
  })
}

function renderSeparator(): JSX.Element {
  return (
    <View style={{ borderBottomColor: 'lightgray', borderBottomWidth: 1 }} />
  )
}

function ActivityItem({ item }: { item: ActivitySummary }): JSX.Element {
  return reactive(() => (
    <View style={styles.activityItem}>
      <View style={styles.activityInfo}>
        <View style={[styles.activityLabel, styles.activityLabelMargin]}>
          <Text style={styles.activityLabelText}>{item.name}</Text>
          <TextSeparator height={15} />
          <View style={styles.activityLabelTextContainer}>
            <Text style={styles.activityLabelText} numberOfLines={1} ellipsizeMode='tail'>
              {item.getStartEndText()}
            </Text>
          </View>
        </View>
        <View style={[styles.activityLabel, styles.activityLabelMargin]}>
          <Text style={styles.activityLabelTextSecondary}>{item.getDurationText()}</Text>
          <TextSeparator height={15} />
          <View style={styles.activityLabelTextContainer}>
            <Text style={styles.activityLabelTextSecondary}>{item.getDistanceText()}</Text>
          </View>
        </View>
        <View style={styles.activityLabel}>
          <Text style={styles.activityLabelTextSecondary}>{item.getCaloriesText()} Calories</Text>
        </View>
      </View>
      {item.origin !== ActivityOrigin.TEM ? (
        <Text style={styles.activityLabelTextOrigin}>{item.origin}</Text>
      ) : null}
      <View style={styles.activityImageContainer}>
        <AutosizeImage
          style={styles.activityImage}
          mainAxisSize={ImageSize}
          source={{ uri: item.image }}
          tintColor={MainBlueColor}
        />
      </View>
    </View>
  ))
}

function ActivityRowControl(activity: ActivitySummary, closeRow: () => void): React.ReactElement {
  return (
    <View style={styles.rowControl}>
      <Pressable
        style={[styles.rowControlButton, styles.rcEditButton]}
        onPress={() => {
          closeRow()
          App.openEditActivity(activity)
        }}
      >
        <Text style={styles.rowControlText}>Edit</Text>
      </Pressable>
      <Pressable
        style={[styles.rowControlButton, styles.rcDeleteButton]}
        onPress={() => {
          Alert.alert('', 'Are you sure you want to delete this activity?', [
            { text: 'No', onPress: closeRow },
            {
              text: 'Yes',
              onPress: () => doAsync(async () => {
                closeRow()
                const message: string = await App.activityManager.deleteUserActivity(activity)
                ToastAndroid.show(message, ToastAndroid.SHORT)
              }),
            },
          ])
        }}
      >
        <Text style={styles.rowControlText}>Delete</Text>
      </Pressable>
    </View>
  )
}

const ImageSize: number = 30
const RowControlButtonWidth: number = 75

const TextSeparator: React.FunctionComponent<{ height?: number | string, color?: ColorValue, width?: number }> = p => (
  <View
    style={{
      height: p.height ?? '100%',
      borderLeftColor: p.color ?? MainBlueColor,
      borderLeftWidth: p.width ?? 1,
      marginHorizontal: 10,
      alignSelf: 'center',
    }}
  />
)

const CardPadding = 15

const styles = StyleSheet.create({
  pressableItem: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  activityItem: {
    flex: 1,
    paddingVertical: CardPadding,
    paddingHorizontal: CardPadding,
    flexDirection: 'row',
  },
  activityInfo: {
    flex: 1,
  },
  activityLabel: {
    flexDirection: 'row',
    flex: 1,
  },
  activityLabelMargin: {
    marginBottom: 5,
  },
  activityLabelTextContainer: {
    flex: 1,
  },
  activityLabelText: {
    fontWeight: 'bold',
  },
  activityLabelTextSecondary: {},
  activityLabelTextOrigin: {
    color: 'grey',
    position: 'absolute',
    right: CardPadding,
    bottom: CardPadding,
  },
  activityImageContainer: {
    justifyContent: 'flex-start',
  },
  activityImage: {
    marginLeft: 10,
  },

  rowControl: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  rowControlButton: {
    paddingHorizontal: 15,
    justifyContent: 'center',
    width: RowControlButtonWidth,
  },
  rcEditButton: {
    backgroundColor: MainBlueColor,
  },
  rcDeleteButton: {
    backgroundColor: 'red',
  },
  rowControlText: {
    color: 'white',
    textAlign: 'center',
  },
})
