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

export interface SafeZoneModel {
  message:string;
  theme_color:string;
  pos_x:number;
  pos_y:number;
  unlocked_at:string|null;
  is_public:boolean;
}