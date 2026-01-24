import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../core/supabase/supabase.service';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterModule, FormsModule, NgIf],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  role: 'usuario' | 'empresa' | '' = '';
  loading = false;

  constructor(private supabaseService: SupabaseService) {}
    async Register() {
      this.error = '';

      if (!this.role) {
        this.error = 'Selecciona un tipo de cuenta';
        return;
      }

      if (this.password !== this.confirmPassword) {
        this.error = 'Las contraseñas no coinciden';
        return;
      }

      this.loading = true;

      const { data, error } = await this.supabaseService
        .supabase()
        .auth
        .signUp({
          email: this.email,
          password: this.password,
          options: {
            data: {
              role: this.role
            }
          }
        });

      this.loading = false;

      if (error) {
        this.error = error.message;
      } else {
        alert('Cuenta creada correctamente');
      }
    }

}
