//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useEffect, useState } from 'react'
import { View, ScrollView, StyleSheet, Text, Pressable, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StackScreenProps } from '@react-navigation/stack'
import { reactive } from 'common/reactive'
import { Ref, Transaction } from 'reactronic'

import { RootStackPropsPerPath } from 'navigation/params'
import { InputBadge } from 'components/InputBadge'
import { TemateItem } from 'components/TemateList'
import { App } from 'models/app/App'
import { FeedCard } from 'screens/feed/FeedCard'
import { GoalChallengeItem } from 'screens/gnc/GoalsAndChallengesList'
import { Bool } from 'common/constants'
import { doAsync } from 'common/doAsync'
import { showUserDetails } from 'screens/profile/OtherUser'
import { ChatItem } from 'screens/social/ChatList'
import { PickerBadge } from 'components/PickerBadge'
import { PickerManager } from 'models/app/PickerManager'
import {
  AllEventsSubCategories, AllEventsSubSubCategories, getEventsSubCategoryText, getEventsSubSubCategoryText,
  AllGroupsSubCategories, AllPeopleSubCategories, AllPeopleSubSubCategories, AllPostsSubCategories,
  AllSearchCategories, getCategoryText, getGroupsSubCategoryText, getPeopleSubCategoryText,
  getPeopleSubSubCategoryText, getPostsSubCategoryText, SearchCategory
} from 'models/app/GlobalSearch/SearchCategory'
import { Monitors } from 'models/app/Monitors'
import { EventListItem } from './EventListItem'
import { MainBlueColor } from 'components/Theme'

export function GlobalSearch(p: StackScreenProps<RootStackPropsPerPath, 'GlobalSearch'>): JSX.Element {
  const manager = App.globalSearch
  useEffect(() => {
    return () => manager.reset()
  }, [])
  const m = Ref.to(manager)
  const [categoryManager] = useState(() => Transaction.run(() => new PickerManager(AllSearchCategories, m.category)))
  return reactive(() => {
    return (
      <SafeAreaView style={styles.expanded}>
        <InputBadge
          icon='search'
          model={m.filter}
          contentStyle={styles.input}
          clearButton
          
        />
        <View style={styles.panel}>
          <PickerBadge
            label='Category'
            labelBackgroundColor='white'
            manager={categoryManager}
            renderEmptyPicker={() => (
              <Text style={{ flex: 1, paddingVertical: 5, color: 'lightgray' }}>{/* Preserve height */}</Text>
            )}
            renderPickerItem={item => (
              <Text style={styles.categoryPickerText}>{getCategoryText(item)}</Text>
            )}
            renderSelectedItem={item => {
              return (
                <Text style={{ flex: 1, paddingVertical: 5, color: 'black' }}>{getCategoryText(item)}</Text>
              )
            }}
          />
        </View>

        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={Monitors.Refreshing.isActive}
              onRefresh={() => manager.refresh()}
            />}
        >
          {manager.count() > 0
            ? (
              <>
                {manager.people.count() > 0 &&
                  <>
                    {(manager.category === SearchCategory.AllCategories)
                      && (
                        <Text style={styles.headerCategory}>People</Text>
                      )}
                    {AllPeopleSubCategories.map(sub => {
                      const data = manager.people[sub]
                      return data.count() > 0
                        ? (
                          <React.Fragment key={sub}>
                            <Text style={styles.header}>{getPeopleSubCategoryText(sub)}</Text>
                            {AllPeopleSubSubCategories
                              .map(subSub => {
                                const list = data[subSub]
                                return list.length > 0
                                  ? (
                                    <React.Fragment key={subSub}>
                                      <Text style={styles.subHeader}>{getPeopleSubSubCategoryText(subSub)}</Text>
                                      {list.map(user => (
                                        <TemateItem
                                          key={user.getId()}
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
                                      ))}
                                      <ShowMoreButton
                                        action={() => {
                                          manager.showPeopleSearch(m.filter, sub, subSub)
                                        }}
                                      />
                                    </React.Fragment>
                                  )
                                  : null
                              }).filter(x => x !== null)}
                          </React.Fragment>
                        )
                        : null
                    }).filter(x => x !== null)}
                  </>
                }
                {manager.posts.count() > 0 &&
                  <>
                    {(manager.category === SearchCategory.AllCategories)
                      && (
                        <Text style={styles.headerCategory}>Posts</Text>
                      )}
                    {AllPostsSubCategories.map(sub => {
                      const list = manager.posts[sub]
                      return list.length > 0
                        ? (
                          <React.Fragment key={sub}>
                            <Text style={styles.header}>{getPostsSubCategoryText(sub)}</Text>
                            {list.map(post => (
                              <FeedCard
                                key={post._id}
                                model={post}
                                onDelete={() => {
                                  const listMutable = list.toMutable()
                                  listMutable.splice(list.indexOf(post), 1)
                                  manager.posts[sub] = listMutable
                                }}
                              />
                            ))}
                            <ShowMoreButton
                              action={() => {
                                manager.showPostsSearch(m.filter, sub)
                              }}
                            />
                          </React.Fragment>
                        )
                        : null
                    }
                    ).filter(x => x !== null)}
                  </>
                }
                {manager.groups.count() > 0 &&
                  <>
                    {(manager.category === SearchCategory.AllCategories)
                      && (
                        <Text style={styles.headerCategory}>Tēms</Text>
                      )}
                    {AllGroupsSubCategories.map(sub => {
                      const list = manager.groups[sub]
                      return list.length > 0
                        ? (
                          <React.Fragment key={sub}>
                            <Text style={styles.header}>{getGroupsSubCategoryText(sub)}</Text>
                            {list.map(x => (
                              <ChatItem key={x.group_id} chat={x} />
                            ))}
                            <ShowMoreButton
                              action={() => {
                                manager.showGroupsSearch(m.filter, sub)
                              }}
                            />
                          </React.Fragment>
                        )
                        : null
                    }
                    ).filter(x => x !== null)}
                  </>
                }
                {manager.goals.length > 0 &&
                  <>
                    {(manager.category === SearchCategory.AllCategories)
                      && (
                        <Text style={styles.headerCategory}>Goals</Text>
                      )}
                    {manager.goals.map(x => (
                      <GoalChallengeItem key={x._id} item={x} status={x.status} short />
                    ))}
                    <ShowMoreButton
                      action={() => {
                        manager.showGoalsSearch(m.filter)
                      }}
                    />
                  </>
                }
                {manager.challenges.length > 0 &&
                  <>
                    {(manager.category === SearchCategory.AllCategories)
                      && (
                        <Text style={styles.headerCategory}>Challenges</Text>
                      )}
                    {manager.challenges.map(x => (
                      <GoalChallengeItem key={x._id} item={x} status={x.status} short />
                    ))}
                    <ShowMoreButton
                      action={() => {
                        manager.showChallengesSearch(m.filter)
                      }}
                    />
                  </>
                }
                {manager.events.count() > 0 &&
                  <>
                    {(manager.category === SearchCategory.AllCategories)
                      && (
                        <Text style={styles.headerCategory}>Events</Text>
                      )}
                    {AllEventsSubCategories.map(sub => {
                      const data = manager.events[sub]
                      return data.count() > 0
                        ? (
                          <React.Fragment key={sub}>
                            <Text style={styles.header}>{getEventsSubCategoryText(sub)}</Text>
                            {AllEventsSubSubCategories
                              .map(subSub => {
                                const list = data[subSub]
                                return list.length > 0
                                  ? (
                                    <React.Fragment key={subSub}>
                                      <Text style={styles.subHeader}>{getEventsSubSubCategoryText(subSub)}</Text>
                                      {list.map(event => (
                                        <EventListItem key={event._id} event={event} />
                                      ))}
                                      <ShowMoreButton
                                        action={() => {
                                          manager.showEventsSearch(m.filter, sub, subSub)
                                        }}
                                      />
                                    </React.Fragment>
                                  )
                                  : null
                              }).filter(x => x !== null)}
                          </React.Fragment>
                        )
                        : null
                    }).filter(x => x !== null)}
                  </>
                }
              </>
            )
            : (
              <View style={styles.noData}>
                <Text style={styles.noDataText}>{manager.getNoDataCaption()}</Text>
                <Text style={styles.noDataText}>{manager.getNoDataText()}</Text>
              </View>
            )
          }
        </ScrollView>
      </SafeAreaView>
    )
  })
}

