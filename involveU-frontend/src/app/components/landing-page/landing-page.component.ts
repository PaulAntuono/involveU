import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../objects/user";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  public users: User[] = [];
  constructor(private userService: UserService) { }

  imageArray = ["involveU-image1.jpg", "involveU-image2.jpg", "involveU-image3.jpg", "involveU-image4.jpg", "involveU-image5.jpg"];

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.loadUserTable();
  }

  loadUserTable() {
    this.userService.getUsers().subscribe((data: User[]) => {
      this.users = data;
    });
}

}
