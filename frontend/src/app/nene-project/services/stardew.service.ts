import { Service, signal } from '@angular/core';
import { StardewSaveResource } from '../models/StardewModel';
import { httpResource } from '@angular/common/http';

@Service()
export class StardewService {
  private readonly baseApiUrl = '/api';
  readonly saves = httpResource<StardewSaveResource[]>(() => `${this.baseApiUrl}/stardew/getSaves`);
}
