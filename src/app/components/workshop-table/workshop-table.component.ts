import {Component, Input, Output, EventEmitter, OnInit, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Workshop} from '../../core/models/workshop.model';
import {TableModule} from 'primeng/table';
import {ButtonDirective} from 'primeng/button';
import {Router} from '@angular/router';
import {WorkshopService} from '../../core/services/workshop.service';
import {MessageService} from 'primeng/api';
import {Tooltip} from 'primeng/tooltip';
import { UsersService } from '../../core/services/users.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-workshop-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonDirective, Tooltip],
  templateUrl: './workshop-table.component.html'
})
export class WorkshopTableComponent implements OnInit{
  @Input() workshops: Workshop[] = [];
  userRole : 'admin' | 'trainer' | 'participant' = 'participant';

  @Output() edit = new EventEmitter<Workshop>();
  @Output() delete = new EventEmitter<Workshop>();
  @Output() enroll = new EventEmitter<Workshop>();
  @Input() trainers: { label: string, value: number }[] = [];

  private router = inject(Router);
  private workshopService = inject(WorkshopService);
  private messageService = inject(MessageService);
  private usersService = inject(UsersService);
  private localStorage = inject(LocalStorageService); 


  ngOnInit(): void {
    const url = this.router.url;
    if (url.includes('/admin')) this.userRole = 'admin';
    else if (url.includes('/trainer')) this.userRole = 'trainer';

    if (!this.workshops?.length){
      this.workshopService.getAll().subscribe({
        next: data => {
          (this.workshops = data)
          let user : User | null = JSON.parse(this.localStorage.getItem('user') || 'null');
          if (!user){
            this.router.navigate(['/login']);
            return;
          }
          if (this.userRole === 'trainer'){
            this.workshops = this.workshops.filter(workshop => workshop.trainer === user!.id);
          }
          if (this.userRole === 'participant'){
            this.workshops.forEach(workshop => {
              this.workshopService.isEnrolled(workshop.id!).subscribe({
                next: (res) => {
                  (workshop as any).is_enrolled = res.is_enrolled;
                },
                error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to check enrollment status' })
              });
            });
          }
        

        },
        error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load workshops' })
      });
    }
    if (!this.trainers?.length){
      this.loadTrainers();
    }
  }

  loadTrainers() {
    return this.usersService.getAll().subscribe(allUsers => {
      this.trainers =  allUsers.filter(user => user.role === 'trainer')
      .map(user => ({ label: user.username, value: user.id! }));
    });
  }

  getTrainerName(trainerId: number): string {
    const trainer = this.trainers.find(t => t.value === trainerId);
    return trainer ? trainer.label : 'Unknown';
  }

  onEdit(workshop: Workshop) {
    this.edit.emit(workshop);
  }

  onEnroll(workshop: Workshop) {
    this.enroll.emit(workshop);
  }

  onDelete(workshop: Workshop) {
    this.delete.emit(workshop);
  }


}
