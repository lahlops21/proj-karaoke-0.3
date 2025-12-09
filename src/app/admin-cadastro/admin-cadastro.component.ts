import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminAuthService } from '../service/admin-auth.service';

@Component({
  standalone: true,
  selector: 'app-admin-cadastro',
  imports: [CommonModule, ReactiveFormsModule, RouterModule ],
  templateUrl: './admin-cadastro.component.html',
  styleUrls: ['./admin-cadastro.component.css']
})
export class AdminCadastroComponent {

  private fb = inject(FormBuilder);
  private adminAuth = inject(AdminAuthService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required],
    confirmarSenha: ['', Validators.required],   // 👈 NOVO CAMPO
    endereco: ['']
  }, {
    validators: [this.senhasIguaisValidator]      // 👈 VALIDADOR CUSTOM
  });

  // --- VALIDADOR CUSTOM ---
  senhasIguaisValidator(form: AbstractControl) {
    const senha = form.get('senha')?.value;
    const confirmarSenha = form.get('confirmarSenha')?.value;

    if (senha !== confirmarSenha) {
      form.get('confirmarSenha')?.setErrors({ senhasDiferentes: true });
    } else {
      form.get('confirmarSenha')?.setErrors(null);
    }

    return null;
  }

  // --- SUBMIT ---
  async onSubmit() {
    if (this.form.invalid) return;

    const { name, email, senha, endereco } = this.form.getRawValue();

    try {
      await this.adminAuth.cadastrar({ name, email, senha, endereco });
      alert("Administrador criado com sucesso!");
      this.router.navigate(["/admin/login"]);

    } catch (err: any) {
      alert("Erro ao cadastrar administrador: " + err.message);
    }
  }
}
