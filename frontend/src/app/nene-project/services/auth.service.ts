import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, linkedSignal, Resource, signal } from '@angular/core';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { LoginModel, RegisterModel, User } from '../models/AuthModel';
import { NotificationItem, Notifications, ResourceResponse } from '../models/Resource';
import co from '@angular/common/locales/co';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseApiUrl = 'http://localhost:8000/api';
  private readonly currentUser = signal<User | null>(null);
  readonly currentUserState = linkedSignal(() => this.currentUser());
  readonly isLoggedIn = computed(() => this.currentUser() !== null);
  readonly notifications = signal<NotificationItem[] | null>(null);

  getCSRFToken(): Observable<ResourceResponse> {
    return this.http.get<ResourceResponse>('http://localhost:8000/sanctum/csrf-cookie');
  }

  register(registerFormData: RegisterModel): Observable<ResourceResponse> {
    return this.http.post<ResourceResponse>(`${this.baseApiUrl}/auth/register`, registerFormData);
  }

  login(credentials: LoginModel): Observable<ResourceResponse> {
    return this.http.post<ResourceResponse>(`${this.baseApiUrl}/auth/login`, credentials);
  }

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.baseApiUrl}/getUser`).pipe(
      tap((user) => {
        this.currentUser.set(user);
      }),
    );
  }

  getNotification(): Observable<NotificationItem[]> {
    return this.http.get<NotificationItem[]>(`${this.baseApiUrl}/getNoti`).pipe(
      tap((noti) => {
        this.notifications.set(noti);
      }),
    );
  }

  markNotiAsReadAll() {
    return this.http.post<ResourceResponse>(`${this.baseApiUrl}/markAsReadAll`, {});
  }

  logout(): Observable<ResourceResponse> {
    return this.http
      .post<ResourceResponse>(`${this.baseApiUrl}/auth/logout`, {})
      .pipe(tap(() => this.currentUser.set(null)));
  }

  hydrateAuthState() {
    return this.getUser().pipe(
      switchMap((user) => {
        if (user) {
          return this.getNotification().pipe(catchError(() => of(null)));
        }
        return of(null);
      }),
      catchError(() => {
        this.currentUser.set(null);
        return of(null);
      }),
    );
  }
}
