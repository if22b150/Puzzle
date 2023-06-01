import {Component, OnInit} from '@angular/core';
import {AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup;
  hidePW: boolean = true;

  constructor(private formBuilder: UntypedFormBuilder,
              private snackBar: MatSnackBar,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, Validators.required]
    })
  }

  submit() {
    if(this.loginForm.invalid)
      return;

    // Do log in action
    this.authService.login(
      this.email.value,
      this.password.value
    ).subscribe({
      next: (user: User) => {
        this.snackBar.open(`Login successful! Welcome ${user.username}`, null, {panelClass: ['bg-success', 'text-white'], duration: 1000} );

        // Set User in service
        this.authService.user = user;
        this.router.navigate(['dashboard']);
      } ,
      error: (e) => {
        this.snackBar.open(`Login failed! ${e.error.message}` , null, {panelClass: ['bg-danger', 'text-white'], duration: 1000} );
        console.log('Login failed.');
      }
    });
  }

  get email(): AbstractControl {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl {
    return this.loginForm.get('password');
  }
}
