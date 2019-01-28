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
  }

  logout() {
    this.httpClient.get("/logout")
    .subscribe(res => {
      //this.router.navigate(["/"])

      window.location.href = "/"
    })
  }
}