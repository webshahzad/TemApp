//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useEffect } from 'react'
import { FlatList, StyleSheet, ViewStyle } from 'react-native'
import { Ref } from 'reactronic'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StackScreenProps, HeaderTitle } from '@react-navigation/stack'
import { RootStackPropsPerPath } from 'navigation/params'

import { reactive } from 'common/reactive'
import { CommentInput } from 'components/CommentInput'
import { Monitors } from 'models/app/Monitors'
import { CommentsItem } from './CommentsItem'
import { Comment } from 'models/data/Comments'
import { FeedElement } from 'models/data/Feed'
import { App } from 'models/app/App'
import { DefaultGrayColor } from 'components/Theme'

export function Comments(p: StackScreenProps<RootStackPropsPerPath, 'Comments'>): JSX.Element {
  const listViewRef: React.Ref<FlatList> = React.useRef(null)
 

  // Scroll to last comment on title press
  useEffect(() => p.navigation.setOptions({
    headerTitle: h => (
      <HeaderTitle
        onPress={() => listViewRef.current?.scrollToIndex({ index: 0, animated: true })}
        style={h.style}
      >
        {h.children}
       
      </HeaderTitle>
    ),
  }))

  return reactive(cycle => {
    const model = App.feed.currentPostForComments
    if (!model) return null
    return (
      <SafeAreaView style={styles.container}>
        
        <FlatList
          inverted
          style={styles.list}
          data={model.comments}
          ref={listViewRef}
          keyExtractor={(item, index) => {
            return item._id ?? index.toString()
          }}
          renderItem={(info: { item: Comment, index: number }) => {
           
            return(
            <CommentsItem model={model} item={info.item} index={info.index} />
            )
          }
          }
          onEndReachedThreshold={1}
          // number of screens left to load more
          onEndReached={() => {
            if (model.needToLoadMoreComments) {
              const clear: boolean = (cycle === 0)
              void model.loadMoreComments(clear)
            }
          }}
          refreshing={Monitors.Refreshing.isActive}
          onRefresh={async () => {
            await model.refreshComments()
         }}
        />
        <CommentInput
          model={Ref.to(model.userComment).value}
          userAvatar={App.user.getAvatar()}
          onPost={() => postComment(model, listViewRef.current)}
          style={styles.newComment}
        />
      </SafeAreaView>
    )
  })
}

async function postComment(model: FeedElement, listView: FlatList | null): Promise<void> {
  await model.postComment()
  if (listView !== null)
    listView.scrollToIndex({ index: 0, animated: true })
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'stretch',
  } as ViewStyle,
  list: {
    backgroundColor: DefaultGrayColor,
  } as ViewStyle,
  newComment: {
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
    paddingHorizontal: 15,
    paddingVertical: 20,
  } as ViewStyle,
})
