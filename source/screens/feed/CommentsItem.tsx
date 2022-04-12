//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { StyleSheet, ViewStyle, View, Image, Text, ImageStyle, TextStyle, Pressable } from 'react-native'
import { SwipeRow } from 'react-native-swipe-list-view'
import dayjs from 'dayjs'

import UserUnknown from 'assets/images/user-dummy.png'

import { Comment } from 'models/data/Comments'
import { FeedElement } from 'models/data/Feed'
import { CommentColor, DefaultGrayColor } from 'components/Theme'
import { App } from 'models/app/App'

interface CommentsItemProps {
  model: FeedElement
  item: Comment
  index: number
}

export function CommentsItem(p: CommentsItemProps): React.ReactElement {
  let result: React.ReactElement
  if (p.item.user_id._id === App.user.stored._id)
    result = (
      <SwipeRow
        key={p.model._id}
        rightOpenValue={-75}
        disableRightSwipe
        // preview // TODO: on application first launch
      >
        {CommentRowControl(p)}
        {CommentRow(p)}
      </SwipeRow>
    )
  else
    result = (
      <CommentRow {...p} />
    )
  return result
}
const CommentRow: React.FunctionComponent<CommentsItemProps> = (p: CommentsItemProps) => {
  const data: Comment = p.item
 
  return (
    <View style={styles.comment}>
     
      <Image
        defaultSource={UserUnknown}
        source={data.user_id.profile_pic ? { uri: data.user_id.profile_pic } : UserUnknown}
        style={styles.userImage}
      />
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.userName}>{data.user_id.username}</Text>
          <Text style={styles.postTime}>{dayjs(new Date(data.created_at).getTime()).fromNow()}</Text>
        </View>
        <Text style={styles.text}>{data.comment}</Text>
      </View>
    </View>
  )
}

function CommentRowControl(p: CommentsItemProps): React.ReactElement {
  return (
    <View style={styles.rowControl}>
      <Pressable
        style={styles.rowControlRightButton}
        onPress={() => p.model.deleteComment(p.item._id, p.index)}
      >
        <Text style={styles.rowControlText}>Delete</Text>
      </Pressable>
    </View>
  )
}

const UserImageSize: number = 50

const styles = StyleSheet.create({
  rowControl: {
    height: '100%',
  },
  rowControlRightButton: {
    flex: 1,
    backgroundColor: "red",
    paddingHorizontal: 15,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rowControlText: {
    color: 'white',
  },
  comment: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    backgroundColor: DefaultGrayColor,
  } as ViewStyle,
  userImage: {
    width: UserImageSize,
    height: UserImageSize,
    borderRadius: UserImageSize / 2,
  } as ImageStyle,
  card: {
    flex: 1,
    marginLeft: 15,
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: CommentColor,
    backgroundColor: "#F7F7F7",
  } as ViewStyle,
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  } as ViewStyle,
  userName: {
    fontWeight: 'bold',
    color:'#000'
  } as TextStyle,
  postTime: {
    color: 'gray',
  } as TextStyle,
  text: {} as TextStyle,
})
