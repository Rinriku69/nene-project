import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InventoryItem, PaginationResponse } from '../models/Resource';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private readonly http = inject(HttpClient);
  private readonly baseApiUrl = 'http://localhost:8000/api';
  getInventory(page: number = 1): Observable<PaginationResponse<InventoryItem>> {
    return this.http.get<PaginationResponse<InventoryItem>>(
      `${this.baseApiUrl}/getInventory?page=${page}`,
    );
  }
}
