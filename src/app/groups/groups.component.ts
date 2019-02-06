import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})

export class GroupsComponent implements OnInit {
  constructor(
    private data: DataService,
    private httpClient: HttpClient
  ) { }

  combinedGroups: any[]

  ngOnInit() {
    if (this.data.username && !this.data.demo) {
      this.loadGroups()
    } else if (this.data.demo) {
      this.combinedGroups = this.data.demoGroups
    }
  }

  onClick(groupname) {
    this.data.groupname = groupname
  }

  loadGroups() {
    this.httpClient.get<{groups: string[], groupsowner: string[], groupslaunched: string[]}>("/groups")
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