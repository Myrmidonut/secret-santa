import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  constructor() { }

  username: string

  myWishlist: string[]
  partnerWishlist: string[]
  groups: string[]
  groupsowner: string[]

  groupname: string
  owner: string
  members: string[]
  partner: string
  launched: boolean

  loadGroups() {
    // fetch from api
    this.groups = ["Family", "Work", "Friends"]
  }

  loadMembers() {
    // fetch from api
    this.members = ["Jim", "John", "Joe", "Jeff"]
  }

  loadMyWishlist() {
    // fetch from api
    this.myWishlist = ["chocolate", "toy car", "ball"]
  }

  loadPartnerWishlist() {
    // fetch from api
    this.partnerWishlist  = ["wine", "TV"]
  }

  inviteToGroup() {
    // 
  }

  joinGroup() {
    // send group name and code
  }

  leaveGroup() {
    // send group name
  }
}