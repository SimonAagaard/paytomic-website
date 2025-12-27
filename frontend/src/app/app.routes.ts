import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'om-os',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'hvordan-virker-det',
    loadComponent: () => import('./pages/how-it-works/how-it-works.component').then(m => m.HowItWorksComponent)
  },
  {
    path: 'priser',
    loadComponent: () => import('./pages/pricing/pricing.component').then(m => m.PricingComponent)
  },
  {
    path: 'kontakt',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'privacy',
    loadComponent: () => import('./pages/privacy/privacy.component').then(m => m.PrivacyComponent)
  },
  {
    path: 'vilkaar',
    loadComponent: () => import('./pages/terms/terms.component').then(m => m.TermsComponent)
  },
  {
    path: 'cookie-politik',
    loadComponent: () => import('./pages/cookies/cookies.component').then(m => m.CookiesComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
