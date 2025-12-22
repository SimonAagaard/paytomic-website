import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NzButtonModule,
    NzCardModule,
    NzGridModule,
    NzIconModule,
    NzStatisticModule,
    NzCollapseModule,
    NzDividerModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  email = 'hello@paytomic.dk';
  
  features = [
    {
      icon: 'mail',
      title: 'Automatisk opfølgning',
      description: 'Send professionelle påmindelser automatisk når fakturaer bliver forsinket. Aldrig glem en faktura igen.'
    },
    {
      icon: 'api',
      title: 'Integration med dit bogføringssystem',
      description: 'Fungerer problemfrit med dit eksisterende bogføringssystem som Dinero og Economic.'
    },
    {
      icon: 'setting',
      title: 'Du bevarer kontrollen',
      description: 'Beslut selv hvornår og hvordan påmindelser sendes. Automatisering på dine præmisser.'
    },
    {
      icon: 'safety',
      title: 'Professionel kommunikation',
      description: 'Velformulerede påmindelser der er høflige men effektive. Vedligehold gode kunderelationer.'
    },
    {
      icon: 'fund',
      title: 'Forbedret likviditet',
      description: 'Få betalt hurtigere og forbedre din virksomheds cashflow med konsekvent opfølgning.'
    },
    {
      icon: 'dashboard',
      title: 'Overblik og rapporter',
      description: 'Se status på alle ubetalte fakturaer og få indsigt i din virksomheds betalingsmønstre.'
    }
  ];

  howItWorks = [
    {
      number: '1',
      icon: 'link',
      title: 'Tilslut dit bogføringssystem',
      description: 'Forbind Paytomic med dit eksisterende bogføringssystem på få minutter.'
    },
    {
      number: '2',
      icon: 'setting',
      title: 'Konfigurer dine præferencer',
      description: 'Vælg hvornår påmindelser skal sendes, og tilpas beskederne til din virksomhed.'
    },
    {
      number: '3',
      icon: 'check-circle',
      title: 'Lad automatiseringen arbejde',
      description: 'Paytomic følger automatisk op på ubetalte fakturaer og stopper når de betales.'
    }
  ];

  faqs = [
    {
      question: 'Hvad er early access?',
      answer: 'Early access giver dig mulighed for at være blandt de første til at bruge Paytomic og give feedback der former produktet.',
      active: false
    },
    {
      question: 'Hvilke bogføringssystemer forventer i at understøtte?',
      answer: 'Vi forventer at integrere med de mest populære danske bogføringssystemer inklusiv Dinero, Economic og Billy. Vi arbejder løbende på at tilføje flere.',
      active: false
    },

  ];
}
