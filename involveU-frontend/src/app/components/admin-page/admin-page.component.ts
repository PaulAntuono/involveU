import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {ClubService} from "../../services/club.service";
import {AdminService} from "../../services/admin.service";
import {Club} from "../../objects/club";
import {User} from "../../objects/user";
import {CookieService} from "ngx-cookie-service";
import {Announcement} from "../../objects/announcements";
import { DatePipe } from '@angular/common';
import {Title} from "@angular/platform-browser";
import {ResponsiveService} from "../../services/responsive.service";

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {
  createUserForm: FormGroup;
  deleteUserForm: FormGroup;
  createClubForm : FormGroup;
  deleteClubForm: FormGroup;
  assignAdvisorForm : FormGroup;
  osiAnnouncementForm : FormGroup;
  removeEBoardForm : FormGroup;
  addEBoardForm : FormGroup;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private clubService: ClubService,
              public responsiveService: ResponsiveService,
              private adminService: AdminService,
              public cookie: CookieService,
              private datePipe: DatePipe,
              private title: Title) {
    this.title.setTitle("involveU | Admin")

    this.createClubForm = this.formBuilder.group({
      clubName: ['', Validators.required],
      clubAffiliation: ['', Validators.required],
      clubBio: ['', Validators.required],
      clubVision: ['', Validators.required],
      clubMission: ['', Validators.required],
      clubValues: ['', Validators.required],
      advisorID: ['', Validators.required],
      clubLogo: ['']
    });

    this.createUserForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['',  Validators.required],
      year: ['', Validators.required],
      pronouns: ['', Validators.required],
      isAdmin: [''],
      isEboard: ['']
    });

    this.deleteUserForm = this.formBuilder.group({
      userID: ['', Validators.required]
    })

    this.deleteClubForm = this.formBuilder.group({
      clubID: ['', Validators.required]
    })

    this.assignAdvisorForm = this.formBuilder.group({
      advisorID: ['', Validators.required]
    });

    this.addEBoardForm = this.formBuilder.group({
      userID: ['', Validators.required],
      role: ['', Validators.required]
    });

    this.removeEBoardForm = this.formBuilder.group({
      userID: ['', Validators.required]
    });

    this.osiAnnouncementForm = this.formBuilder.group({
      clubID: [''],
      contentOfAnnouncement: ['', Validators.required],
      expiresOn: [''],
      announcementTitle: ['', Validators.required],
      postedOn: ['']
    });
    this.todaysDate = this.datePipe.transform(this.todaysDate, 'yyyy-MM-dd');
  }

  //BOOLEANS
  createClubMessage: boolean = false;
  createClubFailed: boolean = false;
  createUserSuccess: boolean = false;
  createUserFailed: boolean = false;
  deleteUserSuccess: boolean = false;
  deleteClubSuccess: boolean = false;
  deleteUserFailed: boolean = false;
  deleteClubFailed: boolean = false;
  assignAdvisorSuccess: boolean = false;
  assignAdvisorFailed: boolean = false;
  assignEboardSuccess: boolean = false;
  assignEboardFailed: boolean = false;
  removeEboardSuccess: boolean = false;
  removeEboardFailed: boolean = false;
  disableUserDropdown:boolean = true;
  assign: boolean = true;

  //NUMBERS
  clubID!: number;

  //STRINGS


  //OBJECTS
  labelEboard: User[];
  clubNames: Club[] = [];
  userList: User[] = [];
  nonEboardList: User[] = [];
  eboardList: User[] = [];
  advisorList: User[] = [];
  clubEboard: User[] = [];
  selectedClub: any = {};

  //FORM CONTROLSc
  addEBoardClubID: FormControl = new FormControl(null);
  removeEBoardClubID: FormControl = new FormControl(null);
  removeClubID: FormControl = new FormControl(null);
  assignAdvisorClubID: FormControl = new FormControl(null);
  deleteUserID: FormControl = new FormControl(null);
  nonEboardID: FormControl = new FormControl(null);
  eboardID: FormControl = new FormControl(null);
  advisorID: FormControl = new FormControl(null);
  createClubAdvisorID: FormControl = new FormControl(null);
  todaysDate = new Date().toString();


  ngOnInit(): void {
    this.fillClubList();
    this.fillUserList();
    this.fillNonEboardList();
    this.fillEboardList();
    this.fillAdvisorList();
    this.getEboardMembers();
  }
  onUpload(event) {
    const file:File = event.files[0];

    this.adminService.sendImage(file).subscribe(response => {
      console.log(response);
    })

  }

  fillClubList() {
    this.clubService.getAllClubs().subscribe((response: Club[]) => {
        this.clubNames = response;
      },
      (error) => {
        console.log(error)
      });
  }

  fillUserList() {
    this.userService.getAllUsers().subscribe((response: User[]) => {
        this.userList = response;
      },
      (error) => {
        console.log(error)
      });
  }

  fillEboardList() {
    this.adminService.getAllEboard().subscribe((response: User[]) => {
        this.eboardList = response;
      },
      (error) => {
        console.log(error)
      });
  }

  fillNonEboardList() {
    this.adminService.getAllNonEboard().subscribe((response: User[]) => {
      this.nonEboardList = response;
    },
      (error) => {
      console.log(error)
      });
  }

  fillAdvisorList() {
    this.userService.getAllFaculty().subscribe((response: User[]) => {
        this.advisorList = response;
      },
      (error) => {
        console.log(error)
      });
  }

  get clubCreationFormInputs() {
    return this.createClubForm.controls;
  }

  get createUserFormInputs() {
    return this.createUserForm.controls;
  }

  get deleteUserFormInputs() {
    return this.deleteUserForm.controls;
  }

  get deleteClubFormInputs() {
    return this.deleteClubForm.controls;
  }

  get assignAdvisorFormInputs() {
    return this.assignAdvisorForm.controls;
  }

  get addEBoardFormInputs() {
    return this.addEBoardForm.controls;
  }

  get removeEBoardFormInputs() {
    return this.removeEBoardForm.controls;
  }

  get osiAnnouncementFormInputs() {
    return this.osiAnnouncementForm.controls;
  }

  createClubSubmit(){
    const clubInfo : Club = {ownerID: this.cookie.get('studentID'), clubName: this.createClubForm.value.clubName, clubAffiliation: this.createClubForm.value.clubAffiliation, clubBio: this.createClubForm.value.clubBio, clubVision: this.createClubForm.value.clubVision, clubMission: this.createClubForm.value.clubMission, clubValues: this.createClubForm.value.clubValues, clubLogo: this.createClubForm.value.clubLogo, advisorID: this.createClubAdvisorID.value}
    console.log(clubInfo);
    this.adminService.insertNewClub(clubInfo).subscribe(success =>{
        this.createClubMessage = true;
        console.log(success);
        location.reload();
      },
      (error) => {
        this.createClubFailed = true;
        console.log(error)
      });
  }

  createUserSubmit(){
    const newUser: User = { firstName: this.createUserForm.value.firstName, lastName: this.createUserForm.value.lastName, year: this.createUserForm.value.year, email: this.createUserForm.value.email, isAdmin: 0, isEboard: 0, pronouns: this.createUserForm.value.pronouns, userPassword: this.createUserForm.value.password};
    this.adminService.createUser(newUser).subscribe(success =>{
        this.createUserSuccess = true;
        console.log(success);
        location.reload();
      },
      (error) => {
        this.createUserFailed = true;
        console.log(error);
      });
  }

  deleteUserSubmit(){
    this.adminService.deleteUser(this.deleteUserID.value).subscribe(success =>{
        console.log(success);
        this.deleteUserSuccess = true;
        location.reload();
      },
      (error) => {
        console.log(error);
        this.deleteUserFailed = true;
      });
  }

  deleteClubSubmit(){
    this.adminService.deleteClub(this.removeClubID.value).subscribe(success =>{
        console.log(success);
        console.log("test");
        this.deleteClubSuccess = true;
        location.reload();
      },
      (error) => {
        console.log(error);
        if(error.status === 200)
        {
          this.deleteClubSuccess = true;
          location.reload();
        }
        this.deleteClubFailed = true;
      });
  }

  addEBoardSubmit(){
    this.adminService.addEBoardMember(this.nonEboardID.value, this.addEBoardClubID.value, this.addEBoardForm.value.role).subscribe(success =>{
        console.log(success);
        this.assignEboardSuccess = true;
        location.reload();
      },
      (error) => {
        this.assignEboardFailed = true;
        console.log(error);
      });
    console.log(this.nonEboardID.value, this.addEBoardClubID.value, this.addEBoardForm.value.role)
  }

  removeEBoardSubmit(){
    this.adminService.removeEBoardMember(this.eboardID.value).subscribe(success =>{
        console.log(success);
        this.removeEboardSuccess = true;
        location.reload();
      },
      (error) => {
        console.log(error);
        this.removeEboardFailed = true;
      });
  }

  assignAdvisorSubmit(){
    this.adminService.assignNewAdvisor(this.advisorID.value, this.assignAdvisorClubID.value).subscribe(success =>{
        console.log(success);
        this.assignAdvisorSuccess = true;
        location.reload();
      },
      (error) => {
        console.log(error);
        this.assignAdvisorFailed = true;
      });
  }

  createOSIAnnouncementSubmit(){
    const newAnnouncement: Announcement = {clubID: 275, contentOfAnnouncement: this.osiAnnouncementForm.value.contentOfAnnouncement, expiresOn: this.osiAnnouncementForm.value.expiresOn, announcementTitle: this.osiAnnouncementForm.value.announcementTitle, postedOn: this.todaysDate};
    console.log(newAnnouncement);
    this.adminService.createOSIAnnouncement(newAnnouncement).subscribe(success =>{
        console.log(success);
        location.reload();
      },
      (error) => {
        console.log(error);
      });
  }

  getEboardMembers()
  {
    this.clubService.getClubEboard(this.removeEBoardClubID.value).subscribe(response => {
      this.clubEboard = response;
      console.log(response)
      this.clubEboard.forEach(member =>
        {
          console.log(member);
          member.firstName = member.firstName + ' ' + member.lastName;

        }

      );
    })

    console.log("List:"+this.labelEboard);


  }

  checkClubSelected() {
    if(this.selectedClub!=='Select Club'){
      this.disableUserDropdown = false;
      this.getEboardMembers();
    }
    else {
      this.disableUserDropdown = true;
    }
  }

  isCreateClubValid() {
    if (this.createClubForm.value.clubName == '' || this.createClubForm.value.clubAffiliation == '' ||  this.createClubForm.value.clubBio == '' ||  this.createClubForm.value.clubVision == '' ||  this.createClubForm.value.clubMission == '' ||  this.createClubForm.value.clubValues == '' || this.createClubAdvisorID.value == null) {
      return true;
    }
    else {
      return false;
    }
  }

  isCreateUserValid() {
    if (this.createUserForm.value.firstName == '' || this.createUserForm.value.lastName == '' || this.createUserForm.value.email == '' || this.createUserForm.value.password == '' || this.createUserForm.value.year == '' || this.createUserForm.value.pronouns == '') {
      return true;
    }
    else {
      return false;
    }
  }

  isDeleteUserValid() {
    if (this.deleteUserID.value == null) {
      return true;
    }
    else {
      return false;
    }
  }

  isDeleteClubValid() {
    if (this.removeClubID.value == null) {
      return true;
    }
    else {
      return false;
    }
  }

  isAssignEboardValid() {
    if (this.nonEboardID.value == null || this.addEBoardClubID.value == null || this.addEBoardForm.value.role == '') {
      return true;
    }
    else {
      return false;
    }
  }

  isAssignAdvisorValid() {
    if (this.assignAdvisorClubID.value == null || this.advisorID.value == null) {
      return true;
    }
    else {
      return false;
    }
  }

  isRemoveEboardValid() {
    if (this.eboardID.value == null || this.removeEBoardClubID == null) {
      return true;
    }
    else {
      return false;
    }
  }

  isOSIAnnouncementValid() {
    if(this.osiAnnouncementForm.value.announcementTitle == '' || this.osiAnnouncementForm.value.contentOfAnnouncement == '' || this.osiAnnouncementForm.value.expiresOn == null || this.osiAnnouncementForm.value.postedOn == null) {
      return true;
    }
    else {
      return false;
    }
  }
}
