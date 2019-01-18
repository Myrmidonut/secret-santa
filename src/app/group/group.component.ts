import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})

export class GroupComponent implements OnInit {
  constructor(
    private httpClient: HttpClient,
    private data: DataService
  ) { }

  groupname: string
  owner: string
  members: string[]

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

    this.httpClient.post<{groupname: string, owner: string, members: string[]}>("/group", body.toString(), httpOptions)
    .subscribe(res => {
      console.log(res)

      this.data.owner = res.owner
      this.data.members = res.members
    })
  }
}