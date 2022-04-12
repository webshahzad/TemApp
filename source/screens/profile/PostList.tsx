//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { reactive } from 'common/reactive'
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { App } from 'models/app/App'
import { UserPostDisplay } from 'models/app/UserInspector'
import { FeedCard } from 'screens/feed/FeedCard'
import DefaultCardImage from 'assets/images/Feed/picture.png'
import { MainBlueColor } from 'components/Theme'
import { PostList } from 'models/app/PostList'
import { Monitors } from 'models/app/Monitors'


export const PostDisplayTabs = [{
  value: UserPostDisplay.Masonry,
  icon: 'th',
}, {
  value: UserPostDisplay.List,
  icon: 'list',
}]

export function Posts({ posts }: { posts: PostList }): JSX.Element {
  return reactive(() => (
    <>
      <View style={styles.tabs}>
        {posts.items.length > 0 && PostDisplayTabs.map(tab => (
          <Pressable
            key={tab.value}
            style={styles.tab}
            onPress={() => posts.setPostDisplay(tab.value)}
          >
            <Icon
              name={tab.icon}
              size={20}
              color={(tab.value === posts.postDisplay) ? MainBlueColor : 'black'}
            />
          </Pressable>
        ))}
      </View>

      {(posts.postDisplay === UserPostDisplay.Masonry)
        ? (
          <View style={styles.masonry}>
            {posts.items.map(post => (
              <Pressable
                key={post._id}
                style={styles.post}
                onPress={() => App.feed.viewPost(post, () => posts.removeItem(post))}
              >
                <Image
                  defaultSource={DefaultCardImage}
                  source={{ uri: post.media[0].preview_url }}
                  // TODO: get normal height and width
                  style={[styles.image, { height: 150 }]}
                />
              </Pressable>
            ))}
            {posts.hasMoreItems() && (
              <Pressable
                style={styles.post}
                onPress={() => posts.loadMoreItems()}
              >
                <View style={{ flex: 1, height: 150, justifyContent: 'center' }}>
                  {Monitors.UserPostsRefreshing.isActive
                    ? (
                      <ActivityIndicator size='large' color='black' />
                    )
                    : (
                      <Text style={{ textAlign: 'center', textAlignVertical: 'center', color: 'gray' }}>Load{'\n'}More</Text>
                    )}
                </View>
              </Pressable>
            )}
          </View>
        )
        : (
          <View>
            {posts.items.map(post => (
              <FeedCard
                key={post._id}
                model={post}
                onDelete={() => {
                  posts.removeItem(post)
                }}
              />
            ))}
            {posts.hasMoreItems() && (
              <View style={styles.listFooter}>
                {Monitors.UserPostsRefreshing.isActive
                  ? (
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                      <Text style={styles.moreItemsInList}>Loading</Text>
                      <ActivityIndicator size='small' color='black' />
                    </View>
                  )
                  : (
                    <Text style={styles.moreItemsInList} onPress={() => posts.loadMoreItems()}>Load more</Text>
                  )}
              </View>
            )}
          </View>
        )}
    </>
  ))
}

const styles = StyleSheet.create({
  tabs: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'lightgray',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  masonry: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'lightgray',
  },
  post: {
    width: '50%',
    borderWidth: 1,
    borderColor: 'white',
    padding: 5,
  },
  image: {
    flex: 1,
  },
  listFooter: {
    marginVertical: 5,
    paddingVertical: 5,
    borderRadius: 100,
    borderColor: 'black',
    backgroundColor: 'white',
    elevation: 5,
  },
  moreItemsInList: {
    textAlign: 'center',
    color: 'gray',
  },
})
