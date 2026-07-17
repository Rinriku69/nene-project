import { Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StardewPlayerResource } from '../../../../models/StardewModel';
import { StardewService } from '../../../../services/stardew.service';

@Component({
  selector: 'app-stardew-player-list',
  imports: [DatePipe, RouterLink],
  templateUrl: './stardew-player-list.html',
  styleUrl: './stardew-player-list.css',
})
export class StardewPlayerList {
  id = input.required<string>();
  private readonly stardewService = inject(StardewService);
  saves = this.stardewService.saves;
  players = computed<StardewPlayerResource[]>(() => {
    const saveResource = this.stardewService.saves;
    if (saveResource.hasValue()) {
      const saves = saveResource.value();
      const players = saves.find((v) => v.id.toString() == this.id())?.players ;

      return players ? players : [];
    }

    return [];
  });

  formatPlayTime(ms: number): string {
    const totalMinutes = Math.floor(ms / 60_000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  }
}
