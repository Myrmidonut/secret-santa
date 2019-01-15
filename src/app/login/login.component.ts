import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "../data.service";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private data: DataService,
    private httpClient: HttpClient
    ) {
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    })
  }

  loginForm: FormGroup
  submitted = false
  success = false

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
    console.log(formdata)

    let body = new URLSearchParams()
    body.set("username", formdata.username)
    body.set("password", formdata.password)

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    }

    this.httpClient.post<{username: string, password: string}>("/login", body.toString(), httpOptions)
    .subscribe(res => {
      console.log(res)
    });
  }
}