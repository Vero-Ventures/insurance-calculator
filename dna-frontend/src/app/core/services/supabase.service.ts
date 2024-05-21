import { Injectable, NgZone } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ENVIRONMENT } from 'environments/environment';
import { Router } from '@angular/router';
import { Client } from '../models/client.model';
import { initialClientState } from 'app/states/client.state';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase!: SupabaseClient;

  constructor(
    private router: Router,
    private zone: NgZone
  ) {
    this.supabase = createClient(
      ENVIRONMENT.supabase.url,
      ENVIRONMENT.supabase.key
    );

    this.supabase.auth.onAuthStateChange((_, session) => {
      sessionStorage.setItem('session', JSON.stringify(session?.user.id));

      if (session?.user && this.router.url === '/auth') {
        this.zone.run(() => {
          this.router.navigate(['/landing']);
        });
      }
    });
  }

  get isLoggedIn() {
    return (
      sessionStorage.getItem('session') !== 'undefined' &&
      sessionStorage.getItem('session') !== undefined &&
      sessionStorage.getItem('session') !== null
    );
  }

  async getClient(clientId: number) {
    return await this.supabase
      .from('client_profiles')
      .select('*')
      .eq('id', clientId)
      .single();
  }

  async getClients() {
    const user = await this.supabase.auth.getUser();
    return await this.supabase
      .from('client_profiles')
      .select('id, client')
      .eq('advisor_id', user.data.user?.id);
  }

  async updateClient(clientId: number, client: Client) {
    return await this.supabase
      .from('client_profiles')
      .update({ client: client })
      .eq('id', clientId)
      .select();
  }

  async createClient(clientName: string) {
    const newClient = initialClientState.client;
    newClient.name = clientName;
    const user = await this.supabase.auth.getUser();
    return await this.supabase
      .from('client_profiles')
      .insert([{ advisor_id: user.data.user?.id, client: newClient }])
      .select();
  }

  async deleteClient(clientId: number) {
    return await this.supabase
      .from('client_profiles')
      .delete()
      .eq('id', clientId);
  }

  async signUp(email: string, password: string) {
    this.clearSession();
    return await this.supabase.auth.signUp({ email, password });
  }

  async signIn(email: string, password: string) {
    this.clearSession();
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  async signOut() {
    this.clearSession();
    await this.supabase.auth.signOut();
  }

  private clearSession() {
    sessionStorage.removeItem('session');
  }
}
