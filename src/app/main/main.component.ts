import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service"
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {
  constructor(
    public data: DataService,
    private httpClient: HttpClient
  ) { }

  ngOnInit() {
    this.checkLoginStatus()
  }

  checkLoginStatus() {
    if (!this.data.demo) {
      let body = new URLSearchParams()

      this.httpClient.post<{username: string}>("/loginstatus", body.toString())
      .subscribe(res => {
        if (res.username) {
          this.data.username = res.username
        }
      })
    }
  }

  logout() {
    if (this.data.demo) {
      window.location.href = "/"
    } else {
      let body = new URLSearchParams()

      this.httpClient.post("/logout", body.toString())
      .subscribe(res => {
        window.location.href = "/"
      })
    }
  }

  demo() {
    this.data.demo = true
    this.data.username = "Demo User"
    this.data.groups = ["Family", "Work"]
    this.data.groupsowner = ["Family"]
    this.data.groupslaunched = ["Work"]
  }
}