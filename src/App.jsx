import {BrowserRouter, Routes, Route} from 'react-router-dom'
import AuthLayout from './layout/AuthLayout'
import RutaProtegida from './layout/RutaProtegida'
import Login from './paginas/Login'
import Registrar from './paginas/Registrar'
import OlvidePassword from './paginas/OlvidePassword'
import ConfirmarCuenta from './paginas/ConfimCuenta'
import NuevoPassword from './paginas/NuevoPassword'
import Dashboard from './paginas/Dashboard'
import ListadoClientes from './paginas/ListadoClientes'
import { AuthProvider } from './context/AuthProvider'
import { ClientesProvider } from './context/ClientesProvider'
import { PagosProvider } from './context/PagosProvider'
import Consolidados from './paginas/Consolidados'
function App() {
  return (
<BrowserRouter>
  <AuthProvider>
    <ClientesProvider>
      <PagosProvider>
        <Routes>
          {/* Rutas para la autenticación */}
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Login />} />
            <Route path="registrar" element={<Registrar />} />
            <Route path="olvide-password" element={<OlvidePassword />} />
            <Route path="olvide-password/:token" element={<NuevoPassword />} />
            <Route path="confirmar/:token" element={<ConfirmarCuenta />} />
          </Route>

          {/* Rutas protegidas */}
          <Route path='/admin' element={<RutaProtegida />}>
            <Route index element={<Dashboard />} />
            <Route path='lista-cliente' element={<ListadoClientes />} />
            <Route path='consolidados' element={<Consolidados/>}/>
          </Route>
        </Routes>
      </PagosProvider>
    </ClientesProvider>
  </AuthProvider>
</BrowserRouter>

    
  )
}

export default App
