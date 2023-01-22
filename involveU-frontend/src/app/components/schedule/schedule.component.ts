import { Component, OnInit } from '@angular/core';
import {ClubService} from "../../services/club.service";
import {EventsService} from "../../services/events.service";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {Events} from "../../objects/events";
import {CalendarFormat} from "../../objects/calendar-format";
import {Club} from "../../objects/club";

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  constructor(private clubService: ClubService,
              private eventsService: EventsService,
              private router: Router,
              public cookie: CookieService) {
  }

  userID: number;
  eventsToSend: Events[];
  dropdownOptions: Club[] = [];

  optionSelected: boolean = false;

  locationID: number;
  disableSpaceDropdown: boolean = false;
  locationsList: Events[] = [];
  spacesList: Events[] = [];

  ngOnInit() {
    this.userID = +this.cookie.get('studentID');
    this.getAllClubs();
    this.getLocations();
  }

  getAllClubs() {
    this.clubService.getAllClubs().subscribe(response => {
      this.dropdownOptions = response;
    })
  }
  activateAllEvents() {
    this.eventsService.getAllEvents().subscribe(response => {
      this.eventsToSend = response;
    });
    this.optionSelected = true;
  }

  activateFavoritedClubEvents() {
    this.eventsService.getFavoritedClubsEvents(this.userID).subscribe(response => {
      this.eventsToSend = response;
    });
    this.optionSelected = true;
  }

  onClubSelected(event) {
    this.eventsService.getSpecificClubEvents(event.value.clubID).subscribe(response => {
      this.eventsToSend = response;
      this.eventsToSend = this.eventsToSend.slice();
      console.log(this.eventsToSend);
    })
    this.optionSelected = true;
  }

  returnToFilter() {
    location.reload();
  }

  checkLocationSelected(selectedLocation: number) {
    console.log(selectedLocation);
      this.locationID = selectedLocation;
      this.disableSpaceDropdown = false;
      this.getSpacesByLocation();
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

  onSpaceSelected(spaceID: number) {
    console.log(spaceID);
    this.eventsService.getEventsBySpace(spaceID.toString()).subscribe(response => {
      this.eventsToSend = response;
    });
    this.optionSelected = true;
  }
}
