import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  hidePW: boolean = true;
  hidePWC: boolean = true;

  constructor(private formBuilder: FormBuilder,
              private snackBar: MatSnackBar) { }

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

    // Do sign up action
    let snackBarRef = this.snackBar.open('Sign up successful!', null, {panelClass: ['bg-success', 'text-white'], duration: 1000} );
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
