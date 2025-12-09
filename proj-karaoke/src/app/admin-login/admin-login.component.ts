import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminAuthService } from '../service/admin-auth.service';

@Component({
  standalone: true,
  selector: 'app-admin-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {

  private fb = inject(FormBuilder);
  private adminAuth = inject(AdminAuthService);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required]
  });

  async onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    try {
      const { email, senha } = this.form.getRawValue();
      await this.adminAuth.login({ email, senha });

      this.router.navigate(['/admin/painel']);

    } catch (err: any) {
      this.error.set(err.message || "Erro ao fazer login");
    } finally {
      this.loading.set(false);
    }
  }
}
