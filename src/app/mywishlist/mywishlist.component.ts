import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";

@Component({
  selector: 'app-mywishlist',
  templateUrl: './mywishlist.component.html',
  styleUrls: ['./mywishlist.component.scss']
})

export class MywishlistComponent implements OnInit {
  constructor(private data: DataService) { }

  myWishlist: string[]

  // [{
  //   title: "test title",
  //   description: "test description",
  //   link: "test link"
  // }]

  // JSON.stringify(myWishlist)

  ngOnInit() {
    this.data.loadMyWishlist()
    this.myWishlist = this.data.myWishlist;
  }
}