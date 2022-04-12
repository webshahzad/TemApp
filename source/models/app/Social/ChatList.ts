//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { monitor, Reentrance, reentrance, ObservableObject, transaction, reaction, unobservable, cached, nonreactive } from 'reactronic'
import { Api, ApiData } from '../Api'
import { populate } from 'common/populate'
import { ChatRoom, ChatType } from 'models/data/ChatRoom'
import { Firebase } from '../Firebase'
import { MediaUploadStatus, Message, MessageType } from 'models/data/Message'
import { App } from '../App'
import { Bool } from 'common/constants'
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { Monitors } from '../Monitors'
import { Alert } from 'react-native'



export class ChatList extends ObservableObject {
  @unobservable private readonly apiBaseUrl: string
  chats: ChatRoom[] = []
  filter?: string = undefined
  value?:number;
  // chatType?:number = App.user.chatType


  private search?: string = undefined
  private chatSubscriptions = new Map<string, () => void>()
  // private chatListSubscription?: () => void = undefined
  private pagination: boolean


 
  constructor() {     
    super()
    this.apiBaseUrl = `chat/chatList?type=${App?.user.chatType}`
    this.pagination = false
  }

  @cached
  getFilteredChats(): ChatRoom[] {
    let result: ChatRoom[]
    if (this.filter !== undefined && this.filter.length > 0) {
      const filter = this.filter
      result = this.chats.filter(c => c.group_title.toLowerCase().includes(filter.toLowerCase()))
    } else {
      result = this.chats.slice()
    }
    return result
  }

  @transaction
  showFilter(): void {
    this.filter = ''
  }

  @transaction
  closeFilter(): void {
    this.filter = undefined
  }

  @transaction
  setFilter(value: string): void {
    this.filter = value
  }

  @transaction
  clearFilter(): void {
    this.filter = ''
  }

  @transaction
  clearLastMessage(id: string): void {
    const chat = this.chats.find(x => x.chat_room_id === id)
    if (chat)
      chat.lastMessage = undefined
  }

  @transaction
  setSearch(value: string): void {
    this.search = value
  }

  @reaction
  async onSearchChange(): Promise<void> {
    if (this.search !== undefined)
      await this.load()
  }

  @reaction
  @monitor(Monitors.ChatListLoading)
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async load(): Promise<void> {
    if (!Api.isAuthenticated())
      return

    const params = new URLSearchParams()
    if (this.search)
      params.append('search_by', this.search)
    // TODO: refactor
    if (this.pagination)
      params.append('page', '1')
    let query = params.toString()
    if (query)
      query = '?' + query
    const response = await Api.call<ApiData<ChatRoom[]>>('GET', `chat/chatList?type=${App.user.stored.chatType} ${query}`)
    
    this.chats = []
    for (const chatInfo of response.data.filter(x => x.is_deleted !== Bool.True)) {
      let chat = this.chats.find(x => x.chat_room_id === chatInfo.chat_room_id)
      if (!chat) {
        chat = new ChatRoom()
        const chatsMutable = this.chats.toMutable()
        chatsMutable.push(chat)
        this.chats = chatsMutable
      }
      populate(chat, chatInfo)
    }

    if (!this.pagination) {
      for (const chat of nonreactive(() => this.chats)) {
        this.initChatSubscription(chat)
      }
    }
  }

  private initChatSubscription(chat: ChatRoom): void {
    let cancelSubscription = this.chatSubscriptions.get(chat.chat_room_id)
    this.chatSubscriptions = this.chatSubscriptions.toMutable()
    this.chatSubscriptions.delete(chat.chat_room_id)
    if (cancelSubscription)
      cancelSubscription()
    cancelSubscription = Firebase.chats.doc(chat.chat_room_id).collection('messages')
      .orderBy('time', 'desc').onSnapshot(snapshot => this.handleMessagesSnapshot(snapshot, chat))
    if (chat.type === ChatType.SingleChat) {
      chat.group_title = `${chat.members[0].first_name} ${chat.members[0].last_name}`
      chat.image = chat.members[0].profile_pic
    }
    this.chatSubscriptions.set(chat.chat_room_id, cancelSubscription)
  }

  @transaction
  @reentrance(Reentrance.WaitAndRestart)
  private async handleMessagesSnapshot(snapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>, chat: ChatRoom): Promise<void> {
    let lastMessage: Message | undefined
    if (!snapshot.empty) {
      /*first check if the message type is media or text,
       if this is of media type (i.e. image or video), then check if the sender id is of current user or some other user
       if this is of current user just return the message object. If this is of other user, check if the media uploading status is uploaded or uploading in progress . If this is uploaded, return the message object else traverse the documents for next message  and repeat the process */
      for (const item of snapshot.docs) {
        const message = item.data() as Message
        if (message.type === MessageType.Text) {
          if (message.chatType === ChatType.GroupChat) {
            if (message.userIds?.includes?.(App.user.id)) {
              lastMessage = message
              break
            }
          }
          else {
            lastMessage = message
            break
          }
        }
        else if (message.type === MessageType.Image || message.type === MessageType.Video) {
          if (message.senderId === App.user.id) {
            lastMessage = message
            break
          }
          else {
            if (message.uploadingStatus === MediaUploadStatus.Uploaded) {
              if (message.chatType === ChatType.GroupChat) {
                if (message.userIds?.includes?.(App.user.id)) {
                  lastMessage = message
                  break
                }
              }
              else {
                lastMessage = message
                break
              }
            }
          }
        }
      }
    }
    if (!lastMessage) {
      lastMessage = new Message()
      lastMessage.chat_room_id = chat.chat_room_id
    }
    const chatInfo = (await Firebase.users.doc(App.user.id).collection('chatRooms').doc(chat.chat_room_id).get()).data() as ChatRoom
    if (chatInfo?.clearChatTime !== undefined && chatInfo?.clearChatTime > lastMessage.time) {
      const message = new Message()
      message.chat_room_id = chat.chat_room_id
      message.time = lastMessage.time
      message.updatedAt = lastMessage.updatedAt
      lastMessage = message
    }
    if (lastMessage.text && chat.is_deleted === Bool.True)
      chat.is_deleted = Bool.False
    if (!lastMessage.time)
      lastMessage.time = chat.created_at / 1000
    chat.lastMessage = lastMessage

    const doc = (await Firebase.users.doc(App.user.id).collection('chatRooms').doc(chat.chat_room_id).get()).data()
    let query: FirebaseFirestoreTypes.Query = Firebase.chats.doc(chat.chat_room_id).collection('messages')
    if (doc?.lastSeen)
      query = query.where('time', '>', doc.lastSeen)
    const messages = (await query.get()).docChanges().filter(sn => {
      const m = sn.doc.data() as Message
      if (m.senderId !== App.user.id) {
        if (m.userIds && !m.userIds.includes?.(App.user.id))
          return false
        if (m.type === MessageType.Text)
          return true
        else if (m.type === MessageType.Image || m.type === MessageType.Video)
          return m.uploadingStatus === MediaUploadStatus.Uploaded
      }
      return false
    })
    chat.unreadCount = messages.length

    if (this.chats.every(x => x.lastMessage)) {
      this.chats = this.chats.toMutable().sort((a, b) => {
        let result = 0
        if (a.lastMessage && b.lastMessage)
          result = b.lastMessage.time - a.lastMessage.time
        return result
      })
    }
  }
}
