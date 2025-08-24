import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import {WorkshopService} from '../../../core/services/workshop.service';
import {Workshop} from '../../../core/models/workshop.model';
import {DatePicker} from 'primeng/datepicker';
import {Dialog} from 'primeng/dialog';
import {WorkshopTableComponent} from '../../../components/workshop-table/workshop-table.component';
import { UsersService } from '../../../core/services/users.service';
import { Select, SelectModule } from 'primeng/select';

@Component({
  selector: 'app-workshop',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    SelectModule,
    DatePicker,
    Dialog,
    WorkshopTableComponent
  ],
  templateUrl: './workshop.component.html'
})
export class WorkshopComponent implements OnInit {
  private fb = inject(FormBuilder);
  private workshopService = inject(WorkshopService);
  private messageService = inject(MessageService);
  private usersService = inject(UsersService);

  workshops: Workshop[] = [];
  workshopForm: FormGroup;
  editingWorkshop: Workshop | null = null;
  dialogVisible = false;
  trainers : { label: string, value: number }[] = [];
  isLoading = false;

  constructor() {
    this.workshopForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: [null, Validators.required],
      trainer: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.loadWorkshops();
    this.loadTrainers();
  }

  loadTrainers() {
    return this.usersService.getAll().subscribe(allUsers => {
      this.trainers =  allUsers.filter(user => user.role === 'trainer')
      .map(user => ({ label: user.username, value: user.id! }));
    });
  }

  loadWorkshops() {
    this.isLoading = true;
    this.workshopService.getAll().subscribe({
      next: data => {
        (this.workshops = data);
        this.isLoading = false;
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load workshops' })
    });
  }

  openDialog(workshop?: Workshop) {
    this.editingWorkshop = workshop || null;
    if (workshop) {
      this.workshopForm.patchValue({
        title: workshop.title,
        description: workshop.description,
        date: new Date(workshop.date),
        trainer: workshop.trainer
      });
    } else {
      this.workshopForm.reset();
    }
    this.dialogVisible = true;
  }

  submit() {
    if (this.workshopForm.invalid) {
      this.workshopForm.markAllAsTouched();
      return;
    }

    const workshop: Workshop = this.workshopForm.value;

    if (this.editingWorkshop) {
      this.workshopService.update(this.editingWorkshop.id!, workshop).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Workshop updated' });
          this.loadWorkshops();
          this.dialogVisible = false;
        },
        error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update workshop' })
      });
    } else {
      this.workshopService.create(workshop).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Created', detail: 'Workshop created' });
          this.loadWorkshops();
          this.dialogVisible = false;
        },
        error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create workshop' })
      });
    }
  }

  delete(workshop: Workshop) {
    if (!confirm('Are you sure you want to delete this workshop?')) return;

    this.workshopService.delete(workshop.id!).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Workshop deleted' });
        this.loadWorkshops();
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete workshop' })
    });
  }
}
