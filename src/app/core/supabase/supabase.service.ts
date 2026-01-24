import { Injectable } from '@angular/core'
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js'
import { environment } from '../../../environments/environment'
@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private client: SupabaseClient;


    constructor() {
    this.client = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    )

    console.log('Supabase initialized:', {
      url: environment.supabaseUrl,
      hasAnonKey: !!environment.supabaseAnonKey
    })
    }

    supabase(): SupabaseClient {
        return this.client;
    }

    // Autenticación
    signIn(email: string, password: string){
        return this.client.auth.signInWithPassword({
            email,
            password,
        })
    }

    signUp(email: string, password: string){
        return this.client.auth.signUp({
            email,
            password,
        })
    }

    signOut(){
        return this.client.auth.signOut()
    }

    getSession(){
        return this.client.auth.getSession()
    }

    onAuthChange(callback: (session: Session | null) => void){
        return this.client.auth.onAuthStateChange((_event, session) => {
            callback(session)
        })
    }

}
