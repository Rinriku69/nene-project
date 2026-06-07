import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { GachaItem, ResouceErrorResponse } from '../../../models/Resource';
import { GachaService } from '../../../services/gacha.service';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-gacha',
  imports: [],
  templateUrl: './gacha.html',
  styleUrl: './gacha.css',
})
export class Gacha {
  private readonly authService = inject(AuthService);
  private readonly gachaService = inject(GachaService)
  private readonly loadingService = inject(LoadingService)
  currentUser = computed(() => this.authService.currentUserState());
  isRolling = computed(()=> this.loadingService.isLoading());
  pullResults = signal<GachaItem[] | null>(null);
  selectedItem = signal<GachaItem | null>(null);

  viewItem(item: GachaItem) {
    this.selectedItem.set(item);
  }

  closeItem() {
    this.selectedItem.set(null);
  }

  roll(amount: number) {
    if (this.isRolling()) return;
    
    this.pullResults.set(null);
    
    this.gachaService.gachaRoll(amount).subscribe({
      next:(response)=>{
        this.pullResults.set(response.results)
        this.authService.getUser().subscribe();
      },
      error:(error:ResouceErrorResponse)=>{
        console.error(error)
      }
    })
  }

  closeResults() {
    this.pullResults.set(null);
  }


}
