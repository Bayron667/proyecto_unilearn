import parseJwt from "../components/DesenciptarJWT";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavbarUser } from "../components/NavbarUser";
import Swal from "sweetalert2";
import Axios from 'axios';
import { useForm, Controller } from 'react-hook-form';

export const RespuestaPage = () => {
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const { state } = useLocation();
  const [tokenExiste, setTokenExiste] = useState(false);
  const navigate = useNavigate("");
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [respuestas, setRespuestas] = useState([]);

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
    } else {
      navigate("/");
    }
    //--------cargar foto de perfil----------
    Axios.get(`http://localhost:3001/usuario/${state?.idUsuario}`)
      .then((response) => {
        const userData = response.data[0]; // Suponiendo que la consulta devuelve un solo usuario
        setFotoPerfil(userData.url);
      })
      .catch((error) => {
        Swal.fire({
          title: "<strong>Error!</strong>",
          html: "<i>Error al obtener la foto del usuario.</i>",
          icon: "error",
          timer: 3000,
        });
      });
    //--------------cargar la respuestas de esa pregunta---------
    Axios.get(`http://localhost:3001/cargarTodasLasRespuestas/${state?.idPregunta}`)
      .then((response) => {
        setRespuestas(response.data)
      })
      .catch((error) => {
        Swal.fire({
          title: "<strong>Error!</strong>",
          html: "<i>Error las respuestas de la pregunta.</i>",
          icon: "error",
          timer: 3000,
        });
      });


  }, [navigate]);

  const onSubmit = (data) => {
    Axios.post("http://localhost:3001/createRespuesta", {
      respuesta: data.respuesta,
      id: parseJwt(localStorage.getItem("token")).id,
      idPregunta: state?.idPregunta
    }).then(() => {
      Swal.fire({
        title: "<strong>Registro exitoso!</strong>",
        html: "<i>La respuesta fue subida correctamete!</i>",
        icon: "success",
        timer: 3000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }).catch((error) => {
      if (error) {
        Swal.fire({
          title: "<strong>Error!</strong>",
          html: "<i>ocurrio un error al cargar los datos</i>",
          icon: "error",
          timer: 3000,
        });
      }
    });
  };

  return (
    <>
      {tokenExiste ? (
        <div>
          <NavbarUser />

          <div className="container-fluid mt-4">
            <div className="row">
              {/* Contenedor izquierdo */}
              <div className="col-lg-8 col-md-12">
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div className="me-3">
                        <img
                          src={fotoPerfil || "https://cdn-icons-png.flaticon.com/512/6073/6073873.png"}
                          className="card-img-top rounded-circle"
                          alt="Foto de perfil"
                          style={{ width: "80px", height: "80px", margin: "auto" }}
                        />
                      </div>
                      <div>
                        <p className="fs-2 card-title mb-0">{state?.nombre}</p>
                        <p className="text-body-secondary card-text mb-0">Materia: {state?.materia}</p>
                      </div>
                    </div>
                    <div>
                      <h6 className="fw-bold card-subtitle mb-2 text-muted">Pregunta</h6>
                      <p className="card-text">
                        {state?.pregunta}
                      </p>
                    </div>
                  </div>


                </div>


                {respuestas.map((respuesta, index) => (
                  <div key={index} className="container mb-3 col-11 " style={{ border: '1px solid', padding: '15px' }}>
                    <div className="row">
                      <div className="col-1">
                        <img
                          src={respuesta.url || "https://cdn-icons-png.flaticon.com/512/6073/6073873.png"}
                          className="card-img-top rounded-circle"
                          alt="Foto de perfil"
                          style={{ width: "60px", height: "60px", margin: "auto" }}
                        />
                      </div>
                      <div className="col-6 mx-2">

                        <p className="mb-0"><strong>Respuesta:</strong> {respuesta.texto}</p>
                      </div>
                      <div className="col d-flex justify-content-end mt-auto">
                        <p className="mb-0"><strong>Resuelto por:</strong> {respuesta.nombre}</p>
                      </div>
                    </div>
                  </div>
                ))}


              </div>

              {/* Contenedor derecho */}
              <div className="col-lg-4 col-md-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title text-center mb-4">Responder Pregunta</h5>
                    <form className="text-center" onSubmit={handleSubmit(onSubmit)}>
                      <div className="mb-3 input-group">
                        <span className="input-group-text" id="basic-addon1">Respuesta</span>
                        <Controller
                          name="respuesta"
                          control={control}
                          defaultValue=""
                          rules={{ required: 'Este campo es requerido' }}
                          render={({ field }) => (
                            <textarea {...field} className={`form-control ${errors.respuesta ? 'is-invalid' : ''}`} rows="4" />
                          )}
                        />
                        {errors.respuesta && <div className="invalid-feedback">{errors.respuesta.message}</div>}
                      </div>

                      <button type="submit" className="btn btn-primary">Enviar Respuesta</button>
                    </form>
                  </div>
                </div>
              </div>


            </div>

          </div>
        </div>
      ) : null}
    </>
  );
}
