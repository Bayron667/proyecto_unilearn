import parseJwt from "../components/DesenciptarJWT";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavbarUser } from "../components/NavbarUser";
import Axios from "axios";
import Swal from "sweetalert2";

import { useForm } from 'react-hook-form';
import StarRating from "../components/StarRating";

export const PerfilOtroPage = () => {
  const { state } = useLocation();

  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [tokenExiste, setTokenExiste] = useState(false);
  const navigate = useNavigate("");

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [genero, setGenero] = useState("");
  const [email, setEmail] = useState("");
  const [claveAntigua, setClaveAntigua] = useState("");
  const [claveNueva, setClaveNueva] = useState("");

  useEffect(() => {


    Axios.get(`http://localhost:3001/usuario/${state?.idUsuario}`)
      .then((response) => {
        const userData = response.data[0]; // Suponiendo que la consulta devuelve un solo usuario
        setNombre(userData.nombre);
        setEdad(userData.edad);
        setGenero(userData.genero);
        setEmail(userData.correo);
        setFotoPerfil(userData.url);
      })
      .catch((error) => {
        Swal.fire({
          title: "<strong>Error!</strong>",
          html: "<i>Error al obtener los datos del usuario.</i>",
          icon: "error",
          timer: 3000,
        });
      });
    //----------------------------------------
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
    } else {
      navigate("/");
    }
  }, [navigate]);

  const [activeTab, setActiveTab] = useState("description");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };



  return (
    <>
      {tokenExiste ? (
        <div>
          <NavbarUser />
          <div className="container-fluid mt-5" style={{ maxWidth: '500px', }}>

            <div className="card text-center">

              <div className="card-heder text-center mt-3" >
                <img src={fotoPerfil || "https://cdn-icons-png.flaticon.com/512/6073/6073873.png"} className="card-img-top rounded-circle"
                  alt="Foto de perfil" style={{ width: "150px", height: "150px", margin: "auto" }} />

              </div>
              
              <StarRating idCalificado={state?.idUsuario}/>

              <div className="card-body">
                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">
                    Nombre
                  </span>
                  <input value={nombre} type="text"
                    className="form-control" aria-label="Username" aria-describedby="basic-addon1" disabled
                  />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">
                    Edad
                  </span>
                  <input value={edad} type="text" disabled
                    className="form-control" aria-label="Username" aria-describedby="basic-addon1"
                  />
                  <span className="input-group-text" id="basic-addon1">
                    Genero
                  </span>
                  <select className="form-select" value={genero} disabled >
                    <option value="1">Hombre</option>
                    <option value="2">Mujer</option>
                    <option value="3">Otro</option>
                  </select>
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">
                    Correo
                  </span>
                  <input value={email} type="text" disabled
                    className="form-control" aria-label="Username" aria-describedby="basic-addon1" />
                </div>
              </div>

            </div>
          </div>


        </div>
      ) : null}
    </>
  );
}
