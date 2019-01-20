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

  member: string

  ngOnInit() {
  }

  removeMember(event) {
    this.member = event.target.id

    let body = new URLSearchParams()
    body.set("groupname", this.data.groupname)
    body.set("member", this.member)

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    }

    this.httpClient.post("/removemember", body.toString(), httpOptions)
    .subscribe(res => {
      console.log(res)

      //this.router.navigate(["/members"])
    })
  }
}