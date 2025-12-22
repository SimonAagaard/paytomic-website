import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzCardModule,
    NzGridModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  email = 'hello@paytomic.dk';
  
  features = [
    {
      title: 'Automatisk opfølgning',
      description: 'Send professionelle påmindelser automatisk når fakturaer bliver forsinket.'
    },
    {
      title: 'Integration med dit bogføringssystem',
      description: 'Fungerer problemfrit med dit eksisterende bogføringssystem som Dinero.'
    },
    {
      title: 'Du bevarer kontrollen',
      description: 'Beslut selv hvornår og hvordan påmindelser sendes. Automatisering på dine præmisser.'
    }
  ];
}
