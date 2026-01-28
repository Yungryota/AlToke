import { Component, OnInit } from '@angular/core';
import { Usuario } from '../usuario/usuario';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../core/supabase/supabase.service';

interface HorarioDia {
  dia_semana: number;
  nombre: string;
  hora_inicio: string;
  hora_cierre: string;
  intervalo_sesion: number;
  activo: boolean;
}

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [Usuario, FormsModule, CommonModule],
  templateUrl: './empresa.html',
  styleUrl: './empresa.css',
})
export class Empresa implements OnInit {
  // Opciones de intervalo desde 15 hasta 120 minutos (todos los números)
  opcionesIntervalo: number[] = [];
  
  // Datos del usuario
  authId: string | null = null;
  usuarioEmail: string = '';
  usuarioNombre: string = '';
  loading: boolean = false;
  mensaje: string | null = null;

  // Horarios por día de la semana
  horarios: HorarioDia[] = [
    { dia_semana: 0, nombre: 'Domingo', hora_inicio: '09:00', hora_cierre: '18:00', intervalo_sesion: 30, activo: false },
    { dia_semana: 1, nombre: 'Lunes', hora_inicio: '09:00', hora_cierre: '18:00', intervalo_sesion: 30, activo: true },
    { dia_semana: 2, nombre: 'Martes', hora_inicio: '09:00', hora_cierre: '18:00', intervalo_sesion: 30, activo: true },
    { dia_semana: 3, nombre: 'Miércoles', hora_inicio: '09:00', hora_cierre: '18:00', intervalo_sesion: 30, activo: true },
    { dia_semana: 4, nombre: 'Jueves', hora_inicio: '09:00', hora_cierre: '18:00', intervalo_sesion: 30, activo: true },
    { dia_semana: 5, nombre: 'Viernes', hora_inicio: '09:00', hora_cierre: '18:00', intervalo_sesion: 30, activo: true },
    { dia_semana: 6, nombre: 'Sábado', hora_inicio: '09:00', hora_cierre: '14:00', intervalo_sesion: 30, activo: false },
  ];

  constructor(private supabaseService: SupabaseService) {
    // Generar opciones de intervalo: 15, 16, 17, ..., 119, 120
    for (let i = 15; i <= 120; i++) {
      this.opcionesIntervalo.push(i);
    }
  }

  async ngOnInit() {
    await this.cargarDatosUsuario();
    if (this.authId) {
      await this.cargarHorarios();
    }
  }

  async cargarDatosUsuario() {
    try {
      console.log('🔍 Obteniendo sesión del usuario...');
      const { data: { session } } = await this.supabaseService.getSession();

      if (!session?.user) {
        console.error('❌ No hay sesión activa');
        this.mensaje = 'No hay sesión activa. Por favor inicia sesión.';
        return;
      }

      const authUser = session.user;
      this.authId = authUser.id;
      this.usuarioEmail = authUser.email || '';
      this.usuarioNombre = authUser.user_metadata?.['name'] || authUser.email?.split('@')[0] || '';

      console.log('✅ Usuario autenticado:', { 
        auth_id: this.authId, 
        email: this.usuarioEmail,
        nombre: this.usuarioNombre
      });
    } catch (error: any) {
      console.error('🚨 Error al cargar datos del usuario:', error);
      this.mensaje = 'Error al cargar los datos del usuario';
    }
  }

