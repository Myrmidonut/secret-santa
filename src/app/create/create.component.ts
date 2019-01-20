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
  submitted = false
  success = false

  ngOnInit() {
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
      this.data.groupname = res.groupname

      this.router.navigate(["/group"])
    })
  }
}