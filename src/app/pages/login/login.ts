import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../core/supabase/supabase.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, NgIf],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async Login() {
    this.loading = true;
    this.error = null;

    try {
      // Login
      const { data, error } = await this.supabaseService
        .supabase()
        .auth
        .signInWithPassword({
          email: this.email,
          password: this.password,
        });

      if (error || !data.user) {
        throw new Error('Credenciales incorrectas');
      }

      const user = data.user;

      // Buscar perfil en tabla usuario
      const { data: perfil, error: perfilError } =
        await this.supabaseService
          .supabase()
          .from('usuario')
          .select('*')
          .eq('auth_id', user.id)
          .maybeSingle();

      if (perfilError) {
        throw new Error('Error al obtener el perfil');
      }

      let roleId: number;

      // Si no existe perfil, crearlo
      if (!perfil) {
        roleId = user.user_metadata['role'] === 'empresa' ? 2 : 1;

        const { error: insertError } = await this.supabaseService
          .supabase()
          .from('usuario')
          .insert({
            auth_id: user.id,
            nombre: user.user_metadata['name'] ?? '',
            role_id: roleId,
          });

        if (insertError) {
          throw new Error('Error al crear el perfil del usuario');
        }
      } else {
        roleId = perfil.role_id;
      }

      // Redirección según rol
      if (roleId === 2) {
        this.router.navigate(['/empresa']);
      } else {
        this.router.navigate(['/agendar']);
      }

    } catch (err: any) {
      this.error = err.message || 'Error inesperado';
    } finally {
      this.loading = false;
    }
  }
}
