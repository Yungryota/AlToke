import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../core/supabase/supabase.service';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, NgIf],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  email = ''
  password = ''
  loading = false
  error: string | null = null

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ){}

  async Login(){
    this.loading = true
    this.error = null

    const { error } = await this.supabase.signIn(
      this.email,
      this.password
    )

    if(error){
      this.error = error.message
    }
    else
    {
      alert('Login exitoso')
      this.router.navigate(['/agendar'])
    }
    this.loading = false
  }
  
}
