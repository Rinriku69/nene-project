import { inject, Service, signal } from '@angular/core';
import { StardewSaveResource } from '../models/StardewModel';
import { httpResource } from '@angular/common/http';
import { AuthService } from './auth.service';

@Service()
export class StardewService {
  private readonly baseApiUrl = '/api';
  loadSave = signal<boolean>(false);
  readonly saves = httpResource<StardewSaveResource[]>(() => {
  return this.loadSave() ?  
  `${this.baseApiUrl}/stardew/getSaves`
  : undefined
  });

}
