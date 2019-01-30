import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss']
})

export class PartnerComponent implements OnInit {
  constructor(
    public data: DataService,
    private httpClient: HttpClient
  ) { }

  ngOnInit() {
    this.loadPartner()
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
      if (res.partner) {
        this.data.partnerWishlist = res.partnerwishlist
        this.data.partner = res.partner
      } else {
        //this.data.partnerWishlist = []
        //this.data.partner = ""
      }
    })
  }
}