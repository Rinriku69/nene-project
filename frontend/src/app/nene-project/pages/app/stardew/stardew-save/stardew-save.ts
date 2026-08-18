import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { StardewService } from '../../../../services/stardew.service';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from "@angular/router";
import { Icons } from "../../../../components/icons/icons";

@Component({
  selector: 'app-stardew',
  imports: [DecimalPipe, RouterLink, Icons],
  templateUrl: './stardew-save.html',
  styleUrl: './stardew-save.css',
})
export class StardewSave implements OnInit{
  private readonly stardewService = inject(StardewService);
  private readonly destroyRef = inject(DestroyRef);
  saves = this.stardewService.saves;

  constructor(){
    const reloadSave = setInterval(()=>{
      this.saves.reload();
    },1_000 * 60 * 10)
    this.destroyRef.onDestroy(()=>{
      clearInterval(reloadSave);
    })
  }

  ngOnInit(){
    this.stardewService.loadSave.set(true);
  }
}
