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
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

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
    NzDividerModule,
    FadeInDirective
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  email = 'hello@paytomic.dk';
  
  features = [
    {
      icon: 'mail',
      color: '#2563EB',
      title: 'Automatisk opfølgning',
      description: 'Send professionelle påmindelser automatisk når fakturaer bliver forsinket. Aldrig glem en faktura igen.'
    },
    {
      icon: 'api',
      color: '#8FA99B',
      title: 'Integration med dit bogføringssystem',
      description: 'Fungerer problemfrit med dit eksisterende bogføringssystem som Dinero og Economic.'
    },
    {
      icon: 'setting',
      color: '#F59E0B',
      title: 'Du bevarer kontrollen',
      description: 'Beslut selv hvornår og hvordan påmindelser sendes. Automatisering på dine præmisser.'
    },
    {
      icon: 'safety-certificate',
      color: '#10B981',
      title: 'Professionel kommunikation',
      description: 'Velformulerede påmindelser der er høflige men effektive. Vedligehold gode kunderelationer.'
    },
    {
      icon: 'fund',
      color: '#8B5CF6',
      title: 'Forbedret likviditet',
      description: 'Få betalt hurtigere og forbedre din virksomheds cashflow med konsekvent opfølgning.'
    },
    {
      icon: 'dashboard',
      color: '#EF4444',
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
      icon: 'rocket',
      iconColor: '#8FA99B',
      question: 'Hvad er early access?',
      answer: 'Early access giver dig mulighed for at være blandt de første til at bruge Paytomic og give feedback der former produktet. Du får gratis adgang og kan påvirke funktioner og udvikling.',
      active: false
    },
    {
      icon: 'api',
      iconColor: '#2563EB',
      question: 'Hvilke bogføringssystemer forventer i at understøtte?',
      answer: 'Vi forventer at integrere med de mest populære danske bogføringssystemer inklusiv Dinero, Economic og Billy. Vi arbejder løbende på at tilføje flere baseret på feedback fra vores brugere.',
      active: false
    },
    {
      icon: 'safety-certificate',
      iconColor: '#10B981',
      question: 'Er mine data sikre?',
      answer: 'Ja, vi tager datasikkerhed meget alvorligt. Vi bruger kryptering, sikre OAuth-forbindelser. Vi opbevarer kun de data der er nødvendige for at sende påmindelser.',
      active: false
    },
    {
      icon: 'dollar',
      iconColor: '#F59E0B',
      question: 'Hvad kommer det til at koste?',
      answer: 'Early access er helt gratis. Når vi lancerer officielt, vil vi have en fleksibel prismodel baseret på antal fakturaer. Du får altid besked i god tid før eventuelle betalinger.',
      active: false
    },
    {
      icon: 'clock-circle',
      iconColor: '#8B5CF6',
      question: 'Hvor lang tid tager det at sætte op?',
      answer: 'De fleste kommer i gang på under 10 minutter. Du tilslutter dit bogføringssystem, vælger dine præferencer, og så er du klar til at automatisere dine påmindelser.',
      active: false
    },
    {
      icon: 'edit',
      iconColor: '#EF4444',
      question: 'Kan jeg tilpasse påmindelserne?',
      answer: 'Absolut! Du har fuld kontrol over timing, tone og indhold i dine påmindelser. Brug vores skabeloner eller skriv dine egne beskeder helt fra bunden.',
      active: false
    }
  ];
}
