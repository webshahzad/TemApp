//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useEffect } from 'react'
import { Image, Text, FlatList, Pressable, StyleSheet, ViewStyle, ImageStyle, TextStyle, ImageSourcePropType } from 'react-native'
import { reactive } from 'common/reactive'
import { App } from 'models/app/App'
import { ObservableObject, Transaction } from 'reactronic'
import { SortOrder } from 'models/app/ActivityManager'

import CheckIcon from 'assets/icons/check-white/check-white.png'
import { MainBlueColor } from 'components/Theme'
import { populate } from 'common/populate'
import { useIsDrawerOpen } from '@react-navigation/drawer'

export function TotalActivitiesSideMenu(): JSX.Element {
  const listViewRef: React.Ref<FlatList> = React.useRef(null)

  // scroll to top on drawer close
  const drawerOpen: boolean = useIsDrawerOpen()
  useEffect(() => {
    if (!drawerOpen)
      listViewRef.current?.scrollToOffset({ offset: 0, animated: false })
  }, [drawerOpen])

  const manager = App.activityManager

  const menuStaticItems: MenuItemProps[] = Transaction.run(
    () => ([
      {
        name: 'SORT BY DATE',
        isHeader: true,
      },
      {
        name: 'Ascending',
        onPress: () => manager.setUserActivitiesSort(SortOrder.Ascending),
        selected: () => manager.isUserActivitiesSortAscending(),
      },
      {
        name: 'Descending',
        onPress: () => manager.setUserActivitiesSort(SortOrder.Descending),
        selected: () => manager.isUserActivitiesSortDescending(),
      },
      {
        name: 'FILTER BY ACTIVITY',
        isHeader: true,
      },
    ] as MenuItemModel[]).map(p => ({ model: populate(new MenuItemModel(), p) }))
  )

  useEffect(() => {
    if (manager.needToLoadActivityList)
      void manager.loadActivityList()
  }, [])

  return reactive(() => {
    const menuDynamicItems: MenuItemProps[] = Transaction.run(
      () => manager.activityList.map(activity => ({
        model: populate(new MenuItemModel(),
          {
            name: () => activity.name,
            icon: () => ({ uri: activity.image }),
            selected: () => activity.filterSelected,
            onPress: () => activity.switchFilterSelected(),
          } as MenuItemModel),
      }) as MenuItemProps)
    )

    const menuItems: MenuItemProps[] = menuStaticItems.concat(menuDynamicItems)
    return (
      <FlatList
        ref={listViewRef}
        scrollsToTop={false}
        stickyHeaderIndices={[0, 3]}
        keyExtractor={(item, index) => index.toString()}
        data={menuItems}
        renderItem={({ item }) => {
          return (
            <MenuItem {...item} />
          )
        }}
      />
    )
  })
}

class MenuItemModel extends ObservableObject {
  isHeader?: boolean = undefined
  name: string | (() => string) = ''
  icon?: () => ImageSourcePropType = undefined
  selected?: () => boolean = undefined
  onPress?: () => void = undefined
}

interface MenuItemProps {
  model: MenuItemModel
}

function MenuItem(p: MenuItemProps): JSX.Element {
  return reactive(() => {
    const name: string = (p.model.name instanceof Function) ? p.model.name() : p.model.name
    const selected = p.model.selected ? p.model.selected() : false
    return (
      <Pressable style={[styles.item, p.model.isHeader ? styles.itemHeader : undefined]} onPress={p.model.onPress}>
        {p.model.icon !== undefined && (
          <Image style={styles.icon} source={p.model.icon()} />
        )}
        <Text style={[styles.name, p.model.isHeader ? styles.headerName : undefined]}>{name}</Text>
        {selected && (
          <Image source={CheckIcon} tintColor={MainBlueColor} style={styles.checkIcon} />
        )}
      </Pressable>
    )
  })
}

const BorderBottomColor = '#77777711'
const IconHeight = 25
const IconWidth = 35
const CheckSize = 20

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    height: 50,
    borderBottomColor: BorderBottomColor,
    borderBottomWidth: 1,
    alignItems: 'center',
  } as ViewStyle,
  itemHeader: {
    backgroundColor: 'white',
    borderBottomWidth: 3,
  } as ViewStyle,
  icon: {
    height: IconHeight,
    width: IconWidth,
    resizeMode: 'contain',
  } as ImageStyle,
  name: {
    fontSize: 15,
    marginLeft: 10,
  } as TextStyle,
  headerName: {
    fontWeight: 'bold',
  } as TextStyle,
  checkIcon: {
    height: CheckSize,
    width: CheckSize,
    resizeMode: 'contain',
    marginLeft: 'auto',
  } as ImageStyle,
})
