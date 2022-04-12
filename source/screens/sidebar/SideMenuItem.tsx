//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useState, useEffect } from 'react'
import { View, Image, ImageSourcePropType, Pressable, Text, StyleSheet, ViewStyle, ImageStyle } from 'react-native'
import { useIsDrawerOpen } from '@react-navigation/drawer'
import ArrowRightIcon from 'assets/icons/arrow-right/arrow-right.png'
import { MenuItemBorderColor, MenuItemBorderWidth } from 'components/Theme'

export interface MenuItemProps {
  icon?: ImageSourcePropType | EmptyIcon
  iconColor?: string
  label: string
  onPress?: null | (() => void)
  subItems?: MenuItemProps[]
  showArrow?: boolean
}

export type EmptyIcon = null
export const EmptyIcon: EmptyIcon = null

export const SideMenuItem: React.FunctionComponent<MenuItemProps> = p => {
  // Hide subitems when drawer is closed
  const [open, setOpen] = useState(false)
  const isDrawerOpen = useIsDrawerOpen()
  useEffect(() => setOpen(false), [isDrawerOpen])

  const hasSubItems: boolean = p.subItems !== undefined && p.subItems.length > 0
  let onPress: null | undefined | (() => void)
  if (hasSubItems) {
    onPress = () => {
      setOpen(!open)
      if (p.onPress)
        p.onPress()
    }
  }
  else {
    onPress = p.onPress
  }
  const showArrow: boolean = p.showArrow ?? false
  return (
    <>
      <Pressable onPress={onPress} style={styles.item}>
        <View style={styles.itemBody}>
          {p.icon !== undefined && (
            <View style={styles.iconContainer}>
              {p.icon !== EmptyIcon && (
                <Image source={p.icon} style={styles.iconImage} fadeDuration={0} tintColor={p.iconColor} />
              )}
            </View>
          )}
          <Text>{p.label}</Text>
        </View>
        {(hasSubItems || showArrow) && (
          <Image source={ArrowRightIcon} style={open ? styles.moreButtonOpen : styles.moreButton} />
        )}
      </Pressable>
      {
        open && p.subItems !== undefined && p.subItems.length > 0 &&
        p.subItems.map((item, index) => (
          <SideMenuItem key={item.label + '-' + index} {...item} />
        ))
      }
    </>
  )
}

const IconSize = 20

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    height: 55,
    borderColor: MenuItemBorderColor,
    borderBottomWidth: MenuItemBorderWidth,
  } as ViewStyle,
  itemBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    height: IconSize,
    width: IconSize,
    marginRight: 15,
  } as ViewStyle,
  iconImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  } as ImageStyle,
  moreButton: {
    height: '30%',
    resizeMode: 'contain',
  } as ImageStyle,
  moreButtonOpen: {
    height: '30%',
    resizeMode: 'contain',
    transform: [
      { rotate: '90deg' }
    ],
  } as ImageStyle,
})
