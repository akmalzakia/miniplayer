import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ClientProvider } from './context/clientContext.jsx'
import { TokenProvider } from './context/tokenContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <ClientProvider>
    <TokenProvider>
      <App></App>
    </TokenProvider>
  </ClientProvider>
  // </React.StrictMode>
)
