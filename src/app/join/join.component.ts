import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})

export class JoinComponent implements OnInit {
  constructor(private formbuilder: FormBuilder) { }

  joinForm = this.formbuilder.group({
    name: [""],
    code: [""]
  })

  ngOnInit() {
  }
}