import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Events} from "../../objects/events";
import {CalendarFormat} from "../../objects/calendar-format";
import {EventClickArg} from "@fullcalendar/angular";
import {EventsService} from "../../services/events.service";
import {Title} from "@angular/platform-browser";
import {Club} from "../../objects/club";
import {ClubService} from "../../services/club.service";
import {CookieService} from "ngx-cookie-service";
import {ResponsiveService} from "../../services/responsive.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";


@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  constructor(private eventsService: EventsService,
              private toastr: ToastrService,
              public cookie: CookieService,
              public responsiveService: ResponsiveService,
              private clubService: ClubService,
              private title: Title,
              private router: Router) {
    this.title.setTitle("involveU | Profile");
  }

  // BOOLEANS
  viewMoreInfoDialog: boolean = false;
  viewFilterDialog: boolean = false;
  disableSpaceDropdown: boolean = true;
  isLoggedIn: boolean = false;

  // NUMBERS
  userID: number;
  locationID: number;
  spaceID: number;

  // OBJECTS or ARRAYS
  formattedEvents: CalendarFormat[] = [];
  selectedEvent: Events[] = [];
  eventsToSend: Events[];
  dropdownOptions: Club[] = [];
  locationsList: Events[] = [];
  spacesList: Events[] = [];
  userRSVPdEvents: Events[] = [];
  ngOnInit(): void {
    this.userID = +this.cookie.get('studentID');
    this.getAllClubs();
    this.getLocations();
    this.isUserLoggedIn();
    this.getUserRSVPdEvents();
  }

  isUserLoggedIn() {
    this.isLoggedIn = this.userID !== 0;
  }

  // GET functions
  getAllClubs() {
    this.clubService.getAllClubs().subscribe(response => {
      this.dropdownOptions = response;
    })
  }

  getLocations() {
    this.eventsService.getLocations().subscribe((response: Events[]) => {
        this.locationsList = response;
      },
      (error) => {
        console.log(error)
      });
  }

  getSpacesByLocation() {
    this.eventsService.getSpaceByLocation(this.locationID).subscribe(response => {
        this.spacesList = response;
      },
      (error) => {
        console.log(error);
      });
  }

  getUserRSVPdEvents() {
    this.eventsService.getUserRSVPdEvents(this.userID).subscribe(response => {
      this.userRSVPdEvents = response;
      for(let i = 0; i < this.userRSVPdEvents.length; i++) {
        this.clubService.getClubLogo(this.userRSVPdEvents[i].clubID).subscribe(logo => {
          const reader = new FileReader();
          reader.onload = (e) => this.userRSVPdEvents[i].clubLogo = e.target.result;
          reader.readAsDataURL(new Blob([logo]));
          this.userRSVPdEvents[i].clubLogo = logo;
        })
      }
    })
  }

}


