import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

enum PricingPlan {
  EarlyAccess = 0,
  Professional = 1,
  Enterprise = 2,
}

enum LoginMethod {
  Basic = 0,
  Google = 1,
  Microsoft = 2,
}

interface SignupRequest {
  Email: string;
  Password?: string | null;
  FullName: string;
  Phone: string;
  CompanyName: string;
  PricingPlan: PricingPlan;
  PreferredLoginMethod: LoginMethod;
  OAuthToken?: string | null;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    NzStepsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzRadioModule,
    NzCardModule,
    NzIconModule,
    NzBadgeModule,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  currentStep = 0;
  signupForm: FormGroup;
  isSubmitting = false;

  private apiUrl = environment.apiUrl;
  private signupUrl = `${this.apiUrl}/signup`;

  PricingPlan = PricingPlan;
  LoginMethod = LoginMethod;

  // Early Access limited slots
  readonly totalEarlyAccessSlots = 5;
  earlyAccessSlotsRemaining = 5; // TODO: Fetch from backend

  pricingPlans = [
    {
      value: PricingPlan.EarlyAccess,
      name: 'Early Access',
      price: '0 kr/md',
      features: [
        'Ingen kreditkort påkrævet',
        'Tidlig adgang til paytomic',
        'Mulighed via feedback at påvirke fremtidige funktioner',
        '1 bruger',
      ],
      limited: true,
      badge: 'Begrænset antal pladser',
    },
  ];

