import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service"
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {
  constructor(
    public data: DataService,
    private httpClient: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.checkLoginStatus()
  }

  checkLoginStatus() {
    this.httpClient.get<{username: string}>("/loginstatus")
    .subscribe(res => {
      if (res.username) {
        this.data.username = res.username
      }
    })
  }

  logout() {
    if (this.data.demo) {
      window.location.href = "/"
    } else {
      this.httpClient.get("/logout")
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