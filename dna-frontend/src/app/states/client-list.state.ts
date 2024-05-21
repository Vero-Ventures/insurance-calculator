import { Client } from 'app/core/models/client.model';

export interface ClientListItem {
  id: number;
  client: Client;
}

export interface ClientListState {
  isLoading: boolean;
  error: string | null;
  clients: ClientListItem[];
}

export const initialClientListState: ClientListState = {
  isLoading: false,
  error: null,
  clients: [],
};
