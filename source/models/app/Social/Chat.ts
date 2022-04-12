//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ChatRoom, ChatStatus, ChatType, ChatWindowType, GroupChatStatus, Visibility } from 'models/data/ChatRoom'
import { UserInfo } from 'models/data/UserInfo'
import { Reentrance, reentrance, ObservableObject, unobservable, Transaction, transaction, standalone } from 'reactronic'
import { App } from '../App'
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { Api, ApiData } from '../Api'
import { populate } from 'common/populate'
import { MediaUploadStatus, Message, MessageType } from 'models/data/Message'
import {
  IMessage as GiftedMessage, QuickReplies as GiftedQuickReplies,
  Reply as GiftedReply, User as GiftedUser
} from 'react-native-gifted-chat'
import { Bool } from 'common/constants'
import { Firebase } from '../Firebase'
import ImagePicker, { ImagePickerResponse } from 'react-native-image-picker'
import { Media, MediaType } from 'models/data/Media'
import { FirebaseStorageTypes } from '@react-native-firebase/storage'
import 'react-native-get-random-values'
import { v4 as uuid } from 'uuid'
import { Screen } from '../Screen'
import { Alert, LogBox } from 'react-native'
import { ActionItem } from 'components/ActionModal'
import { GroupChat } from './GroupChat'
import { create } from 'common/create'

// this warning is shown because of polyfill for random generator needed for uuid
LogBox.ignoreLogs(['Using an insecure random number generator'])

export class Chat extends ObservableObject {
  roomId: string
  chatInfo: ChatRoom = new ChatRoom()
  chatWindowType: ChatWindowType
  screenType?: Screen = undefined

  // Messages are appended in reverse order.
  // From API they come from oldest to newest.
  // In this array they are put from newest to oldest.
  messages: ObservableObjectGiftedMessage[] = []
  currentUser: ObservableObjectGiftedUser = new ObservableObjectGiftedUser()

  private cachedUsers = new Map<string, ObservableObjectGiftedUser>()
  private messagesQueryUnsubscribe?: () => void = undefined
  private userChatStatusUnsubscribe?: () => void = undefined

  @unobservable readonly group: GroupChat

  constructor(roomId: string, chatWindowType: ChatWindowType = ChatWindowType.Normal) {
    super()
    this.roomId = roomId
    this.group = new GroupChat(this)
    this.chatWindowType = chatWindowType
  }

  @transaction
  async initChat(): Promise<void> {
    if (this.chatWindowType === ChatWindowType.Normal)
      await this.loadChatInfo()
    await Firebase.users.doc(App.user.id).collection('chatRooms')
      .doc(this.roomId).set({ lastSeen: Date.now() / 1000 }, { merge: true })
    await this.fetchUserInfoForRendering(this.currentUser, App.user.id)
    if (this.chatInfo.chat_status !== undefined)
      await this.updateUserChatStatus(App.user.id, this.chatInfo.chat_status)
    if (this.chatInfo.group_chat_status !== undefined)
      await this.updateUserGroupChatStatus(App.user.id, this.chatInfo.group_chat_status)
    this.observeUserAndGroupChatStatus(App.user.id)
    await this.loadMessages()
  }

  async loadChatInfo(): Promise<void> {
    console.log(" this.roomId ----->", this.roomId )
    const response = await Api.call<ApiData<ChatRoom>>('POST', 'chat/info', { chat_room_id: this.roomId })
    console.log("loadChatInfo", response)
    populate(this.chatInfo, response.data)
    if (this.chatInfo.type === ChatType.SingleChat) {
      const member = this.chatInfo.members[0]
      const info = await Chat.fetchUserInfo(member.user_id)
      this.chatInfo.group_title = `${info.first_name} ${info.last_name}`
      this.chatInfo.image = member.profile_pic
    } else if (this.chatInfo.group_chat_status !== 0) { // do not load participants if the user is no longer a part of the group
      const members = await Api.call<ApiData<UserInfo[]>>('GET', `chat/participants/list?group_id=${this.roomId}`)
      this.chatInfo.members = members.data.map(x => create(UserInfo, x))
      this.chatInfo.memberIds = this.chatInfo.members.map(x => x.user_id)
      this.chatInfo.members_count = this.chatInfo.members.length
      for (const member of this.chatInfo.members) {
        const info = await Chat.fetchUserInfo(member.getId())
        populate(member, info)
      }
    } else {
      this.chatInfo.members = []
      this.chatInfo.memberIds = []
    }
  }