  loginMethods = [
    {
      value: LoginMethod.Basic,
      name: 'Email og adgangskode',
      description: 'Traditionel login med email og adgangskode',
      icon: 'mail',
    },
    {
      value: LoginMethod.Google,
      name: 'Google',
      description: 'Log ind med din Google konto',
      icon: 'google',
    },
    {
      value: LoginMethod.Microsoft,
      name: 'Microsoft',
      description: 'Log ind med din Microsoft konto',
      icon: 'microsoft',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private http: HttpClient,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.signupForm = this.fb.group({
      // Step 1: Pricing Plan
      pricingPlan: [null, Validators.required],

      // Step 2: Basic Info
      fullName: ['', Validators.required],
      phone: ['', Validators.required],
      companyName: ['', Validators.required],
      vat: ['', Validators.required],

      // Step 3: Login Method
      loginMethod: [null, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      confirmPassword: [''],

      // Honeypot
      website: [''],
    });

    // Watch login method changes to add/remove password validation
    this.signupForm.get('loginMethod')?.valueChanges.subscribe((method) => {
      const passwordControl = this.signupForm.get('password');
      const confirmPasswordControl = this.signupForm.get('confirmPassword');

      if (method === LoginMethod.Basic) {
        passwordControl?.setValidators([Validators.required, Validators.minLength(8)]);
        confirmPasswordControl?.setValidators([Validators.required]);
      } else {
        passwordControl?.clearValidators();
        confirmPasswordControl?.clearValidators();
      }

      passwordControl?.updateValueAndValidity();
      confirmPasswordControl?.updateValueAndValidity();
    });
  }

  nextStep(): void {
    if (this.currentStep === 0) {
      // Validate pricing plan selection
      if (this.signupForm.get('pricingPlan')?.invalid) {
        this.signupForm.get('pricingPlan')?.markAsDirty();
        this.signupForm.get('pricingPlan')?.updateValueAndValidity();
        this.message.error('Vælg venligst en prisplan');
        return;
      }
    } else if (this.currentStep === 1) {
      // Validate login method and credentials
      const loginMethod = this.signupForm.get('loginMethod')?.value;
      const email = this.signupForm.get('email');
      const password = this.signupForm.get('password');
      const confirmPassword = this.signupForm.get('confirmPassword');

      if (!loginMethod) {
        this.message.error('Vælg venligst en login metode');
        return;
      }

      if (email?.invalid) {
        email.markAsDirty();
        email.updateValueAndValidity();
        this.message.error('Indtast venligst en gyldig email');
        return;
      }

      if (loginMethod === LoginMethod.Basic) {
        if (password?.invalid) {
          password.markAsDirty();
          password.updateValueAndValidity();
          this.message.error('Adgangskode skal være mindst 8 tegn');
          return;
        }

        if (password?.value !== confirmPassword?.value) {
          confirmPassword?.markAsDirty();
          this.message.error('Adgangskoderne matcher ikke');
          return;
        }
      }
    }

    this.currentStep++;
  }

  prevStep(): void {
    this.currentStep--;
  }

  async submitForm(): Promise<void> {
    // Check honeypot
    if (this.signupForm.get('website')?.value) {
      console.log('Bot detected');
      return;
    }

    // Validate final step
    const fullName = this.signupForm.get('fullName');
    const phone = this.signupForm.get('phone');
    const companyName = this.signupForm.get('companyName');

    if (fullName?.invalid || phone?.invalid || companyName?.invalid) {
      [fullName, phone, companyName].forEach((control) => {
        if (control?.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      });
      this.message.error('Udfyld venligst alle påkrævede felter');
      return;
    }

    this.isSubmitting = true;

    try {
      const loginMethod = this.signupForm.get('loginMethod')?.value;

      // Handle OAuth signup
      if (loginMethod === LoginMethod.Google || loginMethod === LoginMethod.Microsoft) {
        await this.handleOAuthSignup();
        return;
      }

      // Handle basic auth signup
      const signupRequest: SignupRequest = {
        Email: this.signupForm.get('email')?.value,
        Password: this.signupForm.get('password')?.value,
        FullName: this.signupForm.get('fullName')?.value,
        Phone: this.signupForm.get('phone')?.value,
        CompanyName: this.signupForm.get('companyName')?.value,
        PricingPlan: this.signupForm.get('pricingPlan')?.value,
        PreferredLoginMethod: loginMethod,
      };

      const response = await this.http.post(this.signupUrl, signupRequest).toPromise();

      this.message.success('Din konto er oprettet! Du vil blive omdirigeret...');

      // Redirect to login or dashboard after 2 seconds
      setTimeout(() => {
        // TODO: Update with actual login/dashboard route
        this.router.navigate(['/']);
      }, 2000);
    } catch (error: any) {
      console.error('Signup error:', error);

      if (error.status === 400) {
        this.message.error('Ugyldig data. Tjek venligst dine oplysninger.');
      } else if (error.status === 409) {
        this.message.error('Denne email er allerede registreret.');
      } else {
        this.message.error('Der opstod en fejl. Prøv venligst igen senere.');
      }
    } finally {
      this.isSubmitting = false;
    }
  }

  private async handleOAuthSignup(): Promise<void> {
    const loginMethod = this.signupForm.get('loginMethod')?.value;
    const provider = loginMethod === LoginMethod.Google ? 'google' : 'microsoft';

    this.message.info(`Omdirigerer til ${provider} login...`);

    // Store form data in session storage to retrieve after OAuth callback
    const formData = {
      fullName: this.signupForm.get('fullName')?.value,
      phone: this.signupForm.get('phone')?.value,
      companyName: this.signupForm.get('companyName')?.value,
      pricingPlan: this.signupForm.get('pricingPlan')?.value,
      loginMethod: loginMethod,
    };

    sessionStorage.setItem('signupFormData', JSON.stringify(formData));

    // TODO: Implement OAuth flow
    // This would typically redirect to the OAuth provider's authorization URL
    // window.location.href = `${this.apiUrl}/oauth/${provider}/authorize`;

    this.message.warning('OAuth integration er ikke implementeret endnu');
    this.isSubmitting = false;
  }

  selectPlan(plan: PricingPlan): void {
    this.signupForm.patchValue({ pricingPlan: plan });
  }

  selectLoginMethod(method: LoginMethod): void {
    this.signupForm.patchValue({ loginMethod: method });
  }
}
