import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";

@Component({
  selector: 'app-mywishlist',
  templateUrl: './mywishlist.component.html',
  styleUrls: ['./mywishlist.component.scss']
})

export class MywishlistComponent implements OnInit {
  constructor(
    public data: DataService,
    private httpClient: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.getWishlist()
  }

  getWishlist() {
    let body = new URLSearchParams()
    body.set("groupname", this.data.groupname)

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    }

    this.httpClient.post<{wishlist: string[]}>("/getwishlist", body.toString(), httpOptions)
    .subscribe(res => {
      this.data.myWishlist = res.wishlist
    })
  }

  newWishlist() {
    this.data.myWish = -1

    this.router.navigate(["/mywish"])
  }
 
  editWishlist(i) {
    this.data.myWish = i

    this.router.navigate(["/mywish"])
  }

  deleteWishlist(i) {
    console.log(i)

    let body = new URLSearchParams()
    body.set("groupname", this.data.groupname)
    body.set("mywish", i)

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    }

    this.httpClient.post<{wishlist: string[]}>("/deletewishlistentry", body.toString(), httpOptions)
    .subscribe(res => {
      this.data.myWishlist = res.wishlist
    })
  }
}