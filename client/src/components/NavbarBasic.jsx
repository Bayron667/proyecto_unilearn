import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../asset/logoImagen.png";
import { useNavigate} from "react-router-dom";

export const NavbarBasic = () => {
    const navigate = useNavigate();
  
  const irHome = ()=>{
    navigate("/")
  }
  const irLogin = ()=>{
    navigate("/login")
  }
  const irRegistrarse = ()=>{
    navigate("/register")
  }
  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#e3f2fd" }}>
        <div className="container-fluid">
          <button className="navbar-brand me-auto" onClick={irHome} 
          style={{
          border: 'none',
          padding: '0',
          background: 'none',
          cursor: 'pointer',
          outline: 'none', }}>
            <img src={logo} width="70" height="70" />
          </button>

          <form className="d-flex mx-2 me-auto">
          <input className="form-control me-2" type="search" placeholder="Buscar" aria-label="Buscar" />
          <button className="btn btn-outline-success" onClick={irLogin}>Buscar</button>
        </form>


          <div className="d-flex align-items-center">
            <button className="btn btn-outline-success me-2 col-auto" onClick={irLogin}>
              Iniciar sesión
            </button>

            <button className="btn btn-outline-success" onClick={irRegistrarse}>
              Registrarse
            </button>
          </div>
        </div>
      </nav>
  )
}
