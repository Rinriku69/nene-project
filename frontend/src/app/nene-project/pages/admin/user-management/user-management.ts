import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import {
  filterTerm,
  PaginationResponse,
  ResouceErrorResponse,
  UserResource,
} from '../../../models/Resource';
import { Icons } from '../../../components/icons/icons';

@Component({
  selector: 'app-user-management',
  imports: [Icons],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement implements OnInit {
  private readonly adminService = inject(AdminService);

  protected readonly userListResponse = signal<PaginationResponse<UserResource> | null>(null);

  readonly searchTerm = signal<filterTerm>({
    search: null,
    role: null,
  });

  search() {
    this.adminService.getUserList(this.searchTerm()).subscribe({
      next: (res) => {
        this.userListResponse.set(res);
      },
    });
  }

  setSearch(search: string) {
    this.searchTerm.update((v) => ({ ...v, search }));
    console.log(this.searchTerm());
  }

  setRole(role: string) {
  this.searchTerm.update((v) => ({ ...v, role }));
  this.search();
}

  ngOnInit() {
    this.adminService.getUserList(this.searchTerm()).subscribe({
      next: (response) => {
        this.userListResponse.set(response);
      },
      error: (err: ResouceErrorResponse) => {
        console.error(err.error.message);
      },
    });
  }
}
