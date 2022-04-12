//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { Text, StyleSheet, ViewStyle, TextStyle, View, Image, ImageStyle, Pressable, Alert, PressableAndroidRippleConfig, ToastAndroid, Share } from 'react-native'
import { Ref } from 'reactronic'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import FA5Icon from 'react-native-vector-icons/FontAwesome5'
import ParsedText, { ParseShape } from 'react-native-parsed-text'
import { IImageInfo } from 'react-native-image-zoom-viewer/built/image-viewer.type'
import dayjs from 'dayjs'

import { FeedElement } from 'models/data/Feed'
import { reactive } from 'common/reactive'
import { UserAvatarSize, CommentInput } from 'components/CommentInput'
import { App } from 'models/app/App'
import { UserComment } from 'models/data/Comments'
import { LikeStatus } from 'models/data/Likes'
import { GrayColor, MainBlueColor } from 'components/Theme'
import { UserInfo } from 'models/data/UserInfo'
import { ActionItem } from 'components/ActionModal'
import { doAsync } from 'common/doAsync'
import { Media, MediaType } from 'models/data/Media'
import { PostShareType } from 'models/data/Post'

import HighFive from 'assets/icons/Feed/high-five/high-five.png'
import HighFiveBlue from 'assets/icons/Feed/high-five-blue/high-five-blue.png'
import Comment from 'assets/icons/Feed/comment/comment.png'
import SharePost from 'assets/icons/Feed/share-post/share-post.png'
import UserDummy from 'assets/images/user-dummy.png'
import DefaultCardImage from 'assets/images/Feed/picture.png'
import VideoPlayImage from 'assets/images/Feed/video-play.png'

export interface FeedCardProps {
  model: FeedElement
  onDelete: (() => void) | (() => Promise<void>)
  showFullText?: boolean
} 

const TextDefaultNumberOfLines = 2
const CaptionLengthThreshold = 100
const CommentThreshold = 2

