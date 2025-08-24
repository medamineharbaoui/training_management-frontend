import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Password} from 'primeng/password';
import {InputText} from 'primeng/inputtext';
import {RouterLink} from '@angular/router';
import {ButtonDirective} from 'primeng/button';
import {AuthService} from '../../core/services/auth.service';
import {MessageService} from 'primeng/api';
import { UsersService } from '../../core/services/users.service';
import { Router } from '@angular/router';
import { WorkshopService } from '../../core/services/workshop.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Password, InputText, RouterLink, ButtonDirective],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private auth: AuthService,
              private usersService: UsersService,
              private router: Router,
              private fb: FormBuilder,
              private workshopService: WorkshopService,
              private messageService: MessageService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const {username, password} = this.loginForm.value;
      this.auth.login(username, password).subscribe({
        next: () => {
          this.messageService.add({severity: 'success', summary: 'Login successful'});
          this.usersService.getByUsername(username).subscribe({next: (user) => {
              if (user.role === 'admin') {
                this.router.navigate(['/admin']);
              }
              else if (user.role === 'trainer') {
                this.router.navigate(['/trainer']);
              }
              else {
                this.router.navigate(['/participant']);
              }
              localStorage.setItem('user', JSON.stringify(user));
            }})
        },
        error: (err) => {
          console.log(err)
          this.messageService.add({
            severity: 'error',
            summary: 'Login failed',
            detail: err.error.message || 'Invalid credentials'
          });
        }
      });
    }
  }
}
  