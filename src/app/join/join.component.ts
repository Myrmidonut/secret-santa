import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "../data.service";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})

export class JoinComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private data: DataService,
    private httpClient: HttpClient,
    private router: Router
  ) {
    this.joinForm = this.formBuilder.group({
      groupname: ["", Validators.required],
      code: ["", Validators.required]
    })
  }

  joinForm: FormGroup
  submitted = false
  success = false

  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true

    if (this.joinForm.invalid) {
      return;
    }

    this.success = true

    this.joinGroup(this.joinForm.value)
  }

  joinGroup(formdata) {
    let body = new URLSearchParams()
    body.set("groupname", formdata.groupname)
    body.set("code", formdata.code)

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    }

    this.httpClient.post<{groupname: string}>("/join", body.toString(), httpOptions)
    .subscribe(res => {
      if (res.groupname) {
        this.data.groupname = res.groupname

        this.router.navigate(["/group"])
      } else console.log(res)
    })
  }
}