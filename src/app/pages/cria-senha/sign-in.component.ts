import { CustomSnackBarService } from "../../shared/components/custom-snack-bar/custom-snack-bar.service";
import { AuthRequest } from "../../models/auth/auth-request";
import { environment } from "../../../environments/environment";
import { AuthService } from "../../services/auth.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { emailValidator } from "src/app/shared/utils/app.validator";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { AESService } from 'src/app/shared/components/aes/aesservice';

@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.css"],
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;
  ambiente: String;
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: CustomSnackBarService,
  ) {}

  ngOnInit() {
    this.ambiente = environment.envDesc;
    this.createForm();
  }

  private createForm() {
    this.signInForm = this.formBuilder.group({
      email: ["", Validators.compose([Validators.required])],
      password: ["", Validators.compose([Validators.required]),
      ],
    });
  }

  login(values: Object) {
    if (this.signInForm.valid) {
      this.isLoading = true;
      const authRequest: AuthRequest = {
        email: values["email"],
        password: values["password"],
      };
      this.authService.login(authRequest);      
    }
  }
}
