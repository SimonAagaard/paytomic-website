import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';

enum InquiryType {
  Support = 0,
  Sales = 1,
  Partnership = 2
}

interface ContactFormRequest {
  Email: string;
  InquiryType: InquiryType;
  Name: string;
  CompanyName: string;
  PhoneNumber: string;
  Message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    NzStepsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  currentStep = 0;
  contactForm: FormGroup;
  isSubmitting = false;
  
  // Update this URL to match your backend
  private apiUrl = 'http://localhost:5106/api/contact'; // Change to your Raspberry Pi URL

  inquiryTypes = [
    { label: 'Support', value: 'support' },
    { label: 'Salg', value: 'sales' },
    { label: 'Partnerskab', value: 'partnership' }
  ];

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private http: HttpClient
  ) {
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      inquiryType: ['', Validators.required],
      name: ['', Validators.required],
      companyName: ['', Validators.required],
      phone: [''],
      message: ['', Validators.required],
      website: [''] // Honeypot field
    });
  }

  nextStep(): void {
    if (this.currentStep === 0) {
      // Validate step 1 fields
      if (this.contactForm.get('email')?.invalid || this.contactForm.get('inquiryType')?.invalid) {
        Object.values(this.contactForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
        return;
      }
    }
    this.currentStep++;
  }

  prevStep(): void {
    this.currentStep--;
  }

  submitForm(): void {
    // Check honeypot field - if filled, it's likely a bot
    if (this.contactForm.get('website')?.value) {
      console.log('Bot detected via honeypot field');
      // Silently reject - don't show error to avoid teaching bots
      return;
    }

    if (this.contactForm.valid) {
      this.isSubmitting = true;
      
      // Map frontend values to backend model
      const formValue = this.contactForm.value;
      const inquiryTypeMap: { [key: string]: InquiryType } = {
        'support': InquiryType.Support,
        'salg': InquiryType.Sales,
        'partnerskab': InquiryType.Partnership
      };

      const requestBody: ContactFormRequest = {
        Email: formValue.email,
        InquiryType: inquiryTypeMap[formValue.inquiryType],
        Name: formValue.name,
        CompanyName: formValue.companyName,
        PhoneNumber: formValue.phone || '',
        Message: formValue.message
      };

      this.http.post<{ message: string }>(this.apiUrl, requestBody).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.message.success(response.message || 'Din besked er sendt! Vi vender tilbage hurtigst muligt.');
          this.contactForm.reset();
          this.currentStep = 2; // Move to success step
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error submitting form:', error);
          
          const errorMessage = 'Der opstod en fejl ved afsendelse af din besked. Prøv venligst igen senere. eller send en e-mail direkte til hello@paytomic.dk';
          this.message.error(errorMessage);
        }
      });
    } else {
      Object.values(this.contactForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
