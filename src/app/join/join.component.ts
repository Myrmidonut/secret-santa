import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "../data.service";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})

export class JoinComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private data: DataService,
    private httpClient: HttpClient
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

    this.join(this.joinForm.value)
  }

  join(formdata) {
    console.log(formdata)

    let body = new URLSearchParams()
    body.set("groupname", formdata.groupname)
    body.set("code", formdata.code)

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    }

    this.httpClient.post<{groupname: string, code: string}>("/join", body.toString(), httpOptions)
    .subscribe(res => {
      console.log(res)

      // set groupname
      // redirect to /group
    })
  }
}