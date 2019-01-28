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
  code: string
  launched: boolean
  owner: string
  members: string[]
  myWishlist: any[]
  myWish: number
  partner: string
  partnerWishlist: any[]
}