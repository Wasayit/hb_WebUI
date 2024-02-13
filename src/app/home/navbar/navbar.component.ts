import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtService, ResponseModel } from 'src/auth/jwtService';
import { AjaxService } from 'src/providers/ajax.service';
import { ErrorToast, Toast } from 'src/providers/common.service';
import { AUTHSERVICE, AccountSetup, Index } from 'src/providers/constants';
import { iNavigation } from 'src/providers/iNavigation';
declare var $: any;
declare var google: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoading: boolean = false;
  clientId : "622966386962-pcep2a9p2l0j75p1nrl5m7clhlln3eil.apps.googleusercontent.com";
  active:number = 1;
  signUpForm: FormGroup;
  isSubmitted: boolean = false;

  constructor (private http: AjaxService,
              private jwtService: JwtService,
              private nav:iNavigation,
              private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initSignUpForm();
    google.accounts.id.initialize({
      client_id : "622966386962-pcep2a9p2l0j75p1nrl5m7clhlln3eil.apps.googleusercontent.com",
      callback: (resp: any) => this.loginWithGoogle(resp)
    });

    google.accounts.id.renderButton(document.getElementById("google-oauth"), {
      theme: 'filled_blue',
      size: 'large',
      shape: 'rectangle',
      width: 900
    });
  }

  loginWithGoogle(resp: any) {
    if (resp && resp.clientId != undefined) {
      let credential = resp.credential;

      if(credential) {
        this.jwtService.setGoogleJwtToken(credential);
        this.http.login(`googlelogin`, { "Token": credential }, AUTHSERVICE).then((response: ResponseModel) => {
          $("#loginModal").modal("hide");
          Toast("Please wait loading dashboard ...", 15);
          this.nav.navigate(Index, null);
        });
      }
    }
  }

  loginPopup() {
    $("#loginModal").modal("show");
  }

  UserLogin() {
    this.isLoading = true;
    let loginValue = {
      Password: null,
      Email: null,
      Mobile: null,
    };

    let userId: any = document.getElementById("EmailOrMobile");
    let password: any = document.getElementById("Password");

    if (!userId.value) {
      this.isLoading = false;
      return;
    }

    if (!password.value) {
      this.isLoading = false;
      return;
    }

    if (userId.value !== "" && password.value !== "") {
      if(userId.value.indexOf("@") !== -1) {
        loginValue.Email = userId.value;
      } else {
        loginValue.Mobile = userId.value;
      }

      loginValue.Password = password.value;
      this.http.login('authenticate', loginValue, AUTHSERVICE).then((result: ResponseModel) => {
        if (result.ResponseBody) {
          $("#loginModal").modal("hide");
          Toast("Please wait loading dashboard ...", 15);
          this.nav.navigate(Index, null);
          this.isLoading = false;
          // if(Data.UserTypeId == 1)
          // else
          //   this.nav.navigate("", null);
        } else {
          ErrorToast("Incorrect username or password. Please try again.");
        }
      }).catch(e => {
        this.isLoading = false;
      });
    }
  }

  showPassword(e: any) {
   e.currentTarget.previousElementSibling.previousElementSibling.removeAttribute("type");
   e.currentTarget.previousElementSibling.previousElementSibling.setAttribute("type", "text");
    e.currentTarget.previousElementSibling.classList.remove("d-none");
    e.target.parentElement.classList.add("d-none");
  }

  hidePassword(e: any) {
    e.currentTarget.previousElementSibling.removeAttribute("type");
    e.currentTarget.previousElementSibling.setAttribute("type", "password");
    e.currentTarget.nextElementSibling.classList.remove("d-none")
    e.target.parentElement.classList.add("d-none");
  }

  googleLogin() {
    let client_id = "622966386962-pcep2a9p2l0j75p1nrl5m7clhlln3eil.apps.googleusercontent.com";
    const redirectUri = "http://localhost:4200"; // Adjust redirect URI if needed



    // window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirectUri}&scope=https%3A//www.googleapis.com/auth/drive.metadata.readonly&response_type=code`;
  }

  initSignUpForm() {
    this.signUpForm = this.fb.group({
      FullName: new FormControl("", [Validators.required]),
      Mobile: new FormControl("", [Validators.required]),
      Email: new FormControl("", [Validators.required]),
      Password: new FormControl("", [Validators.required]),
      ConfirmPassword: new FormControl("", [Validators.required])
    })
  }

  signUp() {
    this.isLoading = true;
    this.isSubmitted = true;
    if (this.signUpForm.valid) {
      let value = this.signUpForm.value;
      this.http.post("signup", value, AUTHSERVICE).then((res:ResponseModel) => {
        if (res.ResponseBody) {
          this.jwtService.setLoginDetail(res.ResponseBody);
          let userId = res.ResponseBody.UserDetail.UserId;
          this.isLoading = false;
          this.isSubmitted = false;
          Toast("Sign Up successfully");
          this.nav.navigate(AccountSetup, userId);
          // [routerLink]="['/AccountSetup']"
        }
      }).catch(e => {
        this.isLoading = false;
        this.isSubmitted = false;
      })
    } else {
      this.isLoading = false;
      ErrorToast("Please fill all the mandatory filled");
    }
  }

  get f() {
    return this.signUpForm.controls;
  }

  changeTab() {
    this.isSubmitted = false;
  }
}
