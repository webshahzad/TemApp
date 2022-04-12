//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { Text, StyleSheet, Pressable, FlatList, View, Image, ImageSourcePropType, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StackScreenProps } from '@react-navigation/stack'
import HTML from 'react-native-render-html'
import ArrowRightIcon from 'assets/icons/arrow-right/arrow-right.png'
import { reactive } from 'common/reactive'
import { RootStackPropsPerPath } from 'navigation/params'
import { MenuItemBorderColor, MenuItemBorderWidth } from 'components/Theme'
import { App } from 'models/app/App'
import { useOnFocus } from 'common/useOnFocus'
import { FaqItem } from 'models/app/Faqs'
import AutoImage from 'react-native-autosize-image'

export function FAQs(p: StackScreenProps<RootStackPropsPerPath, 'FAQs'>): JSX.Element {
  useOnFocus(p.navigation, async () => {
    App.faqs.closeAll()
    if (App.faqs.needToLoad)
      await App.faqs.load()
  })

  return reactive(() => {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={App.faqs.items}
          renderItem={renderItem}
          keyExtractor={(_item, _index) => _item._id}
        />
      </SafeAreaView>
    )
  })
}

const renderItem: (info: { item: FaqItem }) => JSX.Element = ({ item }) => (<ListItem item={item} />)

function ListItem(p: { item: FaqItem }): JSX.Element {
  const images: ImageSourcePropType[] = p.item.image.map(i => ({ uri: i }))
  return reactive(() => {
    const height: number | undefined = p.item.isOpen ? undefined : 0
    return (
      <View style={styles.item} >
        <Pressable
          style={styles.itemPressable}
          onPress={() => {
            if (p.item.description) {
              App.faqs.switchItem(p.item)
            }
            else {
              App.faqs.closeAll()
              App.tutorial.show()
            }
          }}
        >
          <Text style={styles.itemHeading}>{p.item.heading}</Text>
          <Image source={ArrowRightIcon} style={p.item.isOpen ? styles.itemMoreButtonOpen : styles.itemMoreButton} />
        </Pressable>
        {(p.item.description.length > 0) && (
          <View style={{ height, marginTop: height === undefined ? 10 : undefined, overflow: 'hidden' }} >
            <HTML
              // TODO: inline image
              html={p.item.description}
              imagesMaxWidth={20}
            />
            {images.map((image, index) => (
              <AutoImage key={index} source={image} style={styles.image} mainAxisSize={Dimensions.get('screen').width - 10}/>
            ))}
          </View>
        )}
      </View>
    )
  })
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: 'white',
  },
  item: {
    padding: 15,
    paddingLeft: 20,
    borderColor: MenuItemBorderColor,
    borderBottomWidth: MenuItemBorderWidth,
  },
  itemPressable: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemHeading: {
    flex: 1,
    fontSize: 16,
  },
  itemMoreButton: {
    resizeMode: 'contain',
  },
  itemMoreButtonOpen: {
    resizeMode: 'contain',
    transform: [
      { rotate: '90deg' }
    ],
  },
  image: {
    alignSelf: 'center',
  },
})
