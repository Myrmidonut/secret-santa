import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "../data.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  constructor(private formbuilder: FormBuilder, private data: DataService) { }

  loginForm = this.formbuilder.group({
    username: ["", Validators.required],
    password: ["", Validators.required]
  })

  ngOnInit() {
  }

  onSubmit() {
    this.data.login(this.loginForm.value)
  }
}