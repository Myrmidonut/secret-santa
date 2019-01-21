import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  constructor() { }

  username: string

  groups: string[]
  groupsowner: string[]
  groupslaunched: string[]

  groupname: string
  owner: string
  members: string[]
  myWishlist: string[]
  partner: string
  partnerWishlist: any[]
  launched: boolean
}