  async cargarHorarios() {
    if (!this.authId) return;

    try {
      console.log('📋 Cargando horarios existentes...');
      this.loading = true;

      const { data: horariosDB, error } = await this.supabaseService
        .supabase()
        .from('empresa_horarios')
        .select('*')
        .eq('auth_id', this.authId);

      if (error) {
        console.error('❌ Error al cargar horarios:', error);
        this.mensaje = 'Error al cargar horarios de la base de datos';
        return;
      }

      if (horariosDB && horariosDB.length > 0) {
        console.log('✅ Horarios encontrados en BD:', horariosDB);
        
        // Si hay datos en BD, reemplazar completamente con los datos guardados
        // Primero reiniciar todos a inactivo
        this.horarios.forEach(dia => {
          dia.activo = false;
        });
        
        // Luego aplicar los datos de la BD
        horariosDB.forEach((horarioDB: any) => {
          const dia = this.horarios.find(h => h.dia_semana === horarioDB.dia_semana);
          if (dia) {
            dia.hora_inicio = horarioDB.hora_inicio;
            dia.hora_cierre = horarioDB.hora_cierre;
            dia.intervalo_sesion = horarioDB.intervalo_sesion;
            dia.activo = horarioDB.activo;
          }
        });
        
        this.mensaje = '✅ Horarios cargados desde la base de datos';
      } else {
        console.log('ℹ️ No hay horarios guardados, usando configuración por defecto');
        this.mensaje = 'ℹ️ No hay horarios guardados. Configure sus horarios de atención.';
        // Los valores por defecto ya están en el array horarios
      }
    } catch (error: any) {
      console.error('🚨 Error al cargar horarios:', error);
      this.mensaje = '❌ Error al cargar horarios';
    } finally {
      this.loading = false;
    }
  }

  copiarATodos(diaOrigen: HorarioDia) {
    const confirmacion = confirm(`¿Copiar la configuración de ${diaOrigen.nombre} a todos los días activos?`);
    if (confirmacion) {
      this.horarios.forEach(dia => {
        if (dia.activo && dia.dia_semana !== diaOrigen.dia_semana) {
          dia.hora_inicio = diaOrigen.hora_inicio;
          dia.hora_cierre = diaOrigen.hora_cierre;
          dia.intervalo_sesion = diaOrigen.intervalo_sesion;
        }
      });
    }
  }

  async guardarHorarios() {
    if (!this.authId) {
      alert('No se puede guardar: usuario no identificado');
      return;
    }

    try {
      console.log('💾 Guardando horarios...');
      this.loading = true;
      this.mensaje = null;

      // Preparar los datos para insertar
      const horariosParaGuardar = this.horarios.map(h => ({
        auth_id: this.authId,
        dia_semana: h.dia_semana,
        hora_inicio: h.hora_inicio,
        hora_cierre: h.hora_cierre,
        intervalo_sesion: h.intervalo_sesion,
        activo: h.activo
      }));

      // Primero eliminar los horarios existentes del usuario
      const { error: deleteError } = await this.supabaseService
        .supabase()
        .from('empresa_horarios')
        .delete()
        .eq('auth_id', this.authId);

      if (deleteError) {
        console.error('❌ Error al eliminar horarios antiguos:', deleteError);
        throw deleteError;
      }

      // Insertar los nuevos horarios
      const { data, error: insertError } = await this.supabaseService
        .supabase()
        .from('empresa_horarios')
        .insert(horariosParaGuardar)
        .select();

      if (insertError) {
        console.error('❌ Error al guardar horarios:', insertError);
        throw insertError;
      }

      console.log('✅ Horarios guardados exitosamente:', data);

      const horariosActivos = this.horarios.filter(h => h.activo);
      const resumen = horariosActivos.map(h => 
        `${h.nombre}: ${h.hora_inicio} - ${h.hora_cierre} (${h.intervalo_sesion} min)`
      ).join('\n');

      this.mensaje = '✅ Horarios guardados correctamente';
      alert(`Horarios guardados para ${this.usuarioNombre}\n(${this.usuarioEmail})\n\n${resumen}`);
    } catch (error: any) {
      console.error('🚨 Error al guardar horarios:', error);
      this.mensaje = '❌ Error al guardar los horarios';
      alert('Error al guardar los horarios. Revisa la consola para más detalles.');
    } finally {
      this.loading = false;
    }
  }
}
