import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "../data.service";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { CustomValidators } from "../custom-validators";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private data: DataService,
    private httpClient: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
      confirmPassword: ["", Validators.required],
      email: ["", Validators.required]
    },
    {
      // check whether our password and confirm password match
      validator: CustomValidators.passwordMatchValidator
    }
    )
  }

  registerForm: FormGroup
  submitted: Boolean = false
  success: Boolean = false

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
    let body = new URLSearchParams();
    body.set("username", formdata.username)
    body.set("password", formdata.password)
    body.set("email", formdata.email)

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    }

    this.httpClient.post<{username: string, password: string, email: string}>("/register", body.toString(), httpOptions)
    .subscribe(res => {
      this.data.username = res.username

      this.router.navigate(["/"])
    });
  }
}