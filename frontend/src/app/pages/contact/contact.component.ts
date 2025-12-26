import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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

  inquiryTypes = [
    { label: 'Support', value: 'support' },
    { label: 'Salg', value: 'salg' },
    { label: 'Partnerskab', value: 'partnerskab' }
  ];

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService
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
      console.log('Form submitted:', this.contactForm.value);
      this.message.success('Din besked er sendt! Vi vender tilbage hurtigst muligt.');
      this.contactForm.reset();
      this.currentStep = 0;
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
