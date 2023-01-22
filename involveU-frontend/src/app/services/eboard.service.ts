import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Announcement} from "../objects/announcements";


@Injectable({
  providedIn: 'root'
})
export class EboardService {

  constructor(private http: HttpClient) { }

  createAnnouncement(newAnnouncement: Announcement) {
    return this.http.post(environment.apiURL + `announcements/createAnnouncements`, newAnnouncement, {responseType: 'text'});
  }

  getClubAnnouncements(clubID: number) {
    return this.http.get(environment.apiURL + `announcements/getClubAnnouncements/${clubID}`);
  }
}
