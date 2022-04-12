//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { GroupAdmin } from 'models/data/ChatGroup'
import { GroupChatStatus, RemoveMemberStatus } from 'models/data/ChatRoom'
import { UserInfo } from 'models/data/UserInfo'
import { Alert } from 'react-native'
import { cached, Ref, ObservableObject, unobservable, transaction } from 'reactronic'
import { Api, ApiData } from '../Api'
import { App } from '../App'
import { ActionItem } from 'components/ActionModal'
import { Chat } from './Chat'

export class GroupInfo extends ObservableObject {
  @unobservable private readonly chat: Chat

  search: string = ''
  selectedTemates: UserInfo[] = []

  constructor(chat: Chat) {
    super()
    this.chat = chat
  }

  @cached
  getParticipants(): UserInfo[] {
    let result: UserInfo[]
    if (this.search)
      result = this.chat.chatInfo.members.filter(x => x.first_name.includes(this.search) || x.last_name.includes(this.search))
    else
      result = this.chat.chatInfo.members.slice()
    return result
  }

  @transaction
  showModalForMember(user: UserInfo): void {
    const actions: ActionItem[] = []
    if (App.user.id === this.chat.chatInfo.adminData?.user_id && user.getId() !== this.chat.chatInfo.adminData?.user_id)
      actions.push({ name: 'Make group admin', onPress: () => this.askMakeGroupAdmin(user) })
    actions.push({ name: `Remove ${user.first_name} ${user.last_name}`, onPress: () => this.askRemoveUserFromGroup(user) })
    App.actionModal.show(actions)
  }

  @transaction
  private askMakeGroupAdmin(user: UserInfo): void {
    Alert.alert('', `Are you sure to make ${user.first_name} ${user.last_name} group admin?`, [
      { text: 'No' },
      { text: 'Yes', onPress: () => void this.makeGroupAdmin(user) },
    ])
  }

  @transaction
  private async makeGroupAdmin(user: UserInfo): Promise<void> {
    const response = await Api.call('POST', 'chat/change_admin', {
      group_id: this.chat.chatInfo.group_id,
      members: user.getId(),
    })
    this.chat.chatInfo.adminData = new GroupAdmin()
    this.chat.chatInfo.adminData.user_id = user.getId()
    this.chat.chatInfo.adminData.first_name = user.first_name
    this.chat.chatInfo.adminData.last_name = user.last_name
  }

  @transaction
  private askRemoveUserFromGroup(user: UserInfo): void {
    Alert.alert('', `Are you sure to remove ${user.first_name} ${user.last_name} from this group?`, [
      { text: 'No' },
      { text: 'Yes', onPress: () => void this.removeUser(user) },
    ])
  }

  @transaction
  private async removeUser(user: UserInfo): Promise<void> {
    const response = await Api.call('POST', 'chat/paticipants/delete', { // typo in API
      group_id: this.chat.chatInfo.group_id,
      members: user.getId(),
      status: RemoveMemberStatus.Delete,
    })
    await this.chat.group.updateUserGroupChatStatusInChatRoom(this.chat.chatInfo.group_id,
      user.getId(), GroupChatStatus.NoLongerPartOfGroup)
    if (this.chat.chatInfo.members_count !== undefined)
      this.chat.chatInfo.members_count--
    const i = this.chat.chatInfo.memberIds.indexOf(user.getId())

    const chatInfoMemberIdsMutable = this.chat.chatInfo.memberIds.toMutable()
    chatInfoMemberIdsMutable.splice(i, 1)
    this.chat.chatInfo.memberIds = chatInfoMemberIdsMutable

    const chatInfoMembersMutable = this.chat.chatInfo.members.toMutable()
    chatInfoMembersMutable.splice(i, 1)
    this.chat.chatInfo.members = chatInfoMembersMutable
  }

  @transaction
  async openAddTemates(): Promise<void> {
    await App.addTemates.open({
      tematesToAddRef: Ref.to(this).selectedTemates,
      disabledTematesRef: Ref.to(this.chat.chatInfo).members,
      onApply: this.addNewGroupMembers,
    })
  }

  @transaction
  private async addNewGroupMembers(): Promise<void> {
    const chatInfoMembersMutable = this.chat.chatInfo.members.toMutable()
    chatInfoMembersMutable.push(...this.selectedTemates)
    this.chat.chatInfo.members = chatInfoMembersMutable

    const chatInfoMemberIdsMutable = this.chat.chatInfo.memberIds.toMutable()
    chatInfoMemberIdsMutable.push(...this.selectedTemates.map(x => x.getId()))
    this.chat.chatInfo.memberIds = chatInfoMemberIdsMutable

    this.chat.chatInfo.members_count = this.chat.chatInfo.members.length
    await Api.call<ApiData>('POST', 'chat/edit_group', { group_id: this.chat.roomId, memberIds: this.chat.chatInfo.memberIds })
    for (const member of this.selectedTemates)
      await this.chat.group.updateUserGroupChatStatusInChatRoom(this.chat.roomId, member.getId(), GroupChatStatus.Active)
    await this.chat.group.addMembersToChatRoom(this.chat.roomId, this.chat.chatInfo.memberIds)
    this.selectedTemates = []
  }
}
