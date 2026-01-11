import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
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
import { BehaviorSubject } from 'rxjs';

enum PricingPlan {
  Essential = 0,
  EarlyAccess = 1,
  Pro = 2,
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
  Vat: string;
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
export class SignupComponent implements OnInit {
  currentStep = 0;
  signupForm: FormGroup;
  isSubmitting = false;

  private signupUrl = `${environment.appApiUrl}/auth/signup`;

  PricingPlan = PricingPlan;
  LoginMethod = LoginMethod;

  // Early Access limited slots
  earlyAccessSlotsRemaining: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  isEarlyAccessAvailable: boolean = false;

  // Password requirements
  passwordRequirements = [
    { label: 'Mindst 8 tegn', met: false },
    { label: 'Mindst ét stort bogstav', met: false },
    { label: 'Mindst ét specialtegn (!@#$%^&*)', met: false },
  ];

  pricingPlans = [
    {
      value: PricingPlan.Essential,
      name: 'Essential',
      price: 'Kommer snart',
      features: [
        'Perfekt til små virksomheder',
        'Grundlæggende funktioner',
        'Email support',
        'Månedlig fakturering',
      ],
      comingSoon: true,
    },
    {
      value: PricingPlan.EarlyAccess,
      name: 'Lifetime Early Access',
      price: '0 kr/md',
      features: [
        'Ingen kreditkort påkrævet',
        'Tidlig adgang til paytomic',
        'Mulighed via feedback at påvirke fremtidige funktioner',
        'Forbliver gratis for livstid',
      ],
      limited: true,
      badge: 'Begrænset antal pladser',
    },
    {
      value: PricingPlan.Pro,
      name: 'Pro',
      price: 'Kommer snart',
      features: [
        'Alt i Essential',
        'Avancerede funktioner',
        'Prioriteret support',
        'Ubegrænsede brugere',
      ],
      comingSoon: true,
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
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
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
        passwordControl?.setValidators([
          Validators.required,
          Validators.minLength(8),
          this.uppercaseValidator(),
          this.specialCharValidator(),
        ]);
        confirmPasswordControl?.setValidators([
          Validators.required,
          this.passwordMatchValidator()
        ]);
      } else {
        passwordControl?.clearValidators();
        confirmPasswordControl?.clearValidators();
      }

      passwordControl?.updateValueAndValidity();
      confirmPasswordControl?.updateValueAndValidity();
    });