export const FeedCard: React.FunctionComponent<FeedCardProps> = (p: FeedCardProps) => {
  return reactive(() => {

    const model: FeedElement = p.model
    console.log("..model{{",JSON.stringify(model,null,2))
    const user: UserInfo = model.user
    const userComment: UserComment = model.userComment
    const showMoreCommentsButton: boolean = model.comment_count > CommentThreshold

    function onHashTagPress(tag: string): void {
      // Alert.alert('Hash tag pressed', tag, undefined, { cancelable: true })
    }

    function onMentionPress(mention: string): void {
      // Alert.alert('Mention pressed', mention, undefined, { cancelable: true })
    }
    console.log("feed",model.media[0].preview_url)
    const deletePost = (): void => {
      Alert.alert('Delete post',
        'Are you sure you want to delete your post?',
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Yes',
            style: 'destructive',
            onPress: () => {
              doAsync(async () => {
                await App.feed.deletePost(model)
                await p.onDelete()
                App.feed.elements.removeItem(model)
                ToastAndroid.show('Post deleted', ToastAndroid.SHORT)
              })
            },
          }
        ]
      )
    }

    const moreActions: ActionItem[] = []
    if ((model.user._id ?? model.user.user_id) === App.user.stored._id) {
      moreActions.push({
        name: 'Delete',
        onPress: deletePost,
        actionType: 'danger',
      })
    }
    else {
      moreActions.push({
        name: 'Challenge',
        onPress: () => {
          ToastAndroid.show('Please, try again later', ToastAndroid.SHORT)
        },
        actionType: 'major',
      }, {
        name: 'Report',
        onPress: () => {
          ToastAndroid.show('Please, try again later', ToastAndroid.SHORT)
        },
        actionType: 'major',
      }, {
        name: 'Disconnect',
        onPress: () => {
          ToastAndroid.show('Please, try again later', ToastAndroid.SHORT)
        },
        actionType: 'major',
      })
    }

    function onMoreActionsPress(): void {
      App.actionModal.show(moreActions)
    }

    const parseShapes: ParseShape[] = [
      {
        pattern: /#\S+/,
        style: styles.hashTag,
        onPress: onHashTagPress,
      },
      {
        // TODO: valid user ID RegExp
        pattern: /@\S+/,
        style: styles.mention,
        onPress: onMentionPress,
      },
    ]

    let captionTextElement: JSX.Element = (
      <ParsedText numberOfLines={!p.showFullText ? TextDefaultNumberOfLines : undefined} parse={parseShapes}>{model.caption}</ParsedText>
    )
    if (!p.showFullText && model.caption.length > CaptionLengthThreshold) {
      captionTextElement = (
        <View>
          {captionTextElement}
          <Text onPress={() => App.feed.viewPost(p.model, p.onDelete)} style={styles.textMoreLess}>More</Text>
        </View>
      )
    }

    const moreActionsButton = (
      <Icon name='options' color='black' size={18} onPress={onMoreActionsPress} style={styles.headLineMoreButton} />
    )

    let showInfoHeadline: boolean
    let infoHeadlineText: string | null

    switch (model.postType) {
      case PostShareType.LikedByFriend:
        showInfoHeadline = true
        infoHeadlineText = `${model.friendsLikeCount} of your tēmates liked this.`
        break
      case PostShareType.CommentByFriend:
        showInfoHeadline = true
        infoHeadlineText = `${model.friendsCommentCount} of your tēmates commented on this.`
        break
      default:
        showInfoHeadline = false
        infoHeadlineText = null
        break
    }

    return (
      <View style={styles.container}>
        {showInfoHeadline && (
          <View style={styles.headLine}>
            <Text>{infoHeadlineText}</Text>
            {/* <View style={styles.headLineText}></View> */}
            {moreActionsButton}
          </View>
        )}
        <View style={styles.header}>
          <Image
            defaultSource={UserDummy}
            source={user.profile_pic ? { uri: user.profile_pic } : UserDummy}
            style={styles.authorAvatar}
          />
          <View style={styles.headerTextAndMoreButtonWrapper}>
            <View style={styles.headerTextWrapper}>
              <Text numberOfLines={1}>{user.username ? user.username : user.getFullName()}</Text>
              {model.address && (model.address.city || model.address.country) ? (
                <View style={styles.location}>
                  <FA5Icon name='map-marker-alt' size={12} style={styles.locationIcon}></FA5Icon>
                  <Text>
                    {model.address.city ? model.address.city : null}
                    {model.address.city && model.address.country ? ',\n' : null}
                    {model.address.country ? model.address.country : null}
                  </Text>
                </View>
              ) : null}
            </View>
            {!showInfoHeadline &&
              moreActionsButton
            }
          </View>
        </View>
        <View style={styles.media}>
          {model.media.length > 0 && (
            <Pressable style={styles.mediaImageContainer} onPress={() => showMedia(model.media)}>
              <Image
                defaultSource={DefaultCardImage}
                source={{ uri: model.media[0].preview_url }}
                // TODO: get normal height and width
                style={styles.mediaImage}
              />
              {model.media[0].type === MediaType.Video && (
                <Image source={VideoPlayImage} style={styles.mediaVideo} />
              )}
              {model.media.length > 1 && (
                <Text style={styles.mediaCount}>{model.media.length}</Text>
              )}
            </Pressable>
          )}
        </View>
        <View style={styles.body}>
          <View style={styles.reaction}>
            <Pressable android_ripple={ReactionRipple} style={styles.marginRight} onPress={() => likePost(model)}>
              <Image source={model.like_status === LikeStatus.Liked ? HighFiveBlue : HighFive} style={styles.reactionIcon} fadeDuration={0} />
            </Pressable>
            <Pressable android_ripple={ReactionRipple} style={styles.marginRight} onPress={() => App.feed.openPostComments(model)}>
              <Image source={Comment} style={styles.reactionIcon} fadeDuration={0} />
            </Pressable>
            <Pressable android_ripple={ReactionRipple} style={styles.marginRight}  onPress={() => sharePost(model)}>
              <Image source={SharePost} style={styles.reactionIcon} fadeDuration={0} />
            </Pressable>
          </View>
          <View style={styles.textContainer}>
            {captionTextElement}
          </View>
          <View style={styles.likes}>
            {model.likes.length > 0 &&
              (
                <View style={styles.likesFriends}>
                  {model.likes.map((x, i) => (
                    <Image key={i} source={x.profile_pic ? { uri: x.profile_pic } : UserDummy} style={styles.likesAvatar} />
                  ))}
                  <Text style={styles.likesSeparator}>•</Text>
                </View>
              )
            }
            <Text style={styles.likesText} >
              {model.likes_count === 0 ? 'No' : model.likes_count} Shoutout{model.likes_count !== 1 && 's'}
            </Text>
          </View>
          <View style={styles.comments}>
            {showMoreCommentsButton &&
              (
                <Pressable onPress={() => App.feed.openPostComments(model)} style={styles.moreCommentsButton}>
                  <Text style={[styles.commentsListItem, styles.moreComments]}>
                    View all {model.comment_count} comments
                  </Text>
                </Pressable>
              )
            }
            {
              model.comments.length > 0 &&
              model.comments.slice(0, CommentThreshold).reverse().map((x, i) => (
                <Text
                  key={i}
                  style={(i > 0 || showMoreCommentsButton) && styles.commentsListItemNonFirst}
                >
                  <Text style={[styles.commentsListItem, styles.commentsListItemAuthor]}>{x.user_id.username}: </Text>
                  <ParsedText style={styles.commentsListItem} parse={parseShapes}>{x.comment}</ParsedText>
                </Text>
              ))
            }
            <CommentInput
              model={Ref.to(userComment).value}
              onPost={() => postComment(model)}
              userAvatar={App.user.getAvatar()}
              style={styles.newComment}
            />
          </View>
          <Text style={styles.postTime}>{dayjs(new Date(model.created_at).getTime()).fromNow()}</Text>
        </View>
      </View >
    )
  })
}

