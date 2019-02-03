import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from "./main/main.component";
import { CreateComponent } from "./create/create.component";
import { JoinComponent } from "./join/join.component";
import { GroupComponent } from "./group/group.component";
import { GroupsComponent } from "./groups/groups.component";
import { MywishlistComponent } from "./mywishlist/mywishlist.component";
import { PartnerComponent } from "./partner/partner.component";
import { MembersComponent } from "./members/members.component";
import { InviteComponent } from "./invite/invite.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { MywishComponent } from "./mywish/mywish.component";

const routes: Routes = [
  { path: "", component: MainComponent },
  { path: "create", component: CreateComponent },
  { path: "join", component: JoinComponent },
  { path: "group", component: GroupComponent },
  { path: "groups", component: GroupsComponent },
  { path: "mywishlist", component: MywishlistComponent },
  { path: "partner", component: PartnerComponent },
  { path: "members", component: MembersComponent },
  { path: "invite", component: InviteComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "mywish", component: MywishComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})

export class AppRoutingModule { }