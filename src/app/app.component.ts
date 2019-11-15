import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}
  title = 'github-profile-viewer';
  isLoading: boolean;
  isFound: boolean;
  myForm: FormGroup;
  profileDetails: any;
  name: any;
  location: any;
  avatarUrl: any;
  htmlUrl: any;
  ngOnInit() {
    this.myForm = new FormGroup({
      gitHubId: new FormControl('')
    });
  }
  onSubmit(form: FormGroup) {
    this.isLoading = true;
    if (localStorage.getItem(form.value.githubId)) {
      this.isLoading = false;
      this.profileDetails = JSON.parse(localStorage.getItem(form.value.gitHubId));
      this.display(this.profileDetails);
    } else {
      // tslint:disable-next-line: max-line-length
      this.http.get('https://api.github.com/users/' + form.value.gitHubId + '?access_token=beba3c150021bfb49769385927dfa59fac2cdf04').subscribe(response => {
        this.profileDetails = response;
        this.display(this.profileDetails);
        this.isLoading = false;
        localStorage.setItem(form.value.gitHubId, JSON.stringify(this.profileDetails));
        }, error => {
                      this.isFound = false;
                      this.openSnackBar(' No Results Found! ', 'Close' );
        });
    }
  }
  display(profileDetails) {
    this.isFound = true;
    this.name = profileDetails.name;
    this.location = profileDetails.location;
    this.avatarUrl = profileDetails.avatar_url;
    this.htmlUrl = profileDetails.html_url;
  }
  openSnackBar(message, action) {
    this.snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center'

    });
  }
}