function showMedia(media: Media[]): void {
  const images: IImageInfo[] = []
  media.forEach(m => {
    if (m.url && m.type === MediaType.Photo)
      images.push({ url: m.url })
  })
  if (images.length)
    App.imageViewer.show(images)
}

async function postComment(model: FeedElement): Promise<void> {
  await model.postComment()
}

async function likePost(model: FeedElement): Promise<void> {
  await model.switchLike()
}

async function sharePost(model: FeedElement): Promise<void> {
  const link = await model.getShortLink()
  void Share.share({ message: link })
}

const AuthorAvatarSize: number = 50
const CardPadding: number = 15
const ReactionIconSize: number = 30
const LikesAvatarSize: number = 25
const LowerFontSize: number = 12
const MediaImageHeight: number = 300

const ReactionRipple: PressableAndroidRippleConfig = {
  radius: ReactionIconSize / 2,
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F7F7',
    borderRadius: 8,   
    borderColor: 'gray',
    marginTop: 20,    
    elevation: 3,
    paddingVertical: 10,
    // marginHorizontal: 5,
    // borderWidth: 1,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: CardPadding,      

  } as ViewStyle,

  headerTextAndMoreButtonWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextWrapper: {
    flex: 1,
    justifyContent: 'center',
  },

  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 5,
  },
 
  headLine: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: GrayColor,
    paddingHorizontal: 15,
    marginBottom: 5,
  } as ViewStyle,
  headLineText: {
    flex: 1,
  } as ViewStyle,
  headLineMoreButton: {
    padding: 10,
  },
  authorAvatar: {
    width: AuthorAvatarSize,
    height: AuthorAvatarSize,
    borderRadius: AuthorAvatarSize / 2,
    marginRight: 10,
  },
  media: {
  } as ViewStyle,
  mediaImageContainer: {
    maxHeight: MediaImageHeight,
    backgroundColor: '#F7F7F7', 
  } as ViewStyle,
  mediaImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    borderRadius: 10,
  } as ImageStyle,
  mediaVideo: {
    position: 'absolute',
    top: 140,
    left: 185,
    width: 30,
    height: 30,
  },
  mediaCount: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 100,
    backgroundColor: MainBlueColor,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'white',
    fontSize: 16,
  },
  body: {
    paddingHorizontal: CardPadding,
  } as ViewStyle,
  reaction: {
    marginTop: 10,
    flexDirection: 'row',
    marginLeft :15,
  } as ViewStyle,
  marginRight: {    
    marginRight: 10,
    justifyContent:"center",
    alignItems:"center",
   width:40,
   height:40,
    backgroundColor:"#fff",
    borderRadius:20,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.29,
    shadowRadius: 2.65,
    elevation: 2,
  } as ViewStyle,
  reactionIcon: {
    height: ReactionIconSize,
    width: ReactionIconSize,
    resizeMode: 'contain',
    
  } as ImageStyle,
  textContainer: {
    marginTop: 10,
  } as ViewStyle,
  textMoreLess: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
    color: '#0A6AD0',
    fontSize: LowerFontSize,
    fontWeight: 'bold',
  } as TextStyle,
  hashTag: {
    color: 'black',
    fontWeight: 'bold',
  } as TextStyle,
  mention: {
    color: 'black',
    fontWeight: 'bold',
  } as TextStyle,
  likes: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  likesFriends: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    
  } as ViewStyle,
  likesAvatar: {
    height: LikesAvatarSize,
    width: LikesAvatarSize,
    borderRadius: LikesAvatarSize / 2,
    borderWidth: 1,
    borderColor: 'white',
    marginLeft: -10,
  } as ImageStyle,
  likesSeparator: {
    marginHorizontal: 7,
    fontWeight: 'bold',
    fontSize: 15,
  } as TextStyle,
  likesText: {
    fontSize: LowerFontSize,
  } as TextStyle,
  comments: {
    marginTop: 10,
  } as ViewStyle,
  moreCommentsButton: {
    alignSelf: 'flex-start',
  } as ViewStyle,
  moreComments: {
    // textDecorationLine: 'underline',
    alignSelf: 'flex-start',
  } as TextStyle,
  commentsListItem: {
    color: 'gray',
    fontSize: LowerFontSize,
    
  } as TextStyle,
  commentsListItemNonFirst: {
    marginTop: 10,
  },
  commentsListItemAuthor: {
    // fontWeight: 'bold',
  } as TextStyle,
  newComment: {
    marginTop: 15,
    
  } as ViewStyle,
  postTime: {
    marginTop: 10,
    marginLeft: UserAvatarSize + 10,
    color: 'gray',
    fontSize: LowerFontSize,
    fontWeight: 'bold',
  } as TextStyle,
})
