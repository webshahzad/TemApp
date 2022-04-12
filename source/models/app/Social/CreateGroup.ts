import { useIsFocused } from '@react-navigation/native';
//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { monitor, ObservableObject, reaction, transaction } from 'reactronic'
import { UserInfo } from 'models/data/UserInfo'
import { Monitors } from '../Monitors'
import { Api, ApiData } from '../Api'
import { ChatRoom, ChatType, Visibility } from 'models/data/ChatRoom'
import { App } from '../App'
import { Firebase } from '../Firebase'
import { ImageSelection } from '../ImageSelection'

export class CreateGroup extends ObservableObject {
  imageUri?: string = undefined
  name: string = ''
  description: string = ''
  editableByMembers: boolean = true
  visibility: Visibility = Visibility.Private
  selectedTemates: UserInfo[] = []
  showNameValidationError: boolean = false
  showDescValidationError: boolean = false
  showInterestValidationError: boolean = false
  showParticipantsValidationError: boolean = false
  //createTem Progress percenteg
  createTemProfilePercenteg:number = 0;
  isProfilePic?: boolean = false;
  isUsername?: boolean = false;
  isDescription?: boolean = false;
  isTemmate?: boolean = false;
  isInterest?: boolean = false;
  isVisibility?: boolean = false;

  @reaction
  profilePicPercent(): void {
    if (this.imageUri && this.isProfilePic === false) {
      this.isProfilePic = true;
      this.createTemProfilePercenteg = this.createTemProfilePercenteg + 20;
    } else if (
      !this.imageUri&&
      this.isProfilePic === true
    ) {
      this.isProfilePic = false;
      this.createTemProfilePercenteg = this.createTemProfilePercenteg - 20;
    }
  }
  @reaction
  temUsernamePercent(): void {
    if (this.name?.trim().length > 2 && this.isUsername === false) {
      this.isUsername = true;
      this.createTemProfilePercenteg = this.createTemProfilePercenteg + 20;
    } else if (
      this.name?.trim().length < 2 &&
      this.isUsername === true
    ) {
      this.isUsername = false;
      this.createTemProfilePercenteg = this.createTemProfilePercenteg - 20;
    }
  }
  @reaction
  descPercent(): void {
    if (this.description?.trim().length > 2 && this.isDescription === false) {
      this.isDescription = true;
      this.createTemProfilePercenteg = this.createTemProfilePercenteg + 20;
    } else if (
      this.description?.trim().length < 2 &&
      this.isDescription === true
    ) {
      this.isDescription = false;
      this.createTemProfilePercenteg = this.createTemProfilePercenteg - 20;
    }
  }
  @reaction
  interestPercent(): void {
    if (App.interests.all?.length > 0 && this.isInterest === false) {
      this.isInterest = true;
      this.createTemProfilePercenteg = this.createTemProfilePercenteg + 20;
    } else if (
      App.interests.all.length < 0 &&
      this.isInterest === true
    ) {
      this.isInterest = false;
      this.createTemProfilePercenteg = this.createTemProfilePercenteg - 20;
    }
  }
  @reaction
  temmatePercent(): void {
    if (this.selectedTemates.length > 0 && this.isTemmate === false) {
      this.isTemmate = true;
      this.createTemProfilePercenteg = this.createTemProfilePercenteg + 20;
    } else if (
      this.selectedTemates.length< 0 &&
      this.isInterest === true
    ) {
      this.isInterest = false;
      this.createTemProfilePercenteg = this.createTemProfilePercenteg - 20;
    }
  }
  @reaction
  visibilityPercent(): void {
    if (this.visibility.length > 0 && this.isVisibility === false) {
      this.isVisibility = true;
      this.createTemProfilePercenteg = this.createTemProfilePercenteg + 20;
    } else if (
      this.visibility.length < 0 &&
      this.isVisibility === true
    ) {
      this.isVisibility = false;
      this.createTemProfilePercenteg = this.createTemProfilePercenteg - 20;
    }
  }
  @transaction
  reset(): void {
    this.imageUri = undefined
    this.name = ''
    this.description = ''
    this.selectedTemates = []
    this.showNameValidationError = false
    this.showParticipantsValidationError = false
    App.interests.selected = []
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
  @reaction
  isTemmateCheck():void{
    if(this.selectedTemates.length >0 ){
      App.user.isTemate = true
    }else if(this.selectedTemates.length <0){
      App.user.isTemate = false
    }
  }
 
  @reaction
  isInterestCheck():void{
    if( App.interests.selected.length >0 ){
      App.user.isInterest = true
    }else if(App.interests.selected.length <0){
      App.user.isInterest = false
    }
  }
  @transaction
  resetGroup():void{
      this.name ='',
      this.description =''
      this.imageUri = undefined
      this.visibility = undefined
      this.isInterest = undefined
  }

  @transaction
  private selectVisibility(visibility: Visibility): void {
    this.visibility = visibility
  }

  get formattedVisibility(): string { return Visibility.toString(this.visibility) }

  @transaction
  @monitor(Monitors.Loading)
  async submit(): Promise<string | undefined> {
    this.name = this.name.trim()
    if (!this.validate()) return undefined
    let imageUri: string | undefined
    if (this.imageUri)
      imageUri = await Api.awsBucket.uploadFile(this.imageUri, 'image/jpg', 'groupIcon')
    const chatRoom = new ChatRoom()
    chatRoom.group_title = this.name
    chatRoom.description = this.description
    chatRoom.image = imageUri
    chatRoom.type = ChatType.GroupChat
    chatRoom.editableByMembers = this.editableByMembers
    chatRoom.created_at = Date.now() / 1000
    chatRoom.members = this.selectedTemates.slice()
    chatRoom.memberIds = this.selectedTemates.map(x => x._id)
    chatRoom.interests = App.interests.selected.map(x => ({ interest_id: x._id, name: x.name }))
    chatRoom.visibility = this.visibility
    const response = await Api.call<ApiData<{ group_id: string }>>('POST', 'chat/create_group', chatRoom)
    const memberIdsMutable = chatRoom.memberIds.toMutable()
    memberIdsMutable.push(App.user.id)
    chatRoom.memberIds = memberIdsMutable
    await Firebase.chats.doc(response.data.group_id).set({
      group_title: chatRoom.group_title,
      image: imageUri,
      type: chatRoom.type,
      memberIds: memberIdsMutable,
      created_at: chatRoom.created_at,
      chatWindowType: chatRoom.chatWindowType,
    }, { merge: true })
    return response.data.group_id
  }

  @reaction
  protected async init(): Promise<void> {
    this.imageUri = undefined
    this.name = ''
    this.description = ''
    this.selectedTemates = []
    this.showNameValidationError = false
    this.showParticipantsValidationError = false
    App.interests.selected = []
  }

  @transaction
  private validate(): boolean {
    let result = true

    if (!this.name) {
      this.showNameValidationError = true
      result = false
    } else
      this.showNameValidationError = false

    if (!this.description) {
      this.showDescValidationError = true
      result = false
    } else
      this.showDescValidationError = false

    if (this.selectedTemates.length === 0) {
      this.showParticipantsValidationError = true
      result = false
    } else
      this.showParticipantsValidationError = false

    if (App.interests.selected.length === 0) {
      this.showInterestValidationError = true
      result = false
    } else
      this.showInterestValidationError = false

    return result
  }
}
