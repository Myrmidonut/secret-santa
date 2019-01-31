import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})

export class GroupComponent implements OnInit {
  constructor(
    private httpClient: HttpClient,
    public data: DataService,
    private router: Router
  ) { }

  code: string
  leaveButton: string = "Leave Group"
  deleteButton: string = "Delete Group"
  launchButton: string = "Assign Partners"
  confirmLeave: boolean = false
  confirmLeaveGroupId: string = ""
  confirmLaunch: boolean = false
  confirmLaunchGroupId: string = ""
  confirmDelete: boolean = false
  confirmDeleteGroupId: string = ""

  ngOnInit() {
    if (this.data.username && !this.data.demo) {
      this.loadGroup()
      this.loadPartner()
    } else {
      this.data.demoGroupIndex = this.data.demoGroups.findIndex(e => {
        return e.groupname === this.data.groupname
      })

      this.data.owner = this.data.demoGroups[this.data.demoGroupIndex].owner
      this.data.members = this.data.demoGroups[this.data.demoGroupIndex].members
      this.data.launched = this.data.demoGroups[this.data.demoGroupIndex].launched
      this.data.code = this.data.demoGroups[this.data.demoGroupIndex].code
      if (this.data.demoGroups[this.data.demoGroupIndex].members.indexOf(this.data.demoGroups[this.data.demoGroupIndex].partner) !== -1) {
        this.data.partner = this.data.demoGroups[this.data.demoGroupIndex].partner
      } else {
        this.data.demoGroups[this.data.demoGroupIndex].partner = undefined
        this.data.partner = undefined
      }
    }
  }

  leaveGroup() {
    if (!this.confirmLeave) {
      this.leaveButton = "Confirm Leave"
      this.confirmLeave = true
      this.confirmLeaveGroupId = "confirmLeaveGroupId"
    } else {
      if (this.data.demo) {
        this.data.demoGroups.splice(this.data.demoGroupIndex, 1)
        this.router.navigate(["/groups"])
      } else {
        let body = new URLSearchParams()
        body.set("groupname", this.data.groupname)

        const httpOptions = {
          headers: new HttpHeaders({
            "Content-Type": "application/x-www-form-urlencoded"
          })
        }

        this.httpClient.post("/leave", body.toString(), httpOptions)
        .subscribe(res => {
          this.router.navigate(["/groups"])
        })
      }
    }
  }

  loadGroup() {
    let body = new URLSearchParams()
    body.set("groupname", this.data.groupname)

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    }

    this.httpClient.post<{owner: string, members: string[], launched: boolean, code: string}>("/group", body.toString(), httpOptions)
    .subscribe(res => {
      this.data.owner = res.owner
      this.data.members = res.members
      this.data.launched = res.launched

      if (res.code) this.data.code = res.code
    })
  }

  deleteGroup() {
    if (!this.confirmDelete) {
      this.deleteButton = "Confirm Delete"
      this.confirmDelete = true
      this.confirmDeleteGroupId = "confirmDeleteGroupId"
    } else {
      if (this.data.demo) {
        this.data.demoGroups.splice(this.data.demoGroupIndex, 1)
        this.router.navigate(["/groups"])
      } else {
        let body = new URLSearchParams()
        body.set("groupname", this.data.groupname)

        const httpOptions = {
          headers: new HttpHeaders({
            "Content-Type": "application/x-www-form-urlencoded"
          })
        }

        this.httpClient.post("/deletegroup", body.toString(), httpOptions)
        .subscribe(res => {
          this.router.navigate(["/groups"])
        })
      }
    }
  }

  launchGroup() {
    if (!this.confirmLaunch) {
      this.launchButton = "Confirm Partners"
      this.confirmLaunch = true
      this.confirmLaunchGroupId = "confirmLaunchGroupId"
    } else {
      if (this.data.demo) {
        let partner = this.data.demoGroups[this.data.demoGroupIndex].members[Math.floor(Math.random() * this.data.demoGroups[this.data.demoGroupIndex].members.length)]
        this.data.demoGroups[this.data.demoGroupIndex].partner = partner
        this.data.demoGroups[this.data.demoGroupIndex].launched = true
        this.data.launched = true
        this.data.partner = partner

        this.confirmLaunch = false
        this.launchButton = "Assign Partners"
        this.confirmLaunchGroupId = ""
      } else {
        let body = new URLSearchParams()
        body.set("groupname", this.data.groupname)

        const httpOptions = {
          headers: new HttpHeaders({
            "Content-Type": "application/x-www-form-urlencoded"
          })
        }

        this.httpClient.post<{launched: boolean}>("/launch", body.toString(), httpOptions)
        .subscribe(res => {
          this.data.launched = res.launched
          this.confirmLaunch = false
          this.launchButton = "Assign Partners"
          this.confirmLaunchGroupId = ""

          this.loadPartner()
        })
      }
    }
  }

  loadPartner() {
    if (this.data.demo) {
      if (this.data.demoGroups[this.data.demoGroupIndex].partner) {
        this.data.partner = this.data.demoGroups[this.data.demoGroupIndex].partner
      } else {
        this.data.partner = undefined
      }
    } else {
      let body = new URLSearchParams()
      body.set("groupname", this.data.groupname)

      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/x-www-form-urlencoded"
        })
      }

      this.httpClient.post<{partner: string}>("/partner", body.toString(), httpOptions)
      .subscribe(res => {
        if (res.partner) {
          this.data.partner = res.partner
        } else {
          this.data.partner = undefined
        }
      })
    }
  }
}