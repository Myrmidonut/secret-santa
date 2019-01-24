import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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
    private data: DataService,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.wishlistForm = this.formBuilder.group({
      title: ["", Validators.required],
      description: [""],
      link: [""]
    })
  }

  wishlistForm: FormGroup
  submitted: Boolean = false
  success: Boolean = false

  ngOnInit() {
    this.data.myWishlist = [
      {
        title: "test",
        description: "a long test",
        link: "http://www.google.com"
      },
      {
        title: "toy car",
        description: "a superfast red and blue remote control toy car",
        link: "www.toysrus.com/toycar"
      }
    ]

    this.getWishlist()
  }

  onSubmit() {
    this.submitted = true

    if (this.wishlistForm.invalid) {
      return;
    }

    this.success = true

    this.updateWishlist(this.wishlistForm.value)
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

  updateWishlist(formdata) {
    let body = new URLSearchParams()
    body.set("groupname", this.data.groupname)
    body.set("title", formdata.title)
    body.set("description", formdata.description)
    body.set("link", formdata.link)

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    }

    this.httpClient.post("/updatewishlist", body.toString(), httpOptions)
    .subscribe(res => {
      this.getWishlist()
    })
  }
}