function ShowMoreButton({ action }: { action: () => void }): JSX.Element {
  return (
    <Pressable
      style={styles.moreData}
      onPress={() => {
        action()
      }}
    >
      <Text style={styles.moreDataText}>Show more</Text>
    </Pressable>
  )
}

function Separator(): React.ReactElement {
  return (
    <View style={styles.separator} />
  )
}

const Padding = 10

const styles = StyleSheet.create({
  expanded: {
    width: '100%',
    paddingVertical: Padding,
    height: '100%',
  },
  panel: {
    paddingHorizontal: Padding,
    paddingBottom: Padding,
    backgroundColor: 'white',
  },
  input: {
    backgroundColor: 'white',
    margin: Padding,
    // paddingBottom: Padding,
    borderWidth: 0,
    borderRadius: 25,
  },
  categoryPickerText: {
    padding: 15,
    backgroundColor: 'white',
    fontSize: 17,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  noData: {
    width: '100%',
    paddingTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    color: 'gray',
    fontSize: 16,
    textAlign: 'center',
  },
  content: {
    backgroundColor: 'white',
  },
  headerCategory: {
    padding: 10,
    color: 'black',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  header: {
    padding: 10,
    color: 'black',
    textTransform: 'uppercase',
  },
  subHeader: {
    fontWeight: 'bold',
    textTransform: 'lowercase',
    color: 'black',
    padding: 10,
    paddingTop: 0,
  },
  moreData: {
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  moreDataText: {
    color: MainBlueColor,
    fontSize: 13,
  },
  separator: {
    borderTopWidth: 1,
    borderTopColor: 'lightgrey',
  },
})
