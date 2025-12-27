import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class HowItWorksComponent {
  email = 'kontakt@paytomic.com';
}
