import { Component, computed, inject, signal } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { ResourceErrorResponse } from '../../models/Resource';
import { Icons } from '../../components/icons/icons';

@Component({
  selector: 'app-profile',
  imports: [Icons],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private readonly profileService = inject(ProfileService);
  private readonly authService = inject(AuthService);

  protected readonly isUploading = signal<boolean>(false);
  readonly user = this.authService.currentUserState;
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  uploadSuccess = signal(false);
  uploadFail = signal(false);

  readonly displayImageUrl = computed(() => {
    return this.previewUrl() ?? this.user()?.image_url ?? null;
  });

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.selectedFile.set(file);
    this.uploadSuccess.set(false);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      this.previewUrl.set(null);
    }
  }

  onSubmit() {
    const file = this.selectedFile();
    if (!file) return;
    this.isUploading.set(true)
    const formData = new FormData();
    formData.append('avatar', file, file.name);

    this.profileService.uploadProfile(formData).subscribe({
      next: (res) => {
        console.log(res.message);
        this.uploadSuccess.set(true);
        this.selectedFile.set(null);
        this.isUploading.set(false);
        this.authService.getUser().subscribe();
      },
      error: (er: ResourceErrorResponse) => {
        this.isUploading.set(false);
        this.uploadFail.set(true);
        console.error(er.message);
      },
    });
  }
}
