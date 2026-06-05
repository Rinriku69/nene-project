import { Component, inject } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { Icons } from '../icons/icons';

@Component({
  selector: 'app-loading-component',
  imports: [Icons],
  templateUrl: './loading-component.html',
  styleUrl: './loading-component.css',
})
export class LoadingComponent {
  protected readonly loadingService = inject(LoadingService);
}
