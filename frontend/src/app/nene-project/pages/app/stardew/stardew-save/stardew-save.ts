import { Component, DestroyRef, inject } from '@angular/core';
import { StardewService } from '../../../../services/stardew.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-stardew',
  imports: [DecimalPipe],
  templateUrl: './stardew-save.html',
  styleUrl: './stardew-save.css',
})
export class StardewSave {
  private readonly stardewService = inject(StardewService);
  private readonly destroyRef = inject(DestroyRef);
  saves = this.stardewService.saves;

  constructor(){
    const reloadSave = setInterval(()=>{
      this.saves.reload();
    },1_000 * 60 * 15)
    this.destroyRef.onDestroy(()=>{
      clearInterval(reloadSave);
    })
  }
}
