import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})

export class MembersComponent implements OnInit {
  constructor(private data: DataService) { }

  members: string[]

  ngOnInit() {
    console.log(this.data.members)
    console.log(this.data.owner)
    console.log(this.data.groupname)
  }
}