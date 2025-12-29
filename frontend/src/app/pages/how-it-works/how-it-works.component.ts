import { Component, OnInit, OnDestroy, ChangeDetectorRef, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    NzCardModule,
    NzGridModule,
    NzIconModule,
    NzTimelineModule,
    NzButtonModule,
    FadeInDirective
  ],
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.css']
})
export class HowItWorksComponent implements OnInit, OnDestroy {
  email = 'kontakt@paytomic.com';

  accountingSystems = [
    {
      name: 'Dinero',
      logo: '/assets/images/dinero-logo.png',
      description: 'Regnskabssystem'
    },
    {
      name: 'e-conomic',
      logo: '/assets/images/e-conomic-logo.png',
      description: 'Regnskabssystem'
    },
    {
      name: 'Billy',
      logo: '/assets/images/billy-logo.png',
      description: 'Regnskabssystem'
    }
  ];

  currentSystem = this.accountingSystems[0];
  isTransitioning = false;
  progress = 0;
  private intervalId: any;
  private progressInterval: any;

  constructor(
    private cdr: ChangeDetectorRef, 
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Only run interval in browser, not during SSR
    if (isPlatformBrowser(this.platformId)) {
      this.startRotation();
    }
  }

  private startRotation() {
    const rotationDuration = 5000; // 5 seconds
    const progressStep = 50; // Update every 50ms

    // Progress bar animation
    this.progressInterval = setInterval(() => {
      this.progress += (100 / (rotationDuration / progressStep));
      if (this.progress >= 100) {
        this.progress = 100;
      }
      this.cdr.markForCheck();
    }, progressStep);

    // Rotate accounting systems every 3 seconds
    this.intervalId = setInterval(() => {
      // Start fade out
      this.isTransitioning = true;
      this.cdr.markForCheck();

      // After fade out completes (300ms), switch content and fade in
      setTimeout(() => {
        const currentIndex = this.accountingSystems.indexOf(this.currentSystem);
        const nextIndex = (currentIndex + 1) % this.accountingSystems.length;
        this.currentSystem = this.accountingSystems[nextIndex];
        this.progress = 0; // Reset progress
        this.isTransitioning = false;
        this.cdr.markForCheck();
      }, 300);
    }, rotationDuration);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }
}
