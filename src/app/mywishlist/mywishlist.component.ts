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

  ngOnInit() {
    this.data.loadMyWishlist()
    this.myWishlist = this.data.myWishlist;
  }
}