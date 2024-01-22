import { Component, OnInit } from '@angular/core';
import {AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../services/auth.service";
import {finalize} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signUpForm: UntypedFormGroup;
  hidePW: boolean = true;
  hidePWC: boolean = true;
  loading: boolean;

  constructor(private formBuilder: UntypedFormBuilder,
              private snackBar: MatSnackBar,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      passwordConfirm: [null, [Validators.required, Validators.minLength(8)]],

      company: [{value: 'FH Technikum Wien', disabled: true}],
      street: [null, Validators.required],
      city: [null, Validators.required],
      zip: [null, Validators.required],
    })
  }

  submit() {
    if(this.signUpForm.invalid)
      return;
    if(this.password.value != this.passwordConfirm.value) {
      this.snackBar.open('Passwords do not match.', null, {panelClass: ['bg-danger', 'text-white'], duration: 2000} );
      return;
    }

    this.loading = true;
    this.authService.signUp(
      this.email.value,
      this.password.value,
      this.company.value,
      this.city.value,
      this.street.value,
      this.zip.value
    )
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (user) => {
          console.log(user);
          this.snackBar.open('Sign up successful!', null, {panelClass: ['bg-success', 'text-white'], duration: 1000} );
          this.router.navigate(['login']);
        },
        error: (e) => {
          console.log(e);
          this.snackBar.open(e.error.message, null, {panelClass: ['bg-danger', 'text-white'], duration: 2000} );
        }
      })
  }

  get email(): AbstractControl {
    return this.signUpForm.get('email');
  }

  get password(): AbstractControl {
    return this.signUpForm.get('password');
  }

  get passwordConfirm(): AbstractControl {
    return this.signUpForm.get('passwordConfirm');
  }

  get company(): AbstractControl {
    return this.signUpForm.get('company');
  }

  get street(): AbstractControl {
    return this.signUpForm.get('street');
  }

  get city(): AbstractControl {
    return this.signUpForm.get('city');
  }

  get zip(): AbstractControl {
    return this.signUpForm.get('zip');
  }

}
