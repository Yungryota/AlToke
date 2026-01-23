import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SupabaseService } from '../app/core/supabase/supabase.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
    constructor(private sb: SupabaseService) {
      console.log('App component initialized');
    }
    async ngOnInit() {
      console.log('ngOnInit started');
      const { data, error } = await this.sb.supabase().auth.getSession();
      console.log('session:', data?.session);
      console.log('data:', data);
      if (error) {
        console.error('supabase error:', error);
      } else {
        console.log('No error - session retrieved successfully');
      }
    }
    protected readonly title = signal('AlToke');
}
