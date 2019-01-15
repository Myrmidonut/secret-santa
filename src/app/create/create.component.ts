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

    this.createGroup(this.createForm.value, this.data.user)
  }

  createGroup(formdata, owner) {
    // send groupname and owner to api
    // get groupname and code back

    let body = new URLSearchParams()
    body.set("groupname", formdata.groupname)
    body.set("owner", owner)

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    }

    this.httpClient.post<{groupname: string, owner: string, code: string}>("/create", body.toString(), httpOptions)
    .subscribe(res => {
      console.log(res)

      this.data.activeGroup = res.groupname

      // joinGroup

      this.router.navigate(["/invite"])
    })
  }
}