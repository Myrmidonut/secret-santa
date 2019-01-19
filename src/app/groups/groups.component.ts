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

  ngOnInit() {
    this.loadGroups()
  }

  onClick(event) {
    this.data.groupname = event.target.innerText
  }

  loadGroups() {
    this.httpClient.get<{groups: string[], groupsowner: string[]}>("/groups")
    .subscribe(res => {
      this.data.groups = res.groups
      this.data.groupsowner = res.groupsowner
    })
  }
}