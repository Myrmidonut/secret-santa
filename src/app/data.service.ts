import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  myWishlist: string[]
  partnerWishlist: string[]
  groups: string[]
  members: string[]

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

  createGroup() {
    // send group name to api
    // get name and code back
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

  constructor() { }
}