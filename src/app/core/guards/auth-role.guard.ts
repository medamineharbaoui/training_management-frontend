import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthRoleGuard implements CanActivate {
  private router = inject(Router);
  private localStorage = inject(LocalStorageService);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = this.localStorage.getItem('accessToken');
    const expectedRole = route.data['role'] as string;
    const user = JSON.parse(this.localStorage.getItem('user') || '{}');

    // Not logged in
    if (!token || !user?.id) {
      this.router.navigate(['/login']);
      return false;
    }

    // Role mismatch
    if (expectedRole && user.role !== expectedRole) {
      this.router.navigate(['/login']); // Or a "Not authorized" page
      return false;
    }

    return true;
  }
}
