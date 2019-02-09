import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "../data.service";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private data: DataService,
    private httpClient: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    })
  }

  loginForm: FormGroup
  submitted: Boolean = false
  success: Boolean = false
  failed: Boolean = false

  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true

    if (this.loginForm.invalid) {
      return;
    }

    this.success = true

    this.login(this.loginForm.value)
  }

  login(formdata) {
    this.failed = false

    let body = new URLSearchParams()
    body.set("username", formdata.username.toLowerCase())
    body.set("password", formdata.password)

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    }

    this.httpClient.post<{status: string, username: string, groups: [string], owner: [string]}>("/login", body.toString(), httpOptions)
    .subscribe(res => {
      if (!res.username) {
        this.failed = true;
      } else {
        this.data.username = res.username
        this.data.groups = res.groups
        this.data.groupsowner = res.owner

        this.router.navigate(["/"])
      }
    });
  }
}