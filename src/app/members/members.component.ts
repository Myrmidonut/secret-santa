import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})

export class MembersComponent implements OnInit {
  constructor(
    public data: DataService,
    private httpClient: HttpClient
  ) { }

  confirmRemove: String = ""

  ngOnInit() {
    this.loadPartner()
  }

  confirmRemoveMember(member) {
    this.confirmRemove = member
  }

  removeMember(member) {
    if (this.data.demo) {
      const index = this.data.demoGroups[this.data.demoGroupIndex].members.indexOf(member)
      this.data.demoGroups[this.data.demoGroupIndex].members.splice(index, 1)
      this.data.members = this.data.demoGroups[this.data.demoGroupIndex].members

      if (this.data.partner === member) {
        this.data.demoGroups[this.data.demoGroupIndex].partner = undefined
        this.data.partner = undefined
      }
    } else {
      let body = new URLSearchParams()
      body.set("groupname", this.data.groupname)
      body.set("member", member)

      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/x-www-form-urlencoded"
        })
      }

      this.httpClient.post<{members: string[]}>("/removemember", body.toString(), httpOptions)
      .subscribe(res => {
        this.data.members = res.members
      })
    }
  }

  loadPartner() {
    if (this.data.demo) {
      this.data.partner = this.data.demoGroups[this.data.demoGroupIndex].partner
    } else {
      let body = new URLSearchParams()
      body.set("groupname", this.data.groupname)

      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/x-www-form-urlencoded"
        })
      }

      this.httpClient.post<{partner: string, partnerwishlist: any[]}>("/partner", body.toString(), httpOptions)
      .subscribe(res => {
        this.data.partner = res.partner
      })
    }
  }
}