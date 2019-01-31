import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  constructor() { }

  demo: boolean
  demoGroupIndex: number
  demoGroups: any[] = [
    {
      groupname: "Family",
      owner: "Demo User",
      code: "abc12",
      launched: false,
      members: ["John", "Anna", "Demo User"],
      myWishlist: [
        {
          title: "Toy Car",
          description: "A remote controlled toy car. It has to be blue with red stripes!",
          link: "http://www.toycar.com"
        },
        {
          title: "Football",
          description: "The latest and greatest official world cup football.",
          link: "http://www.football.com"
        }
      ],
      partner: undefined,
      partnerWishlist: [
        {
          title: "Phone Charger",
          description: "A new phone charger with micro usb plug.",
          link: "http://amazon.com"
        }
      ]
    },
    {
      groupname: "Work",
      owner: undefined,
      code: "def34",
      launched: true,
      members: ["Jim", "Lucy", "Demo User"],
      myWishlist: [
        {
          title: "Cookies",
          description: "Just any kind of chocolate cookies!",
          link: ""
        }
      ],
      partner: "Lucy",
      partnerWishlist: [
        {
          title: "White Wine",
          description: "",
          link: "http://wine.com"
        },
        {
          title: "A knife",
          description: "A small but sharp kitchen knife.",
          link: ""
        }
      ]
    }
  ]

  username: string

  groups: string[]
  groupsowner: string[]
  groupslaunched: string[]

  groupname: string
  code: string
  launched: boolean
  owner: string
  members: string[]
  myWishlist: any[]
  myWish: number
  partner: string
  partnerWishlist: any[]
}