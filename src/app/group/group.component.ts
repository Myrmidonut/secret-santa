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
    private data: DataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadGroup()
  }

  loadGroup() {
    let body = new URLSearchParams()
    body.set("groupname", this.data.groupname)

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    }

    this.httpClient.post<{owner: string, members: string[]}>("/group", body.toString(), httpOptions)
    .subscribe(res => {
      this.data.owner = res.owner
      this.data.members = res.members
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
      console.log(res)
      
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

    this.httpClient.post("/launch", body.toString(), httpOptions)
    .subscribe(res => {
      console.log(res)
    })
  }

  inviteMember() {
    console.log("invite member")
  }
}