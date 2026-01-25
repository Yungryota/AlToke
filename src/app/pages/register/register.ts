import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../core/supabase/supabase.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, FormsModule, NgIf],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  nombre = '';
  email = '';
  password = '';
  confirmPassword = '';
  role: 'usuario' | 'empresa' | '' = '';
  error = '';
  loading = false;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async Register() {
  this.error = '';
  this.loading = true;

  try {
    if (!this.nombre.trim()) {
      throw new Error('El nombre es obligatorio');
    }

    if (!this.role) {
      throw new Error('Selecciona un tipo de cuenta');
    }

    if (this.password !== this.confirmPassword) {
      throw new Error('Las contraseñas no coinciden');
    }

    const { error } = await this.supabaseService
      .supabase()
      .auth
      .signUp({
        email: this.email,
        password: this.password,
        options: {
          data: {
            name: this.nombre,
            role: this.role,
          },
        },
      });

    if (error) {
      throw error;
    }

    alert('Cuenta creada. Revisa tu correo para confirmar.');
    this.router.navigate(['/login']);

  } catch (err: any) {
    this.error = err.message || 'Error inesperado';
  } finally {
    this.loading = false;
  }
}

}