    // Watch password changes to update requirements and revalidate confirm password
    this.signupForm.get('password')?.valueChanges.subscribe((password) => {
      this.updatePasswordRequirements(password || '');
      // Revalidate confirm password when password changes
      this.signupForm.get('confirmPassword')?.updateValueAndValidity({ emitEvent: false });
    });
  }

  private updatePasswordRequirements(password: string): void {
    this.passwordRequirements = [
      { label: 'Mindst 8 tegn', met: password.length >= 8 },
      { label: 'Mindst ét stort bogstav', met: /[A-Z]/.test(password) },
      { label: 'Mindst ét specialtegn (!@#$%^&*)', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];
  }

  ngOnInit(): void {
    this.signupForm.patchValue({ pricingPlan: PricingPlan.EarlyAccess });
    this.signupForm.patchValue({ loginMethod: LoginMethod.Basic });

    // Fetch available early access slots
    this.fetchEarlyAccessSlots();

    // Check for error messages in query parameters (from OAuth redirects)
    this.route.queryParams.subscribe((params) => {
      if (params['error']) {
        const errorMessage = params['message'] || this.getDefaultErrorMessage(params['error']);
        this.message.error(errorMessage, { nzDuration: 8000 });

        // Clean up URL by removing query parameters
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
          replaceUrl: true,
        });
      }
    });
  }

  private getDefaultErrorMessage(errorType: string): string {
    const errorMessages: { [key: string]: string } = {
      account_exists: 'En konto med denne email eksisterer allerede. Log venligst ind.',
      oauth_failed: 'OAuth login fejlede. Prøv venligst igen.',
      invalid_token: 'Ugyldig token. Prøv venligst igen.',
    };
    return errorMessages[errorType] || 'Der opstod en fejl. Prøv venligst igen.';
  }

  private fetchEarlyAccessSlots(): void {
    this.http.get<number>(`${environment.appApiUrl}/tenant/early-access/available-spots`)
      .subscribe({
        next: (availableSpots) => {
          this.earlyAccessSlotsRemaining.next(availableSpots);
          this.isEarlyAccessAvailable = availableSpots > 0;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching early access slots:', error);
          // Keep the default value of 0 on error
          this.isEarlyAccessAvailable = false;
          this.cdr.detectChanges();
        }
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
      // Validate basic info fields
      const fullName = this.signupForm.get('fullName');
      const phone = this.signupForm.get('phone');
      const companyName = this.signupForm.get('companyName');
      const vat = this.signupForm.get('vat');

      if (fullName?.invalid || phone?.invalid || companyName?.invalid || vat?.invalid) {
        [fullName, phone, companyName, vat].forEach((control) => {
          if (control?.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity();
          }
        });
        this.message.error('Udfyld venligst alle påkrævede felter');
        return;
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

    const loginMethod = this.signupForm.get('loginMethod')?.value;

    if (loginMethod == LoginMethod.Basic) {
      // Final validation for basic auth
      const email = this.signupForm.get('email');
      const password = this.signupForm.get('password');
      const confirmPassword = this.signupForm.get('confirmPassword');


      if (email?.invalid || password?.invalid || password?.value !== confirmPassword?.value) {
        [email, password, confirmPassword].forEach((control) => {
          if (control?.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity();
          }
        });
        this.message.error('Tjek venligst dine login oplysninger');
        return;
      }
    }


    this.isSubmitting = true;

    try {
      

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
        Vat: this.signupForm.get('vat')?.value,
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
      this.cdr.detectChanges();
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
      vat: this.signupForm.get('vat')?.value,
      loginMethod: loginMethod,
    };

    sessionStorage.setItem('signupFormData', JSON.stringify(formData));

    this.isSubmitting = false;
    this.cdr.detectChanges();
  }

  private uppercaseValidator() {
    return (control: any) => {
      const value = control.value || '';
      return /[A-Z]/.test(value) ? null : { uppercase: true };
    };
  }

  private specialCharValidator() {
    return (control: any) => {
      const value = control.value || '';
      return /[!@#$%^&*(),.?":{}|<>]/.test(value) ? null : { specialChar: true };
    };
  }

  private passwordMatchValidator() {
    return (control: any) => {
      if (!control.parent) {
        return null;
      }
      const password = control.parent.get('password')?.value;
      const confirmPassword = control.value;
      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }

  getConfirmPasswordError(): string {
    const control = this.signupForm.get('confirmPassword');
    if (control?.hasError('required') && control?.dirty) {
      return 'Bekræft venligst din adgangskode';
    }
    if (control?.hasError('passwordMismatch') && control?.dirty) {
      return 'Adgangskoderne matcher ikke';
    }
    return '';
  }

  selectPlan(plan: PricingPlan): void {
    // Prevent selecting Early Access if no slots available
    if (plan === PricingPlan.EarlyAccess && !this.isEarlyAccessAvailable) {
      this.message.warning('Early Access pladser er desværre optaget');
      return;
    }
    this.signupForm.patchValue({ pricingPlan: plan });
  }

  selectLoginMethod(method: LoginMethod): void {
    this.signupForm.patchValue({ loginMethod: method });

    if (method == LoginMethod.Google || method == LoginMethod.Microsoft) {
      const params = new URLSearchParams({
        companyName: this.signupForm.get('companyName')?.value,
        phone: this.signupForm.get('phone')?.value,
        vat: this.signupForm.get('vat')?.value,
        pricingPlan: this.signupForm.get('pricingPlan')?.value,
        provider: method.toString(),
      }).toString();

      window.location.href = environment.appApiUrl + `/auth/oauth/signup?${params}`;
    }
  }
}
