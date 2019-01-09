import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { MainComponent } from './main/main.component';
import { GroupComponent } from './group/group.component';
import { GroupsComponent } from './groups/groups.component';
import { CreateComponent } from './create/create.component';
import { JoinComponent } from './join/join.component';
import { MywishlistComponent } from './mywishlist/mywishlist.component';
import { PartnerwishlistComponent } from './partnerwishlist/partnerwishlist.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    MainComponent,
    GroupComponent,
    GroupsComponent,
    CreateComponent,
    JoinComponent,
    MywishlistComponent,
    PartnerwishlistComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }