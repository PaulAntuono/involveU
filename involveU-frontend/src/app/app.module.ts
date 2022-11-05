import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AppComponent } from './components/app.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ClubPageComponent } from './components/club-page/club-page.component';
import { DialogModule } from 'primeng/dialog';
import {ButtonModule} from "primeng/button";
import {CookieService} from "ngx-cookie-service";
import {RouterOutlet} from "@angular/router";
import { AppRoutingModule } from './app-routing.module';
import {CarouselModule} from "primeng/carousel";
import { FilterPipe } from './pipes/filter.pipe';
import {RippleModule} from "primeng/ripple";
import { SpecificClubPageComponent } from './components/specific-club-page/specific-club-page.component';
import { AdminPageComponent } from './components/create-club/create-club-page.component';
import {Table, TableModule} from "primeng/table";
import {InputTextModule} from "primeng/inputtext";
import {ContextMenuModule} from "primeng/contextmenu";
import { AssignRemoveAdvisorComponent } from './components/assign-remove-advisor/assign-remove-advisor.component';
import { AddRemoveEboardComponent } from './components/add-remove-eboard/add-remove-eboard.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    ClubPageComponent,
    FilterPipe,
    SpecificClubPageComponent,
    AdminPageComponent,
    AssignRemoveAdvisorComponent,
    AddRemoveEboardComponent
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        DialogModule,
        ButtonModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        RouterOutlet,
        AppRoutingModule,
        CarouselModule,
        FormsModule,
        RippleModule,
        TableModule,
        InputTextModule,
        ContextMenuModule
    ],
  providers: [
    CookieService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
