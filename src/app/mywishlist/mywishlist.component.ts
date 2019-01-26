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
    this.getWishlist()
  }

  onSubmit() {
    this.submitted = true

    if (this.wishlistForm.invalid) {
      return;
    }

    this.success = true

    this.addWishlist(this.wishlistForm.value)
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

  addWishlist(formdata) {
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

    this.httpClient.post("/addwishlist", body.toString(), httpOptions)
    .subscribe(res => {
      this.getWishlist()

      this.wishlistForm.setValue({
        title: "",
        description: "",
        link: ""
      })
    })
  }
 
  editWishlist(i) {
    console.log(i)

    this.wishlistForm.setValue({
      title: this.data.myWishlist[i].title,
      description: this.data.myWishlist[i].description,
      link: this.data.myWishlist[i].link
    })
  }

  deleteWishlist(i) {
    console.log(i)
  }
}