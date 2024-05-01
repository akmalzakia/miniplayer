import { createContext } from "react";

export const ClientContext = createContext('')

export function ClientProvider({ children }) {

  const spotify_client_id = '4570d2b0ba074a3da9a6ff13fd3643fa';
  const spotify_redirect_uri = 'http://localhost:3000';

  const clientDetails = {
    id: spotify_client_id,
    redirectUri: spotify_redirect_uri
  }

  return (
    <ClientContext.Provider value={clientDetails}>
      {children}
    </ClientContext.Provider>
  )
}