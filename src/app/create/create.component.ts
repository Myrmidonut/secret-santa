import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "../data.service";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})

export class CreateComponent implements OnInit {
  createForm = this.formbuilder.group({
    name: ["", Validators.required],
    status: ["", Validators.required]
  })

  constructor(private formbuilder: FormBuilder, private data: DataService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.data.createGroup(this.createForm.value)
  }
}