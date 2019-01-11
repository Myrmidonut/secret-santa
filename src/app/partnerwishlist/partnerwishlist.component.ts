import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";

@Component({
  selector: 'app-partnerwishlist',
  templateUrl: './partnerwishlist.component.html',
  styleUrls: ['./partnerwishlist.component.scss']
})

export class PartnerwishlistComponent implements OnInit {
  constructor(private data: DataService) { }

  partnerWishlist: string[]

  ngOnInit() {
    this.data.loadPartnerWishlist()
    this.partnerWishlist = this.data.partnerWishlist
  }
}