import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private client: SupabaseClient;


    supabase(): SupabaseClient {
        console.log('Supabase client returned:', this.client);
        return this.client;
    }

    constructor() {
        this.client = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
        console.log('Supabase initialized:', {
            url: environment.supabaseUrl,
            hasAnonKey: !!environment.supabaseAnonKey
        });
    }
}
