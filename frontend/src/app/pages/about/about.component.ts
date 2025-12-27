import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

interface Milestone {
  date: string;
  title: string;
  description: string;
  isPast: boolean;
  inProgress?: boolean;
}

interface Founder {
  name: string;
  role: string;
  bio: string;
  image?: string;
  linkedin?: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, NzTimelineModule, NzIconModule, NzGridModule, NzCardModule, NzAvatarModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  milestones: Milestone[] = [
    {
      date: 'Q4 2025',
      title: 'Virksomheden grundlagt',
      description: 'Paytomic blev officielt stiftet med visionen om at automatisere fakturapåmindelser for danske virksomheder.',
      isPast: true
    },
    {
      date: 'Q4 2025',
      title: 'Early access lanceret',
      description: 'Vi inviterede de første danske virksomheder til at afprøve Paytomic og hjælpe med at forme produktet.',
      isPast: true
    },
    {
      date: 'Q1 2026',
      title: 'Visma Dinero integration',
      description: 'Integration med Visma Dinero gør det nemt at synkronisere fakturaer og automatisere opfølgning.',
      isPast: false,
      inProgress: true
    },
    {
      date: 'Q1 2026',
      title: 'Offentlig lancering',
      description: 'Exit early access og åbning for alle danske virksomheder.',
      isPast: false
    },
    {
      date: 'Q2 2026',
      title: 'Economic integration',
      description: 'Integration med Danmarks mest populære regnskabssystem.',
      isPast: false
    },
    {
      date: 'Q3 2026',
      title: 'Billy integration',
      description: 'Integration med Billy for at nå endnu flere brugere.',
      isPast: false
    },
    {
      date: 'Q4 2026',
      title: '100+ aktive kunder',
      description: 'Milepæl for at hjælpe 100+ danske virksomheder med bedre likviditet.',
      isPast: false
    }
  ];

  founders: Founder[] = [
    {
      name: 'Simon Aagaard',
      role: 'Stifter',
      bio: 'Med erfaring fra et årti i softwareudvikling og konsulentbranchen og en tro på at monitorering og opfølgning på forfaldne fakturaer ikke skal stjæle fokus fra kerneforretningen, vil jeg med Paytomic hjælpe virksomheder med at forbedre deres likviditet gennem automatisering.',
      image: 'assets/images/portrait_transparent_1_1.png',
      linkedin: 'https://www.linkedin.com/in/simon-aagaard-82725b159'
    }
  ];
}
