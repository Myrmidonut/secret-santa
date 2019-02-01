import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "../data.service";

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})

export class InviteComponent implements OnInit {
  constructor(
    private formbuilder: FormBuilder, 
    public data: DataService, 
  ) {
    this.inviteForm = this.formbuilder.group({
      email: [{value: "", disabled: true}, Validators.required]
    })
  }

  inviteForm: FormGroup

  ngOnInit() {
  }
}