import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})

export class GroupsComponent implements OnInit {
  constructor(private data: DataService) { }

  groups: string[]

  ngOnInit() {
    this.data.loadGroups()
    this.groups = this.data.groups
  }
}