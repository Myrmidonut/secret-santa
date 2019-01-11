import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from "./main/main.component";
import { CreateComponent } from "./create/create.component";
import { JoinComponent } from "./join/join.component";
import { GroupComponent } from "./group/group.component";
import { GroupsComponent } from "./groups/groups.component";
import { MywishlistComponent } from "./mywishlist/mywishlist.component";
import { PartnerwishlistComponent } from "./partnerwishlist/partnerwishlist.component";
import { MembersComponent } from "./members/members.component";
import { InviteComponent } from "./invite/invite.component";

const routes: Routes = [
  { path: "", component: MainComponent },
  { path: "create", component: CreateComponent },
  { path: "join", component: JoinComponent },
  { path: "group", component: GroupComponent },
  { path: "groups", component: GroupsComponent },
  { path: "mywishlist", component: MywishlistComponent },
  { path: "partnerwishlist", component: PartnerwishlistComponent },
  { path: "members", component: MembersComponent },
  { path: "invite", component: InviteComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }