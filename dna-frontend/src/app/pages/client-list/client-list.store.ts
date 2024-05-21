import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { SupabaseService } from 'app/core/services/supabase.service';
import {
  ClientListItem,
  ClientListState,
  initialClientListState,
} from 'app/states/client-list.state';

@Injectable()
export class ClientListStore extends ComponentStore<ClientListState> {
  readonly isLoading$ = this.select(state => state.isLoading);
  readonly error$ = this.select(state => state.error);
  readonly clients$ = this.select(state => state.clients);

  readonly vm$ = this.select({
    isLoading: this.isLoading$,
    error: this.error$,
    clients: this.clients$,
  });

  readonly setIsLoading = this.updater(state => ({
    ...state,
    isLoading: true,
  }));

  readonly setError = this.updater((state, error: HttpErrorResponse) => ({
    ...state,
    isLoading: false,
    error: error.message,
  }));

  readonly setClients = this.updater((state, clients: ClientListItem[]) => ({
    ...state,
    isLoading: false,
    clients,
  }));

  constructor(private supabaseService: SupabaseService) {
    super(initialClientListState);
  }

  getClients() {
    this.supabaseService.getClients().then(response => {
      if (response.error) {
        throw response.error;
      } else {
        this.setClients(response.data);
      }
    });
  }

  createClient(name: string = 'New Client') {
    this.supabaseService.createClient(name).then(response => {
      if (response.error) {
        throw response.error;
      } else {
        this.getClients();
      }
    });
  }

  deleteClient(clientId: number) {
    this.supabaseService.deleteClient(clientId).then(response => {
      if (response.error) {
        throw response.error;
      } else {
        this.getClients();
      }
    });
  }
}