  protected async loadMessages(): Promise<void> {
    const isPublicRoom = this.chatWindowType !== ChatWindowType.Normal
    const snapshot = (await Firebase.users.doc(App.user.id).collection('chatRooms')
      .doc(this.roomId).get()).data() as ChatRoom
    this.chatInfo.clearChatTime = snapshot.clearChatTime
    console.log("roomId---->",this.roomId)
    let query: FirebaseFirestoreTypes.Query = Firebase.chats.doc(this.roomId).collection('messages')
    if (this.chatInfo.clearChatTime !== undefined)
      query = query.where('time', '>', this.chatInfo.clearChatTime)

    const fetchLatestFirst = false
    if (fetchLatestFirst)
      query = query.orderBy('time', 'desc')
    else
      query = query.orderBy('time')

    this.messages = []
    if (this.messagesQueryUnsubscribe)
      this.messagesQueryUnsubscribe()

    if (this.chatInfo.type === ChatType.SingleChat
      || this.chatInfo.visibility === Visibility.Public
      || this.chatInfo.visibility === Visibility.Temates
      || this.chatInfo.group_chat_status === GroupChatStatus.Active) {
      this.messagesQueryUnsubscribe = query.onSnapshot(async snapshot => {
        const messages = snapshot.docChanges().map(doc => doc.doc.data() as Message)
        console.log(messages)
        await this.handleMessages(messages)
      })
    }
  }

  @transaction
  @reentrance(Reentrance.WaitAndRestart)
  private async handleMessages(messages: Message[]): Promise<void> {
    const messagesMutable = this.messages.toMutable()
    for (const messageDto of messages) {
      if (!messageDto.id) continue

      const index = messagesMutable.findIndex(x => x._id === messageDto.id)
      const updatedAt = messageDto.updatedAt
      const createdAt = messageDto.time
      if (updatedAt !== undefined && createdAt !== updatedAt && index >= 0) {
        const message = new ObservableObjectGiftedMessage()
        await this.prepareMessageForRendering(message, messageDto)
        messagesMutable[index] = message
      }
      else if (messageDto.type === MessageType.Image || messageDto.type === MessageType.Video) {
        const uploadStatus = messageDto.uploadingStatus
        if (uploadStatus !== undefined) {
          if ((uploadStatus === MediaUploadStatus.Uploading || uploadStatus === MediaUploadStatus.Error)
            && messageDto.senderId === App.user.id) {
            const message = new ObservableObjectGiftedMessage()
            await this.prepareMessageForRendering(message, messageDto)
            messagesMutable.unshift(message)
          }
          else if (uploadStatus === MediaUploadStatus.Uploaded) {
            const message = new ObservableObjectGiftedMessage()
            await this.prepareMessageForRendering(message, messageDto)
            messagesMutable.unshift(message)
          }
        }
      }
      else {
        const message = new ObservableObjectGiftedMessage()
        await this.prepareMessageForRendering(message, messageDto)
        messagesMutable.unshift(message)
      }

      // todo: groups
      // if (this.chatWindowType !== ChatWindowType.Normal) {
      //   if (messageDto.senderId && messageDto.senderId !== App.user.id && !this.users.has(messageDto.senderId)) {
      //     Firestore.users.doc(messageDto.senderId).onSnapshot(snapshot => {
      //       Transaction.run(() => {
      //         const chatMember = snapshot.data() as UserInfo | undefined
      //         console.log(chatMember)
      //         if (chatMember && chatMember.user_id)
      //           this.users.set(chatMember.user_id, chatMember)
      //       })
      //     })
      //   }
      // }
    }
    this.messages = messagesMutable
  }

  private async prepareMessageForRendering(message: ObservableObjectGiftedMessage, messageDto: Message): Promise<void> {
    // fixme: workaround for reactronic
    message._id = messageDto.id
    message.text = messageDto.text ?? ''
    message.createdAt = messageDto.time * 1000
    let user = this.cachedUsers.get(messageDto.senderId)
    if (!user) {
      user = new ObservableObjectGiftedUser()
      this.cachedUsers = this.cachedUsers.toMutable().set(messageDto.senderId, user)
      if (messageDto.senderId)
        await this.fetchUserInfoForRendering(user, messageDto.senderId)
    }
    if (messageDto.media)
      if (messageDto.type === MessageType.Image)
        message.image = messageDto.media.url
      else if (messageDto.type === MessageType.Video)
        message.video = messageDto.media.url
    message.user = user
  }

