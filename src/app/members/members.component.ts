import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})

export class MembersComponent implements OnInit {
  constructor(
    private data: DataService,
    private httpClient: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadPartner()
  }

  removeMember(member) {
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

  loadPartner() {
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