import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})

export class GroupComponent implements OnInit {
  constructor(
    private httpClient: HttpClient,
    public data: DataService,
    private router: Router
  ) { }

  code: string
  leaveButton: string = "Leave Group"
  confirmLeave: boolean = false
  confirmLeaveGroupClass: string = ""

  ngOnInit() {
    this.loadGroup()
  }

  leaveGroup() {
    if (!this.confirmLeave) {
      this.leaveButton = "Confirm leave"
      this.confirmLeave = true
      this.confirmLeaveGroupClass = "confirmLeaveGroupClass"
    } else {
      let body = new URLSearchParams()
      body.set("groupname", this.data.groupname)

      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/x-www-form-urlencoded"
        })
      }

      this.httpClient.post("/leave", body.toString(), httpOptions)
      .subscribe(res => {
        this.router.navigate(["/groups"])
      })
    }
  }

  loadGroup() {
    let body = new URLSearchParams()
    body.set("groupname", this.data.groupname)

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    }

    this.httpClient.post<{owner: string, members: string[], launched: boolean, code: string}>("/group", body.toString(), httpOptions)
    .subscribe(res => {
      this.data.owner = res.owner
      this.data.members = res.members
      this.data.launched = res.launched

      if (res.code) this.data.code = res.code
    })
  }

  deleteGroup() {
    let body = new URLSearchParams()
    body.set("groupname", this.data.groupname)

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    }

    this.httpClient.post("/deletegroup", body.toString(), httpOptions)
    .subscribe(res => {
      this.router.navigate(["/groups"])
    })
  }

  launchGroup() {
    let body = new URLSearchParams()
    body.set("groupname", this.data.groupname)

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    }

    this.httpClient.post<{launched: boolean}>("/launch", body.toString(), httpOptions)
    .subscribe(res => {
      this.data.launched = res.launched
    })
  }
}