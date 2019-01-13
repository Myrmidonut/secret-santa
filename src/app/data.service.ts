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
  user: string = "testuser"

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

  createGroup(formdata, owner) {
    // send groupname to api
    // get name and code back

    let body = new URLSearchParams();
    body.set("groupname", formdata.groupname)
    body.set("owner", owner)

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    }

    this.httpClient.post("/create", body.toString(), httpOptions)
    .subscribe(res => {
      console.log(res)
    })
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

  login(formdata) {
    console.log(formdata)

    let body = new URLSearchParams();
    body.set("username", formdata.username)
    body.set("password", formdata.password)

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    }

    this.httpClient.post("/login", body.toString(), httpOptions)
    .subscribe(res => {
      console.log(res)
    });
  }

  register(formdata) {
    console.log(formdata)

    let body = new URLSearchParams();
    body.set("username", formdata.username)
    body.set("password", formdata.password)
    body.set("email", formdata.email)

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    }

    this.httpClient.post("/register", body.toString(), httpOptions)
    .subscribe(res => {
      console.log(res)
    });
  }
}