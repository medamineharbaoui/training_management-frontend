import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import {SelectModule} from 'primeng/select';
import {User} from '../../../core/models/user.model';
import {UsersService} from '../../../core/services/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    SelectModule,
    DialogModule,
    ToastModule,
    HttpClientModule
  ],
  templateUrl: './users.component.html',
  providers: [MessageService]
})
export class UsersComponent implements OnInit {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private http = inject(HttpClient);
  private usersService = inject(UsersService)

  users: User[] = [];
  roles = ['admin', 'trainer', 'participant'];
  dialogVisible = false;
  editingUser: User | null = null;
  roleForm: FormGroup;

  constructor() {
    this.roleForm = this.fb.group({
      role: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.getAll().subscribe({
      next: (data) => this.users = data,
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load users' })
    });
  }

  openDialog(user: User) {
    this.editingUser = user;
    this.roleForm.setValue({ role: user.role });
    this.dialogVisible = true;
  }

  submit() {
    if (this.roleForm.invalid || !this.editingUser) return;

    const updatedRole = this.roleForm.value.role;
    const updatedUser = { ...this.editingUser, role: updatedRole };

    this.usersService.updateUserRole(updatedUser).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'User role updated' });
        this.dialogVisible = false;
        this.loadUsers();
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update user role' })
    });
  }
}
