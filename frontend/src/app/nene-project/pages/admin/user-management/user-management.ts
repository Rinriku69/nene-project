import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { PaginationResponse, ResouceErrorResponse, UserResource } from '../../../models/Resource';
import { Icons } from '../../../components/icons/icons';

@Component({
  selector: 'app-user-management',
  imports: [Icons],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement implements OnInit {
  private readonly adminService = inject(AdminService);
  
  protected readonly userListResponse = signal<PaginationResponse<UserResource>|null>(null);
  
  ngOnInit(){
    this.adminService.getUserList().subscribe({
      next:(response) =>{
        this.userListResponse.set(response);
      },
      error: (err: ResouceErrorResponse) => {
        console.error(err.error.message)
      }
    })
  }
}
