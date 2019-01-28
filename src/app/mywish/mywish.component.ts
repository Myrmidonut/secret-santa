import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "../data.service";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";

@Component({
  selector: 'app-mywish',
  templateUrl: './mywish.component.html',
  styleUrls: ['./mywish.component.scss']
})

export class MywishComponent implements OnInit {
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
    const i = this.data.myWish

    if (i !== -1) {
      this.wishlistForm.setValue({
        title: this.data.myWishlist[i].title,
        description: this.data.myWishlist[i].description,
        link: this.data.myWishlist[i].link
      })
    }
  }

  onSubmit() {
    this.submitted = true

    if (this.wishlistForm.invalid) {
      return;
    }

    this.success = true

    this.saveWishlist(this.wishlistForm.value)
  }

  saveWishlist(formdata) {
    let body = new URLSearchParams()
    body.set("groupname", this.data.groupname)
    body.set("title", formdata.title)
    body.set("description", formdata.description)
    body.set("link", formdata.link)
    body.set("mywish", String(this.data.myWish))

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    }

    this.httpClient.post("/savewishlist", body.toString(), httpOptions)
    .subscribe(res => {
      this.router.navigate(["/mywishlist"])
    })
  }
}