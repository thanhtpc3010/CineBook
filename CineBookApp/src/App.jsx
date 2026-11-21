import AppRouter from './app/router/AppRouter'
import { AuthProvider } from './auth/AuthProvider'
export default function App() { return <AuthProvider><AppRouter /></AuthProvider> }
