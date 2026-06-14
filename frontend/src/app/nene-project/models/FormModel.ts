export interface UpdateUserForm {
  id: number | null;
  username: string;
  email: string;
  role: string;
  currency: number;
}

export interface NotificationModel {
  title: string;
  message: string;
}