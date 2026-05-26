import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Permitir acceso al dashboard sin login
    if (state.url === '/dashboard' || state.url === '/') {
      return true;
    }

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    const allowedRoleIds = (route.data?.['roleIds'] as number[] | undefined) ?? [];
    const allowedRoles = (route.data?.['roles'] as string[] | undefined) ?? [];
    if (allowedRoleIds.length === 0 && allowedRoles.length === 0) {
      return true;
    }

    const currentUser = this.authService.getUser();
    const currentRoleId = Number(currentUser?.rol?.rol_id ?? NaN);
    const currentRoleName = (currentUser?.rol?.nombre ?? '').trim().toLowerCase();

    const hasRoleById =
      allowedRoleIds.length > 0 &&
      Number.isFinite(currentRoleId) &&
      allowedRoleIds.some(rid => rid === currentRoleId);

    const hasRoleByName =
      allowedRoles.length > 0 &&
      !!currentRoleName &&
      allowedRoles.some(r => r.trim().toLowerCase() === currentRoleName);

    const hasRole = hasRoleById || hasRoleByName;

    if (!hasRole) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}
