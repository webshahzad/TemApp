//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useLayoutEffect } from 'react'
import { FlatList, StyleSheet, Text, ListRenderItem, View, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useScrollToTop } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { FeedStackPropsPerPath } from 'navigation/params'
import { FeedCard } from './FeedCard'
import { App } from 'models/app/App'
import { reactive } from 'common/reactive'
import { FeedElement } from 'models/data/Feed'
import { Monitors } from 'models/app/Monitors'
import { BlueBackground, DefaultGrayColor } from 'components/Theme'
import { HeaderRight, HeaderButton } from 'components/HeaderRight'
import DefaultCardImage from 'assets/images/Feed/picture.png'
import { SuggestedTemates } from './SuggestedTemates'
import { ChatHeader } from 'components/Header'
import { useNavigation } from '@react-navigation/native'

export function Feed(p: StackScreenProps<FeedStackPropsPerPath, 'Feed'>): JSX.Element {
  const listViewRef: React.Ref<FlatList> = React.useRef(null)
  const navigation = useNavigation();
  // Scroll to top on bottom tab press
  useScrollToTop(listViewRef)

  useLayoutEffect(() => {
    p.navigation.setOptions({
      headerRight: props => (
        <HeaderRight
        tintColor={props.tintColor}
        buttons={[
          HeaderButton.newPost,
          HeaderButton.globalSearch,
          ]}
        />
      ),
    })
    void App.feed.elements.loadItems()
  }, [])

  return reactive(() => {
    const feed = App.feed.elements
    
       return (
      <SafeAreaView style={styles.container}>
         <ChatHeader rightIcon='plus' rightOnPress={()=>navigation.navigate("ImageSelection")}/>
        <FlatList
          ref={listViewRef}
          data={feed.items}
          keyExtractor={(item, _index) => {
            return item._id
            
          }}
          renderItem={renderItem}
          ListEmptyComponent={() => Monitors.FeedRefreshing.isActive ? (<FeedLoadingPlaceholder />) : (<EmptyFeed />)}
          onEndReachedThreshold={2} // number of screens left to load more
          onEndReached={() => {
            void feed.loadMoreItems()
          }}
          refreshing={Monitors.FeedRefreshing.isActive}
          onRefresh={async () => {
            await feed.loadItems()
            if (feed.items.length === 0) {
              void App.userSearchManager.suggestions.loadItems()
            }
          }}
        />
      </SafeAreaView>
    )
  })
}

const renderItem: ListRenderItem<FeedElement> = ({ item }) => (
  <FeedCard model={item} onDelete={() => App.feed.elements.removeItem(item)} />
)

function EmptyFeed(): JSX.Element {
  return (
    <View style={styles.emptyFeed}>
      <Image source={DefaultCardImage} fadeDuration={0} style={styles.emptyFeedImage} />
      <Text style={styles.emptyFeedText}>
        <Text>You have not created a post yet.{'\n'}</Text>
        <Text>Once you have, all your posts live here.</Text>
      </Text>
      <Text style={styles.suggestedTitle}>suggested tēmates</Text>
      <SuggestedTemates />
    </View>
  )
}

function FeedLoadingPlaceholder(): JSX.Element {
  // TODO: loading placeholder
  return (
    <View></View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: "#F7F7F7",
  },
  emptyFeed: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
    padding: 10,
    paddingBottom: 0,
    backgroundColor: DefaultGrayColor,
  },
  emptyFeedImage: {
    height: 70,
    width: 70,
    resizeMode: 'contain',
    marginTop: 10,
  },
  emptyFeedText: {
    textAlign: 'center',
    color: 'gray',
    marginVertical: 10,
  },
  suggestedTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 10,
  },
})
