import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import {
  filterTerm,
  PaginationResponse,
  ResourceErrorResponse,
  UserResource,
} from '../../../models/Resource';
import { Icons } from '../../../components/icons/icons';
import { email, form, FormField, min, required } from '@angular/forms/signals';

export interface UpdateUserForm {
  id: number | null;
  username: string;
  email: string;
  role: string;
  currency: number;
}

@Component({
  selector: 'app-user-management',
  imports: [Icons,FormField],
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

  protected readonly isEditModalOpen = signal(false);

  protected readonly updateUserModel: WritableSignal<UpdateUserForm> = signal({
    id: null,
    username: '',
    email: '',
    role: '',
    currency: 0,
  });

  protected readonly updateUserForm = form(this.updateUserModel, (path) => {
    required(path.username, { message: 'Username is required' });
    required(path.email, { message: 'Email is required' });
    email(path.email, { message: 'Please enter a valid email' });
    required(path.role, { message: 'Role is required' });
    required(path.currency, { message: 'Currency is required' });
    min(path.currency, 0, { message: 'Currency cannot be negative' });
  });

  protected openEditModal(user: UserResource) {
    this.updateUserModel.set({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      currency: user.currency,
    });
    this.isEditModalOpen.set(true);
  }

  protected closeEditModal() {
    this.isEditModalOpen.set(false);
  }

  protected submitUpdate() {
    if (this.updateUserForm().invalid()) return;
    
    this.adminService.updateUser(this.updateUserForm().value()).subscribe({
      next:(res)=>{
        alert(res.message);
        this.lodaUser()
      },error:(err:ResourceErrorResponse)=>{
        alert(err.error.message);
      }
    });
    this.closeEditModal();
  }

  private lodaUser():void{
    this.adminService.getUserList(this.searchTerm()).subscribe({
      next: (response) => {
        this.userListResponse.set(response);
      },
      error: (err: ResourceErrorResponse) => {
        console.error(err.error.message);
      },
    });
  }

  ngOnInit() {
    this.lodaUser()
  }
}
