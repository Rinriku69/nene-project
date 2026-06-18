import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { Icons } from '../icons/icons';

@Component({
  selector: 'app-loading-component',
  imports: [Icons],
  templateUrl: './loading-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './loading-component.css',
})
export class LoadingComponent {
  protected readonly loadingService = inject(LoadingService);
  classAttribute = input<string>('');
}
