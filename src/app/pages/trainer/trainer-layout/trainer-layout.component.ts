import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-trainer-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './trainer-layout.component.html',
  styleUrls: ['./trainer-layout.component.scss']
})
export class TrainerLayoutComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  onLogout() {
    this.authService.logout();          // Remove tokens
    this.router.navigate(['/login']);    // Redirect to login page
  }
}
