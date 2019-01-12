import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  constructor(private httpClient: HttpClient) { }

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

  createGroup(data) {
    // send group name to api
    // get name and code back

    console.log("data: ", data)

    const httpOptions = {
      headers: new HttpHeaders({
        //'Content-Type':  'application/x-www-form-urlencoded'
        'Content-Type':  'application/json'
      })
    }

    this.httpClient.post("/create", data, httpOptions)
    .subscribe(res => {
      console.log(res)
    })

    /*
    fetch("/create", {
      method: 'post',
      body: new URLSearchParams(data)
    })
    .then(response => response.text())
    .then(data => {
      console.log("return: ", data)
    })
    .catch(error => console.log(error))
    */
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