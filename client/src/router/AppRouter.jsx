import { Route, Routes } from "react-router-dom"
import {HomePage, DashboardPage, LoginPage, RegisterPage, PerfilUsuarioPage, BibliotecaDocumentsPage, UploadDocument,
        UploadRecurso, PerfilOtroPage, PreguntasPage, BibliotecaRecursosPage, RespuestaPage, BuscarPage} from "../Pages";


export const AppRouter = () => {
  return (
    <Routes>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/perfil" element={<PerfilUsuarioPage />} />
        <Route path="/documentos" element={<BibliotecaDocumentsPage />} />
        <Route path="/uploadDocument" element={<UploadDocument/>} />

        <Route path="/uploadRecurso" element={<UploadRecurso/>} />
        <Route path="/perfilOtro" element={<PerfilOtroPage/>} />
        <Route path="/preguntas" element={<PreguntasPage/>} />
        <Route path="/recursos" element={<BibliotecaRecursosPage/>} />
        
        <Route path="/respuestas" element={<RespuestaPage/>} />
        <Route path="/buscar" element={<BuscarPage/>} />
        
    </Routes>
  )
}
