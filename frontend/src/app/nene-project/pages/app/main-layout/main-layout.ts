import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Icons } from "../../../components/icons/icons";

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLinkWithHref, Icons],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly currentUser = computed(()=>this.authService.currentUserState());

  logout(){
    return this.authService.logout().subscribe({
      next:(response)=>{
        this.router.navigate(['/auth/login']);
      },
      error:(error)=>{
        console.warn("Log out error, Please try again")
      }
    })
  }
}
