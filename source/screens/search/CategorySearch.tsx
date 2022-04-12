//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { reactive } from 'common/reactive'
import { StackScreenProps } from '@react-navigation/stack'

import { CategorySearchManager } from 'models/app/GlobalSearch/CategorySearchManager'
import { RootStackPropsPerPath } from 'navigation/params'
import { doAsync } from 'common/doAsync'
import { UserInfo } from 'models/data/UserInfo'
import { TemateItem } from 'components/TemateList'
import { showUserDetails } from 'screens/profile/OtherUser'
import { App } from 'models/app/App'
import { Bool } from 'common/constants'
import { Ref } from 'reactronic'
import { FeedElement } from 'models/data/Feed'
import { FeedCard } from 'screens/feed/FeedCard'
import { ChatRoom } from 'models/data/ChatRoom'
import { ChatItem } from 'screens/social/ChatList'
import { GoalOrChallenge } from 'models/data/GoalOrChallenge'
import { GoalChallengeItem } from 'screens/gnc/GoalsAndChallengesList'
import { SafeAreaView } from 'react-native-safe-area-context'
import { InputBadge } from 'components/InputBadge'
import { StyleSheet } from 'react-native'
import { EventInfo } from 'models/data/EventInfo'
import { EventListItem } from './EventListItem'

export function CategorySearch(p: StackScreenProps<RootStackPropsPerPath, 'CategorySearch'>): JSX.Element | null {
  const manager = App.globalSearch.categoryManager
  if (!manager)
    return null

  React.useEffect(() => {
    p.navigation.setOptions({
      title: manager.title,
    })
    return () => {
      App.globalSearch.resetCategoryManager()
    }
  }, [])

  return reactive(() => {
    const items = manager.data.items
    const filterRef = manager.filterRef
    return (
      <SafeAreaView style={styles.expanded}>
        <InputBadge
          icon='search'
          model={filterRef}
          contentStyle={styles.input}
          clearButton
        />
        <FlatList
          data={items}
          keyExtractor={(item, index) => {
            return manager.getKey(item, index)
          }}
          renderItem={({ item }) => {
            return manager.renderItem(item)
          }}
          onEndReached={() => doAsync(async () => manager.data.loadMoreItems())}
          onEndReachedThreshold={0.1}
          onRefresh={() => doAsync(async () => manager.data.loadItems())}
        />
      </SafeAreaView>
    )
  })
}

const Padding = 10

const styles = StyleSheet.create({
  expanded: {
    width: '100%',
    paddingVertical: Padding,
    height: '100%',
  },
  input: {
    backgroundColor: 'white',
    margin: Padding,
    borderWidth: 0,
    borderRadius: 25,
  },
})

//#region Managers

export class PeopleSearchManager extends CategorySearchManager<UserInfo> {
  constructor(url: string, title: string, filterRef: Ref<string>) {
    super(url, title, filterRef, UserInfo)
  }

  renderItem(user: UserInfo): JSX.Element {
    return (
      <TemateItem
        user={user}
        buttons={[{
          id: 'add',
          icon: 'plus',
          title: 'Add',
          shouldHide: user => user.is_friend === Bool.True,
          onPress: user => doAsync(() => App.userSearchManager.sendRequest(user)),
        }]}
        onUserPressed={showUserDetails}
      />
    )
  }

  getKey(user: UserInfo, _index: number): string {
    return user.getId()
  }
}

export class PostsSearchManager extends CategorySearchManager<FeedElement> {
  constructor(url: string, title: string, filterRef: Ref<string>) {
    super(url, title, filterRef, FeedElement)
  }

  renderItem(post: FeedElement): JSX.Element {
    return (
      <FeedCard key={post._id} model={post} onDelete={async () => await this.loadDataOnFilterChange()} />
    )
  }

  getKey(post: FeedElement, _index: number): string {
    return post._id
  }
}

export class GroupsSearchManager extends CategorySearchManager<ChatRoom> {
  constructor(url: string, title: string, filterRef: Ref<string>) {
    super(url, title, filterRef, ChatRoom)
  }

  renderItem(chat: ChatRoom): JSX.Element {
    return (
      <ChatItem chat={chat} />
    )
  }

  getKey(chat: ChatRoom, _index: number): string {
    return chat.group_id
  }
}

export class GoalsChallengesSearchManager extends CategorySearchManager<GoalOrChallenge> {
  constructor(url: string, title: string, filterRef: Ref<string>) {
    super(url, title, filterRef, GoalOrChallenge)
  }

  renderItem(goalChallenge: GoalOrChallenge): JSX.Element {
    return (
      <GoalChallengeItem item={goalChallenge} status={goalChallenge.status} short />
    )
  }

  getKey(goalChallenge: GoalOrChallenge, _index: number): string {
    return goalChallenge._id
  }
}

export class EventsSearchManager extends CategorySearchManager<EventInfo> {
  constructor(url: string, title: string, filterRef: Ref<string>) {
    super(url, title, filterRef, EventInfo)
  }

  renderItem(event: EventInfo): JSX.Element {
    return (
      <EventListItem event={event} />
    )
  }

  getKey(event: EventInfo, index: number): string {
    return event._id || index.toString()
  }
}

//#endregion
