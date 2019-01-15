import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "../data.service";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private data: DataService,
    private httpClient: HttpClient
    ) {
    this.registerForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
      email: ["", Validators.required]
    })
  }

  registerForm: FormGroup
  submitted = false
  success = false

  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true

    if (this.registerForm.invalid) {
      return;
    }

    this.success = true

    this.register(this.registerForm.value)
  }

  register(formdata) {
    console.log(formdata)

    let body = new URLSearchParams();
    body.set("username", formdata.username)
    body.set("password", formdata.password)
    body.set("email", formdata.email)

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    }

    this.httpClient.post("/register", body.toString(), httpOptions)
    .subscribe(res => {
      console.log(res)
    });
  }
}