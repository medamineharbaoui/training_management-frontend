import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {InputText} from 'primeng/inputtext';
import {Select} from 'primeng/select';
import {ButtonDirective} from 'primeng/button';
import {Password} from 'primeng/password';
import {Router, RouterLink} from '@angular/router';
import {MessageService} from 'primeng/api';
import {AuthService} from '../../core/services/auth.service';

export interface User {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'trainer' | 'participant';
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputText, Select, ButtonDirective, Password, RouterLink],
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Trainer', value: 'trainer' },
    { label: 'Participant', value: 'participant' }
  ];

  auth = inject(AuthService);
  messageService = inject(MessageService);
  fb = inject(FormBuilder);
  private router = inject(Router); // Inject Router

  constructor() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['participant', Validators.required] // Make sure role is part of form
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.auth.register(this.registerForm.value).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'User registered' });
          this.router.navigate(['/participant/my-workshops']); // Redirect after success
        },
        error: err => this.messageService.add({ severity: 'error', summary: 'Registration failed', detail: err.error?.message })
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
