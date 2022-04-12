//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { monitor, ObservableObject, transaction } from 'reactronic'
import { Interest } from 'models/data/Interest'
import { Monitors } from '../Monitors'
import { Api, ApiData } from '../Api'
import { ChatRoom, ChatType, Visibility } from 'models/data/ChatRoom'
import { App } from '../App'
import { Firebase } from '../Firebase'
import { ImageSelection } from '../ImageSelection'

export class EditGroup extends ObservableObject {
  info?: ChatRoom = undefined
  groupId: string = ''
  imageUri?: string = undefined
  name: string = ''
  description: string = ''
  visibility?: Visibility = undefined
  editableByMembers?: boolean = undefined

  adminId?: string = undefined
  showNameValidationError: boolean = false

  @transaction
  async setup(): Promise<void> {
    if (App.chat) {
      this.info = App.chat.chatInfo
      this.groupId = App.chat.roomId
      const chatInfo = App.chat.chatInfo
      this.imageUri = chatInfo.image
      this.name = chatInfo.group_title
      this.description = chatInfo.description ?? ''
      this.editableByMembers = chatInfo.editableByMembers
      this.visibility = chatInfo.visibility
      this.showNameValidationError = false
      this.adminId = chatInfo.adminData?.user_id
      if (chatInfo.interests) {
        const interests = App.interests
        await interests.load()
        interests.selected = chatInfo.interests
          .map(x => interests.all.find(y => x.interest_id === y._id))
          .filter(x => x !== undefined) as Interest[]
      }
    } else
      throw new Error('Chat is not initialized')
  }

  @transaction
  async selectImage(): Promise<void> {
    this.imageUri = await ImageSelection.runImagePicker()
  }

  @transaction
  showVisibilitySelection(): void {
    App.actionModal.show([Visibility.Private, Visibility.Temates, Visibility.Public].map(v => ({
      name: Visibility.toString(v),
      onPress: () => this.selectVisibility(v),
    })))
  }

  @transaction
  private selectVisibility(visibility: Visibility): void {
    this.visibility = visibility
  }

  get formattedVisibility(): string { return this.visibility ? Visibility.toString(this.visibility) : '' }

  @transaction
  @monitor(Monitors.Loading)
  async submit(): Promise<string | undefined> {
    this.name = this.name.trim()
    if (!this.validate() || !App.chat) return undefined
    let imageUri: string | undefined
    if (this.imageUri && this.imageUri !== App.chat?.chatInfo.image)
      imageUri = await Api.awsBucket.uploadFile(this.imageUri, 'image/jpg', 'groupIcon')
    const chatRoom = new ChatRoom()
    chatRoom.group_id = this.groupId
    chatRoom.group_title = this.name
    chatRoom.description = this.description
    chatRoom.image = imageUri
    chatRoom.type = ChatType.GroupChat
    chatRoom.interests = App.interests.selected.map(x => ({ interest_id: x._id, name: x.name }))
    if (this.adminId === App.user.id) {
      if (this.editableByMembers !== undefined)
        chatRoom.editableByMembers = this.editableByMembers
      if (this.visibility !== undefined)
        chatRoom.visibility = this.visibility
    }
    const response = await Api.call<ApiData>('POST', 'chat/edit_group', chatRoom)
    await Firebase.chats.doc(this.groupId).set({
      group_title: chatRoom.group_title,
      image: imageUri,
      type: chatRoom.type,
      created_at: chatRoom.created_at,
      chatWindowType: chatRoom.chatWindowType,
    }, { merge: true })
    App.chat.chatInfo.group_title = chatRoom.group_title
    App.chat.chatInfo.description = chatRoom.description
    App.chat.chatInfo.image = chatRoom.image
    App.chat.chatInfo.interests = chatRoom.interests.slice()
    App.chat.chatInfo.editableByMembers = chatRoom.editableByMembers
    App.chat.chatInfo.visibility = chatRoom.visibility
    return this.groupId
  }

  @transaction
  private validate(): boolean {
    let result = true

    if (!this.name) {
      this.showNameValidationError = true
      result = false
    } else
      this.showNameValidationError = false

    return result
  }
}