  private async fetchUserInfoForRendering(user: ObservableObjectGiftedUser, senderId: string): Promise<void> {
    // fixme: workaround for reactronic
    const userInfo = await Chat.fetchUserInfo(senderId)
    user._id = senderId
    user.avatar = userInfo.profile_pic ?? ''
    user.name = `${userInfo.first_name} ${userInfo.last_name}`
  }

  static async fetchUserInfo(id: string): Promise<UserInfo> {
    const response = await Api.call<ApiData<UserInfo>>('GET', `users/info/${id}`)
    return response.data
  }

  @transaction
  async sendMessages(messages: GiftedMessage[]): Promise<void> {
    await this.postMessageIsToBeSent()

    for (const messageInfo of messages) {
      messageInfo.text = messageInfo.text.trim()
      if (!messageInfo.text) continue

      const message = new Message()
      message.text = messageInfo.text
      message.type = MessageType.Text
      message.isRead = Bool.False
      message.senderId = App.user.id
      message.chat_room_id = this.roomId
      message.id = messageInfo._id.toString()
      message.time = (messageInfo.createdAt instanceof Date ? messageInfo.createdAt.getTime() : messageInfo.createdAt) / 1000
      message.uploadingStatus = MediaUploadStatus.Uploaded
      if (this.chatInfo.type === ChatType.GroupChat && this.chatWindowType === ChatWindowType.Normal)
        message.userIds = this.chatInfo.memberIds.slice()
      message.chatType = this.chatInfo.type
      // todo: group chat
      await this.postMessage(this.roomId, message)
    }
  }


  @transaction
  async selectAndSendImage(): Promise<void> {
       return new Promise((resolve, reject) =>
      ImagePicker.showImagePicker({ noData: true }, async response => { 
        
        if (!response.didCancel && !response.error && response.uri) {
            await this.sendImage(response)

          resolve()
        } else
          reject()
      })
    )
  }


  @transaction
  private async sendImage(response: ImagePickerResponse): Promise<void> {
    await this.postMessageIsToBeSent()

    const message = new Message()
    console.log("Message",message)
    message.isRead = Bool.False
    message.senderId = App.user.id
    message.chat_room_id = this.roomId
    message.uploadingStatus = MediaUploadStatus.Uploading
    message.id = uuid()
    message.time = Date.now() / 1000
    message.updatedAt = message.time
    if (this.chatInfo.type === ChatType.GroupChat) {
      if (this.screenType === Screen.groupActivityChat)
        message.userIds = [App.user.id]
      else
        message.userIds = this.chatInfo.memberIds
    }
    message.chatType = this.chatInfo.type
    message.type = MessageType.Image
    await this.postMessage(this.roomId, message)

    const media = new Media()
    media.url = response.uri
    console.log('---------------------------123',media.url)
    media.mimeType = 'image/jpg'
    media.type = MediaType.Photo
    media.extension = '.jpg'
    media.imageRatio = response.width / response.height
    const metadata: FirebaseStorageTypes.SettableMetadata = {
      contentType: media.mimeType,
      customMetadata: {
        contentType: media.mimeType,
      },
    }
    console.log("metadata>>",metadata)
    console.log("AppId", App.user.id);
    
    const path = `${this.roomId}${App.user.id}${Date.now()}`
    console.log("path>>>>>>}",path)
    const imageReference = Firebase.storage.ref(path)
    console.log("imageReference{}{}",imageReference)
    const upload = await imageReference.putFile(response.uri, metadata).catch((e) => {console.log('error',e)})
    console.log("upload====",upload)
    media.url = await imageReference.getDownloadURL() 
   
    media.preview_url = media.url    
    message.media = media
    message.uploadingStatus = MediaUploadStatus.Uploaded
    message.updatedAt = new Date(upload.metadata.timeCreated).getTime() / 1000
     await this.postMessage(this.roomId, message)
    
  }

