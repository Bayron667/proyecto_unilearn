import { useNavigate, Link, useLocation } from "react-router-dom";
import logo from "../asset/logoImagen.png";
import parseJwt from "../components/DesenciptarJWT";
import { useState } from "react";

export const NavbarUser = () => {
  const navigate = useNavigate("");
  const location = useLocation();
  const pathname = location.pathname;
  const segments = pathname.split("/").filter(Boolean);
  const [textoBuscar, setTextoBuscar] = useState();
  const [mostrar, setMostrar] = useState(false);



  const irDashboard = () => {
    navigate("/dashboard");
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const irPerfil = () => {
    navigate("/perfil");
  }

  const irBusacar = () => {
    navigate('/buscar', { state: { textoBuscar} });
  }
  return (

    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#e3f2fd" }}>
      <div className="container-fluid">
        {/* Logo */}
        <button
          className="navbar-brand me-auto"
          onClick={irDashboard}
          style={{
            border: "none",
            padding: "0",
            background: "none",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <img src={logo} width="70" height="70" />
        </button>

        {/* Barra de Búsqueda */}
        <form className="d-flex mx-2 me-auto">
          <input className="form-control me-2" type="search" placeholder="Buscar" aria-label="Buscar" onChange={(e) => setTextoBuscar(e.target.value)} />
          <button className="btn btn-outline-success" type="submit" onClick={irBusacar}>Buscar</button>
        </form>

        {/* Botones de Perfil y Cerrar Sesión */}
        <div className="d-flex align-items-center">
          <button className="btn btn-outline-success me-2" onClick={irPerfil}>
            {parseJwt(localStorage.getItem("token")).nombre}
          </button>

          <button
            className="btn btn-outline-success col-auto"
            onClick={cerrarSesion}
          >
            Cerrar sesion
          </button>
        </div>
      </div>
    </nav>

  )
}
