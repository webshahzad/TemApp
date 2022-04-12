//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useEffect } from 'react'
import { StyleSheet, RefreshControl,Text ,View, ScrollView} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackPropsPerPath } from 'navigation/params'
import { FeedCard } from './FeedCard'
import { App } from 'models/app/App'
import { reactive } from 'common/reactive'
import { FeedElement } from 'models/data/Feed'
import { BlueBackground } from 'components/Theme'
import { Monitors } from 'models/app/Monitors'
import { ChatHeader } from 'components/Header';
import { useNavigation } from '@react-navigation/native'


export function Post(p: StackScreenProps<RootStackPropsPerPath, 'Post'>): JSX.Element {
  const postId = p.route.params?.post_id
  const external = p.route.params?.external
  const onDelete = p.route.params?.onDelete
  const navigation = useNavigation();

  if (external) {
    useEffect(() => {
      App.feed.resetSelectedPostToView()
      void App.feed.loadAndSelectPostToView(postId)
    }, [postId])
  }

  return reactive(() => {
    const post: FeedElement | undefined = App.feed.currentPostToView
    console.log("post>>",post)
       return (
      <SafeAreaView style={styles.screen}>
        <ScrollView style={styles.screen} contentContainerStyle={styles.container}> 
        <ChatHeader rightIcon='cross' rightOnPress={()=> navigation.navigate("Main")} />   
          
          <RefreshControl
            refreshing={Monitors.Refreshing.isActive}
            onRefresh={() => App.feed.loadAndSelectPostToView(postId)}/>   
             <View style={{paddingVertical:5,marginLeft:15,marginTop:10,}}>
           <Text style={{fontSize:15}}>{post?.user?.username}</Text>
        </View> 
          
          {post !== undefined && (
            <FeedCard
              model={post}
              showFullText
              onDelete={() => {
                if (onDelete)
                  onDelete()
                p.navigation.pop()
                
              }}
            />
            
          )}
           
        </ScrollView>
      </SafeAreaView>
    )
  })
}

const styles = StyleSheet.create({
  screen: {
    height: '100%',
    width: '100%',
    },
  container: {
    width: '100%',
    minHeight: '100%',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    backgroundColor: '#f7f7f7',
  },
})