  private async postMessageIsToBeSent(): Promise<void> {
    console.log("this.roomId", this.roomId);
    
    if (this.chatInfo.chat_initiated === Bool.False) {
      await Api.call('POST', 'chat/init', { chat_room_id: this.roomId })
      const data: { [k: string]: unknown } = {
        chat_initiated: Bool.True,
        type: this.chatInfo.type ?? ChatType.SingleChat,
        group_title: this.chatInfo.group_title,
      }
      if (this.chatInfo.memberIds.length > 0) {
        const ids = [...this.chatInfo.memberIds, App.user.id]
        data.member_ids = ids
      }
      await Firebase.chats.doc(this.roomId).set(data, { merge: true })
    }
    if (this.chatInfo.type === ChatType.SingleChat) {
      if (this.chatInfo.is_deleted === Bool.True)
        await this.updateDeleteChatStatus(this.roomId, App.user.id, Bool.False)
      const otherMember = this.chatInfo.members.filter(x => x.user_id !== App.user.id)[0]
      if (otherMember.is_deleted === Bool.True)
        await this.updateDeleteChatStatus(this.roomId, otherMember.user_id, Bool.False)
    }
  }

  private async postMessage(roomId: string, message: Message): Promise<void> {
    await Firebase.chats.doc(roomId).collection('messages')
      .doc(message.id).set(message, { merge: true })
  }

  private async updateDeleteChatStatus(roomId: string, userId: string, status: Bool): Promise<void> {
    await Firebase.chats.doc(this.roomId).collection('chatMembersStatus')
      .doc(userId).set({ is_deleted: status, chat_room_id: roomId }, { merge: true })
  }

  async onOpenChat(): Promise<void> {
    await this.setUserOnline(true)
    await this.trackChatStatus(true)
  }

  @transaction
  async onCloseChat(): Promise<void> {
    if (this.messagesQueryUnsubscribe) {
      this.messagesQueryUnsubscribe()
      this.messagesQueryUnsubscribe = undefined
    }
    if (this.userChatStatusUnsubscribe) {
      this.userChatStatusUnsubscribe()
      this.userChatStatusUnsubscribe = undefined
    }
    await this.setUserOnline(false)
    await this.trackChatStatus(false)
  }

  private async trackChatStatus(onChatScreen: boolean): Promise<void> {
    await Firebase.users.doc(App.user.id).collection('chatRooms')
      .doc(this.roomId).set({ onChatScreen }, { merge: true })
  }

  private async setUserOnline(online: boolean): Promise<void> {
    const params = {
      status: online ? 1 : 0,
      chat_room_id: this.roomId,
    }
    await Api.call('PUT', 'chat/active', params)
  }

  getChatActions(): ActionItem[] {
    if (this.chatInfo.type === ChatType.SingleChat) {
      if (this.chatWindowType === ChatWindowType.Challenge || this.chatWindowType === ChatWindowType.Goal)
        return [
          { name: 'Clear chat', onPress: this.clearMessages },
          { name: 'Mute', onPress: this.muteChat },
        ]
      else if (this.chatInfo.chat_status === ChatStatus.Unfriend)
        return [
          { name: 'Block', onPress: this.askBlockUser },
          { name: 'Clear chat', onPress: this.clearMessages },
        ]
      else if (this.chatInfo.chat_status === ChatStatus.Blocked)
        return [
          { name: 'Clear chat', onPress: this.clearMessages },
        ]
      else if (this.chatInfo.chat_status === ChatStatus.Active)
        return [
          { name: 'Disconnect', onPress: this.askUnfriendUser },
          { name: 'Block', onPress: this.askBlockUser },
          { name: 'Clear chat', onPress: this.clearMessages },
        ]
      else
        return [
          { name: 'Clear chat', onPress: this.clearMessages },
        ]
    } else
      return []
  }

  @transaction
  async clearMessages(): Promise<void> {
    await Firebase.users.doc(App.user.id).collection('chatRooms')
      .doc(this.roomId).set({ clearChatTime: Date.now() / 1000 }, { merge: true })
    this.reload()
    App.social.chatList.clearLastMessage(this.roomId)
  }

  @transaction
  private async muteChat(): Promise<void> {
    await this.setMuteChat(Bool.True)
  }

  private async setMuteChat(status: Bool): Promise<void> {
    let apiPath = 'goals/chat/mute'
    if (this.chatWindowType === ChatWindowType.Challenge)
      apiPath = 'users/challenge/chat/mute'
    const response = await Api.call('PUT', apiPath, { id: this.roomId, status })
    this.chatInfo.is_mute = status
  }

  @transaction
  private askUnfriendUser(): void {
    Alert.alert('', 'This will remove the user from your friend list. Are your sure?', [
      { text: 'No' },
      { text: 'Yes', onPress: this.unfriendUser },
    ])
  }

