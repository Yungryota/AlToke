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
      console.log('🔐 Intentando login con:', { email: this.email });
      
      const { data, error } = await this.supabaseService
        .supabase()
        .auth
        .signInWithPassword({
          email: this.email,
          password: this.password,
        });

      console.log('📡 Respuesta de signInWithPassword:', { 
        hasData: !!data, 
        hasUser: !!data?.user,
        hasError: !!error,
        errorDetails: error ? {
          message: error.message,
          status: error.status,
          code: error.code,
          fullError: error
        } : null
      });

      if (error || !data.user) {
        console.error('❌ Error en autenticación:', error);
        throw new Error('Credenciales incorrectas');
      }

      const user = data.user;

      // Buscar perfil en tabla usuario
      console.log('👤 Usuario autenticado:', { 
        id: user.id, 
        email: user.email,
        metadata: user.user_metadata 
      });
      console.log('🔍 Buscando perfil en tabla usuario...');
      
      const { data: perfil, error: perfilError } =
        await this.supabaseService
          .supabase()
          .from('usuario')
          .select('*')
          .eq('auth_id', user.id)
          .maybeSingle();

      console.log('📋 Resultado de búsqueda de perfil:', { 
        perfil, 
        error: perfilError ? {
          message: perfilError.message,
          code: perfilError.code,
          details: perfilError
        } : null
      });

      if (perfilError) {
        console.error('❌ Error al obtener perfil:', perfilError);
        throw new Error('Error al obtener el perfil');
      }

      let roleId: number;

      // Si no existe perfil, crearlo
      if (!perfil) {
        roleId = user.user_metadata['role'] === 'empresa' ? 2 : 1;

        console.log('➕ Perfil no existe, creando nuevo perfil:', {
          auth_id: user.id,
          nombre: user.user_metadata['name'] ?? '',
          role_id: roleId,
          metadataCompleto: user.user_metadata
        });

        const { error: insertError } = await this.supabaseService
          .supabase()
          .from('usuario')
          .insert({
            auth_id: user.id,
            nombre: user.user_metadata['name'] ?? '',
            role_id: roleId,
          });

        console.log('📝 Resultado de inserción:', { 
          error: insertError ? {
            message: insertError.message,
            code: insertError.code,
            details: insertError
          } : null
        });

        if (insertError) {
          console.error('❌ Error al crear perfil:', insertError);
          throw new Error('Error al crear el perfil del usuario');
        }
      } else {
        roleId = perfil.role_id;
      }

      // Redirección según rol
      console.log('✅ Login exitoso, redirigiendo...', { roleId });
      if (roleId === 2) {
        this.router.navigate(['/empresa']);
      } else {
        this.router.navigate(['/agendar']);
      }

    } catch (err: any) {
      console.error('🚨 ERROR COMPLETO EN LOGIN:', {
        message: err.message,
        name: err.name,
        status: err.status,
        code: err.code,
        stack: err.stack,
        errorCompleto: err
      });
      
      // Mensaje más detallado para el usuario
      if (err.status === 400 || err.message?.includes('400')) {
        this.error = `Error 400: ${err.message || 'Solicitud inválida'}. Revisa la consola del navegador (F12) para más detalles.`;
      } else {
        this.error = err.message || 'Error inesperado';
      }
    } finally {
      this.loading = false;
    }
  }
}
