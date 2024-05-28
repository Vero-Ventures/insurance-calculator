import { Injectable, NgZone } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ENVIRONMENT } from 'environments/environment';
import { Router } from '@angular/router';
import { Client } from '../models/client.model';
import { initialClientState } from 'app/states/client.state';
import { Beneficiary } from '../models/beneficiary.model';
import { Business } from '../models/business.model';
import { Goal } from '../models/goal.model';
import { Debt } from '../models/debt.model';
import { Asset } from '../models/asset.model';

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

  async getProfile(clientId: number) {
    const result = await this.supabase
      .from('client_profiles')
      .select()
      .eq('id', clientId)
      .single();

    if (!result.data) {
      throw new Error('Could not find any profile with id of ' + clientId);
    }

    return result.data;
  }

  async insertProfile(profile: Record<string, unknown>) {
    await this.deleteClient(profile['id'] as number);
    const user = await this.supabase.auth.getUser();
    return this.supabase.from('client_profiles').insert([
      {
        ...profile,
        advisor_id: user.data.user?.id,
      },
    ]);
  }

  async getClient(clientId: number) {
    return await this.supabase
      .from('client_profiles')
      .select('*')
      .eq('id', clientId)
      .single();
  }

  async getClients() {
    return await this.supabase.from('client_profiles').select('id, client');
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

  async getBeneficiaries(clientId: number) {
    return await this.supabase
      .from('client_profiles')
      .select('beneficiaries')
      .eq('id', clientId)
      .single();
  }

  async updateBeneficiaries(clientId: number, beneficiaries: Beneficiary[]) {
    return await this.supabase
      .from('client_profiles')
      .update({ beneficiaries: beneficiaries })
      .eq('id', clientId)
      .select();
  }

  async getBusinesses(clientId: number) {
    return await this.supabase
      .from('client_profiles')
      .select('businesses')
      .eq('id', clientId)
      .single();
  }

  async updateBusinesses(clientId: number, businesses: Business[]) {
    return await this.supabase
      .from('client_profiles')
      .update({ businesses: businesses })
      .eq('id', clientId)
      .select();
  }

  async getAssets(clientId: number) {
    return await this.supabase
      .from('client_profiles')
      .select('assets')
      .eq('id', clientId)
      .single();
  }

  async updateAssets(clientId: number, assets: Asset[]) {
    return await this.supabase
      .from('client_profiles')
      .update({ assets: assets })
      .eq('id', clientId)
      .select();
  }

  async getPercentGoalLiquidity(clientId: number) {
    return await this.supabase
      .from('client_profiles')
      .select('percent_goal_liquidity')
      .eq('id', clientId)
      .single();
  }

  async updatePercentGoalLiquidity(clientId: number, percent: number) {
    return await this.supabase
      .from('client_profiles')
      .update({ percent_goal_liquidity: percent })
      .eq('id', clientId)
      .select();
  }

  async getDebts(clientId: number) {
    return await this.supabase
      .from('client_profiles')
      .select('debts')
      .eq('id', clientId)
      .single();
  }

  async updateDebts(clientId: number, debts: Debt[]) {
    return await this.supabase
      .from('client_profiles')
      .update({ debts: debts })
      .eq('id', clientId)
      .select();
  }

  async getGoals(clientId: number) {
    return await this.supabase
      .from('client_profiles')
      .select('goals')
      .eq('id', clientId)
      .single();
  }

  async updateGoals(clientId: number, goals: Goal[]) {
    return await this.supabase
      .from('client_profiles')
      .update({ goals: goals })
      .eq('id', clientId)
      .select();
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