  @transaction
  private async unfriendUser(): Promise<void> {
    const friendId = this.chatInfo.memberIds[0]
    await Api.call('DELETE', 'network/friend', { friend_id: friendId })
    await this.updateUserChatStatus(friendId, ChatStatus.Unfriend)
    await this.updateUserChatStatus(App.user.id, ChatStatus.Unfriend)
    this.reload()
  }

  @transaction
  private askBlockUser(): void {
    Alert.alert('', 'Are you sure, you want to block this user? After blocking user will not reflect anywhere in the App. You will not able to see user profile.', [
      { text: 'No' },
      { text: 'Yes', onPress: this.blockUser },
    ])
  }

  @transaction
  private async blockUser(): Promise<void> {
    const friendId = this.chatInfo.memberIds[0]
    await Api.call('POST', 'users/blockUser', { _id: friendId })
    await this.updateUserChatStatus(friendId, ChatStatus.Blocked)
    await this.updateUserChatStatus(App.user.id, ChatStatus.Blocked)
    this.reload()
  }

  @transaction
  private async updateUserChatStatus(userId: string, chat_status: ChatStatus): Promise<void> {
    await Firebase.users.doc(userId).collection('chatRooms')
      .doc(this.roomId).set({ chat_status }, { merge: true })
  }

  @transaction
  private async updateUserGroupChatStatus(userId: string, group_chat_status: GroupChatStatus): Promise<void> {
    await Firebase.users.doc(userId).collection('chatRooms')
      .doc(this.roomId).set({ group_chat_status }, { merge: true })
  }

  @transaction
  reload(): void {
    this.chatInfo = new ChatRoom()
    if (this.messagesQueryUnsubscribe) {
      this.messagesQueryUnsubscribe()
      this.messagesQueryUnsubscribe = undefined
    }
    if (this.userChatStatusUnsubscribe) {
      this.userChatStatusUnsubscribe()
      this.userChatStatusUnsubscribe = undefined
    }
  }

  @transaction
  observeUserAndGroupChatStatus(userId: string): void {
    if (this.userChatStatusUnsubscribe) {
      this.userChatStatusUnsubscribe()
      this.userChatStatusUnsubscribe = undefined
    }
    const query = Firebase.users.doc(userId).collection('chatRooms').doc(this.roomId)
    this.userChatStatusUnsubscribe = query.onSnapshot(async snapshot => {
      const data = snapshot.data()
      if (data) {
        const chatStatus = data['chat_status'] as ChatStatus
        const groupChatStatus = data['group_chat_status'] as GroupChatStatus
        standalone(() => Transaction.run(() => {
          this.chatInfo.updateStatus(chatStatus, groupChatStatus)
        }))
      }
    })
  }

  isActive(): boolean {
    const result = (this.chatInfo.type === ChatType.SingleChat && this.chatInfo.chat_status === ChatStatus.Active) ||
      (this.chatInfo.type === ChatType.GroupChat && this.chatInfo.group_chat_status === GroupChatStatus.Active)
    return result
  }

  canJoin(): boolean {
    const result = this.chatInfo.type === ChatType.GroupChat &&
      this.chatInfo.group_chat_status === GroupChatStatus.Observer
    return result
  }
}

//#region ObservableObject classes for rendering

export class ObservableObjectGiftedMessage extends ObservableObject implements GiftedMessage {
  _id: string = ''
  text: string = ''
  createdAt: number = 0
  user: ObservableObjectGiftedUser = new ObservableObjectGiftedUser()
  image?: string | undefined = undefined
  video?: string | undefined = undefined
  audio?: string | undefined = undefined
  system?: boolean | undefined = undefined
  sent?: boolean | undefined = undefined
  received?: boolean | undefined = undefined
  pending?: boolean | undefined = undefined
  quickReplies?: ObservableObjectGiftedQuickReplies | undefined = undefined
}

export class ObservableObjectGiftedUser extends ObservableObject implements GiftedUser {
  _id: string = ''
  name: string = ''
  avatar: string = ''
}

export class ObservableObjectGiftedQuickReplies extends ObservableObject implements GiftedQuickReplies {
  type: 'radio' | 'checkbox' = 'radio'
  values: ObservableObjectGiftedReply[] = []
  keepIt?: boolean | undefined = undefined
}

export class ObservableObjectGiftedReply extends ObservableObject implements GiftedReply {
  title: string = ''
  value: string = ''
  messageId: string = ''
}

//#endregion
