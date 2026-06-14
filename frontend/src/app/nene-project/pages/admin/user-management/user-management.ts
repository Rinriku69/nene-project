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
import { NotificationModel, UpdateUserForm } from '../../../models/FormModel';

@Component({
  selector: 'app-user-management',
  imports: [Icons, FormField],
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
  }

  setRole(role: string) {
    this.searchTerm.update((v) => ({ ...v, role }));
    this.search();
  }

  protected readonly isEditModalOpen = signal(false);
  protected readonly isNotiModalOpen = signal(false);
  protected readonly isGiveawayModalOpen = signal(false);

  protected readonly updateUserModel: WritableSignal<UpdateUserForm> = signal({
    id: null,
    username: '',
    email: '',
    role: '',
    currency: 0,
  });

  protected readonly notificationModel = signal<NotificationModel>({
    title: '',
    message: '',
  });

  protected readonly giveawayGemsModel = signal({
    amount: 0,
  });

  protected readonly sendNotificationForm = form(this.notificationModel, (path) => {
    (required(path.title), required(path.message));
  });

  protected readonly giveawayGemsForm = form(this.giveawayGemsModel, (path) => {
    required(path.amount);
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
  protected openNotiModal() {
    this.notificationModel.set({
      title: '',
      message: '',
    });
    this.isNotiModalOpen.set(true);
  }
  protected openGiveawayModal() {
    this.giveawayGemsModel.set({
      amount: 0,
    });
    this.isGiveawayModalOpen.set(true);
  }

  protected closeEditModal() {
    this.isEditModalOpen.set(false);
  }
  protected closeNotiModal() {
    this.isNotiModalOpen.set(false);
  }
  protected closeGiveawayModal() {
    this.isGiveawayModalOpen.set(false);
  }

  submitNoti() {
    this.adminService.sendNoti(this.sendNotificationForm().value()).subscribe({
      next: (res) => {
        alert(`${res.message}`);
        this.closeNotiModal();
      },
    });
  }

  submitGiveaway() {
    this.adminService.gemGiveaway(this.giveawayGemsForm().value()).subscribe({
      next: (res) => {
        alert(res.message);
        this.closeGiveawayModal();
        this.loadUser();
      },
    });
  }

  protected submitUpdate() {
    if (this.updateUserForm().invalid()) return;

    this.adminService.updateUser(this.updateUserForm().value()).subscribe({
      next: (res) => {
        alert(res.message);
        this.loadUser();
      },
      error: (err: ResourceErrorResponse) => {
        alert(err.error.message);
      },
    });
    this.closeEditModal();
  }

  private loadUser(): void {
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
    this.loadUser();
  }
}
