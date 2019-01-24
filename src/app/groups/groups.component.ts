import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';

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
    if (this.data.username) {
      this.loadGroups()
    } else {
      this.combinedGroups = [
        {
          name: "Work Xmas",
          owner: "Jim",
          launched: false
        },
        {
          name: "Family",
          launched: true
        }
      ]
    }
  }

  onClick(event) {
    this.data.groupname = event.target.innerText
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
            combinedGroupsTemp.push({name: e, owner: true, launched: true})
          } else {
            combinedGroupsTemp.push({name: e, owner: true, launched: false})
          }
        } else {
          if (res.groupslaunched.includes(e)) {
            combinedGroupsTemp.push({name: e, owner: false, launched: true})
          } else {
            combinedGroupsTemp.push({name: e, owner: false, launched: false})
          }
        }
      })

      this.combinedGroups = combinedGroupsTemp
    })
  }
}