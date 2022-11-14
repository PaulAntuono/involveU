import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../objects/user";
import {CookieService} from "ngx-cookie-service";
import {Events} from "../../objects/events";
import {EventsService} from "../../services/events.service";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  public users: User[] = [];
  constructor(private userService: UserService,
              private eventsService: EventsService,
              public cookie: CookieService) { }

  imageArray = ["img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg", "img5.jpg", "img6.jpg", "img7.jpg", "img8.jpg"];

  currentUser: User;

  todaysEvents: Events[];

  ngOnInit(): void {
    this.fillUserInfo();
    this.fillTodaysEvents();
  }

  ngAfterViewInit(): void {
  }

  fillUserInfo() {
    this.currentUser = {studentID: +this.cookie.get('studentID'), firstName: this.cookie.get('studentFName'), lastName: this.cookie.get('studentLName')};
    this.currentUser.firstName = this.currentUser.firstName.replace(/['"]/g, '');
    this.currentUser.lastName = this.currentUser.lastName.replace(/['"]/g, '');
  }

  fillTodaysEvents() {
    this.eventsService.getTodaysEvents().subscribe((data: Events[]) => {
      this.todaysEvents = data;
    })
  }
}
