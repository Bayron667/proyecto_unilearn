import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { NavbarBasic } from "../components/NavbarBasic";
import parseJwt from "../components/DesenciptarJWT";
import { useState, useEffect} from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import CarouselComponent from "../components/CarouselComponent";



export const HomePage = () => {
  const navigate = useNavigate();

  const [tokenExiste, setTokenExiste] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const parsedToken = parseJwt(token);

    if (parsedToken === null) {
      navigate("/");
      return;
    }

    const expiracion = parsedToken.exp * 1000;
    const ahora = Date.now();

    if (expiracion > ahora) {
      setTokenExiste(true);
      navigate("/dashboard");
    } else {
      navigate("/");
    }

    

  }, [navigate]);


  return (
    <>
      {!tokenExiste ? (
        <div>

          <NavbarBasic />

          <div className="card mb-1" style={{ backgroundColor: "#e3f2fd" }}>
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src="https://www.21kschool.com/blog/wp-content/uploads/2023/05/How-to-Choose-the-Best-Online-School-for-Your-Childs-Education-1.png"
                  alt="..."
                  className="img-fluid rounded-start"
                  style={{ height: "250px" }}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title fs-1">
                    Tu Éxito, Tu Comunidad, Tu Camino.
                  </h5>
                  <p className="card-text fs-4">
                    UniLearn, es una plataforma colaborativa entre estudiantes,
                    donde se podrá encontrar una personalización educativa,
                    interacción y tutoría en línea inmediata, comunidad de
                    aprendizaje activa y desarrollo integral del estudiante.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
              <a className="navbar-brand" href="/login">
                Matematicas
              </a>
              <a className="navbar-brand" href="/login">
                Calculo
              </a>
              <a className="navbar-brand" href="/login">
                Fisica
              </a>
              <a className="navbar-brand" href="/login">
                Algebra linela
              </a>
              <a className="navbar-brand" href="/login">
                Probabilidad
              </a>
              <a className="navbar-brand" href="/login">
                Estadística
              </a>
            </div>
          </nav>

          <CarouselComponent/>


        </div>
      ) : null}
    </>
  );
};
