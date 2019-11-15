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
  inputValue: string ;
  isLoading: boolean;
  isFound: boolean;
  myForm: FormGroup;
  profileDetails: any;
  name: any;
  location: any;
  avatarUrl: any;
  htmlUrl: any;
  locallyStoredData: any;
  ngOnInit() {
    this.myForm = new FormGroup({
      gitHubId: new FormControl('')
    });
  }
  onSubmit() {
    this.isLoading = true;
    this.inputValue = this.myForm.value.gitHubId;
    this.locallyStoredData = localStorage.getItem(this.inputValue);
    if (this.locallyStoredData ) {
      this.isLoading = false;
      this.profileDetails = JSON.parse(this.locallyStoredData );
      this.display(this.profileDetails);
    } else {
      this.http.get('https://api.github.com/users/' + this.inputValue).subscribe(response => {
        this.profileDetails = response;
        this.display(this.profileDetails);
        this.isLoading = false;
        localStorage.setItem(this.inputValue, JSON.stringify(this.profileDetails));
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
      horizontalPosition: 'center',

    });
  }
}
