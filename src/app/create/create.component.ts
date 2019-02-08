import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "../data.service";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})

export class CreateComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder, 
    private data: DataService, 
    private httpClient: HttpClient,
    private router: Router
  ) {
    this.createForm = this.formBuilder.group({
      groupname: ["", Validators.required]
    })
  }

  createForm: FormGroup
  submitted: Boolean = false
  success: Boolean = false
  failed: Boolean = false

  ngOnInit() {
    this.checkLoginStatus()
  }

  checkLoginStatus() {
    if (!this.data.username) {
      let body = new URLSearchParams()

      this.httpClient.post<{username: string}>("/loginstatus", body.toString())
      .subscribe(res => {
        if (res.username) {
          this.data.username = res.username
        } else {
          this.router.navigate(["/"])
        }
      })
    }
  }

  onSubmit() {
    this.submitted = true

    if (this.createForm.invalid) {
      return;
    }

    this.success = true

    this.createGroup(this.createForm.value)
  }

  createGroup(formdata) {
    if (this.data.demo) {
      this.data.demoGroups.push({
        groupname: formdata.groupname,
        owner: "Demo User",
        code: "abc12",
        launched: false,
        members: ["Demo User"],
        myWishlist: [],
        partner: undefined,
        partnerWishlist: []
      })
      this.data.groupname = formdata.groupname
      this.router.navigate(["/group"])
    } else if (this.data.username) {
      let body = new URLSearchParams()
      body.set("groupname", formdata.groupname)
      body.set("owner", this.data.username)

      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/x-www-form-urlencoded"
        })
      }

      this.httpClient.post<{groupname: string}>("/create", body.toString(), httpOptions)
      .subscribe(res => {
        if (res.groupname) {
          this.data.groupname = res.groupname

          this.router.navigate(["/group"])
        } else {
          this.failed = true
        }
      })
    } else {
      this.router.navigate(["/"])
    }
  }
}