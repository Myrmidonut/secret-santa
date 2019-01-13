import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "../data.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
  constructor(private formbuilder: FormBuilder, private data: DataService) { }

  registerForm = this.formbuilder.group({
    username: ["", Validators.required],
    password: ["", Validators.required],
    email: ["", Validators.required]
  })

  ngOnInit() {
  }

  onSubmit() {
    this.data.register(this.registerForm.value)
  }
}