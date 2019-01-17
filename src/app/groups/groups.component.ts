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

  groups: string[]
  owner: string[]
  combined: any[]

  ngOnInit() {
    this.loadGroups()
  }

  loadGroups() {
    this.httpClient.get("/groups")
    .subscribe(res => {
      console.log(res)

      this.groups = this.data.groups
      this.owner = this.data.groupsowner

      let combined = []

      this.groups.forEach(e => {
        this.owner.forEach(f => {
          if (e === f) {
            combined.push({e: f})
          } else {
            combined.push({e: "user"})
          }
        })
      })

      this.combined = combined

      console.log(this.combined)

    })
  }
}