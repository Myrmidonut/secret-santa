import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "../data.service";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})

export class CreateComponent implements OnInit {
  constructor(private formbuilder: FormBuilder, private data: DataService) { }

  createForm = this.formbuilder.group({
    groupname: ["", Validators.required]
  })

  ngOnInit() {
  }

  onSubmit() {
    this.data.createGroup(this.createForm.value, this.data.user)
  }
}