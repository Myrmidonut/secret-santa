import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})

export class GroupsComponent implements OnInit {
  constructor(
    private data: DataService,
    private httpClient: HttpClient,
    private router: Router
  ) { }

  combinedGroups: any[]

  ngOnInit() {
    this.checkLoginStatus()
  }

  checkLoginStatus() {
    if (this.data.demo) {
      this.combinedGroups = this.data.demoGroups
    } else {
      let body = new URLSearchParams()

      this.httpClient.post<{username: string}>("/loginstatus", body.toString())
      .subscribe(res => {
        if (res.username) {
          this.data.username = res.username

          this.loadGroups()
        } else {
          this.router.navigate(["/"])
        }
      })
    }
  }

  onClick(groupname) {
    this.data.groupname = groupname
  }

  loadGroups() {
    let body = new URLSearchParams()

    this.httpClient.post<{groups: string[], groupsowner: string[], groupslaunched: string[]}>("/groups", body.toString())
    .subscribe(res => {
      this.data.groups = res.groups
      this.data.groupsowner = res.groupsowner
      this.data.groupslaunched = res.groupslaunched
      let combinedGroupsTemp = []

      res.groups.map(e => {
        if (res.groupsowner.includes(e)) {
          if (res.groupslaunched.includes(e)) {
            combinedGroupsTemp.push({groupname: e, owner: true, launched: true})
          } else {
            combinedGroupsTemp.push({groupname: e, owner: true, launched: false})
          }
        } else {
          if (res.groupslaunched.includes(e)) {
            combinedGroupsTemp.push({groupname: e, owner: false, launched: true})
          } else {
            combinedGroupsTemp.push({groupname: e, owner: false, launched: false})
          }
        }
      })

      this.combinedGroups = combinedGroupsTemp
    })
  }
}