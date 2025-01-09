import parseJwt from "../components/DesenciptarJWT";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarUser } from "../components/NavbarUser";
import { useForm } from 'react-hook-form';
import { upLoadFileUser } from "../FireBase/config";
import Axios from "axios";
import Swal from "sweetalert2";

export const PreguntasPage = () => {
  const [tokenExiste, setTokenExiste] = useState(false);
  const navigate = useNavigate("");
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [Url, setUrl] = useState();


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
  }, [navigate]);

  const onSubmit = (data) => {
    Axios.post("http://localhost:3001/createPregunta", {
      pregunta: data.pregunta,
      materia: data.materia,
      id: parseJwt(localStorage.getItem("token")).id

    })
      .then(() => {
        Swal.fire({
          title: "<strong>Registro exitoso!</strong>",
          html: "<i>La pregunta fue subido con exito!</i>",
          icon: "success",
          timer: 3000,
        });
        navigate("/dashboard");
      })
      .catch((error) => {
        if (error) {
          Swal.fire({
            title: "<strong>Error!</strong>",
            html: "<i>ocurrio un error al cargar los datos</i>",
            icon: "error",
            timer: 3000,
          });
        }
      });
  }
  
  return (
    <>
      {tokenExiste ? (
        <div>
          <NavbarUser />

          <div className="container-fluid mt-4">
            <div className="row justify-content-center">
              <div className="col-md-5 mx-5 mt-5">
                <p className="fs-1">Realiza tu pregunta!!!</p>
                <p className="fs-4">¡Tu pregunta puede ser la clave para el aprendizaje de alguien más! Comparte tu inquietud o inicia una conversación sobre un tema que te interese. Juntos, construimos un camino hacia el aprendizaje más efectivo y colaborativo. ¡Anímate a compartir hoy tu pregunta con la comunidad educativa de UniLearn!</p>
              </div>

              {/* Contenedor derecho */}
              <div className="col-md-6 mt-5">
                <div className="card mx-5" style={{ maxWidth: '500px' }}>

                  <div className="card-body text-center">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="mb-3">
                        <div className="input-group">
                          <span className="input-group-text" id="basic-addon1">Pregunta</span>
                          <textarea {...register('pregunta', { required: true })} type="text" className="form-control" aria-label="With textarea"/>
                        </div>
                        {errors.pregunta && <span className="text-danger">Este campo es requerido</span>}
                      </div>

                      <div className="mb-3">
                        <div className="input-group">
                          <label className="input-group-text" htmlFor="inputGroupSelect01">
                            Materia
                          </label>
                          <select
                            {...register('materia')}
                            className="form-select"
                            id="materia"
                          >
                            <option value="matematica">Matemáticas</option>
                            <option value="calculo">Cálculo</option>
                            <option value="fisica">Física</option>
                            <option value="algebra lineal">Algebra lineal</option>
                            <option value="probabilidad">Probabilidad</option>
                            <option value="estadistica">Estadística</option>
                          </select>
                        </div>

                      </div>

                      <button type="submit" className="btn btn-primary">Cargar pregunta</button>
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
