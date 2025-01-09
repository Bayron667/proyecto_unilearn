import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import parseJwt from "../components/DesenciptarJWT";
import { NavbarBasic } from "../components/NavbarBasic";

export const LoginPage = () => {
  const navigate = useNavigate("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm("");

  const iniciarSesion = () => {
    Axios.post("http://localhost:3001/login", {
      correo: correo,
      clave: clave,
    })
      .then((response) => {
        const token = response.data.token;
        localStorage.setItem("token", token);

        Swal.fire({
          title: "<strong>Inicio de Sesión Exitoso!</strong>",
          html: "<i>¡Bienvenido " + parseJwt(token).nombre + "!</i>",
          icon: "success",
          timer: 3000,
        });
        limpiar();
        //enviar sesion al dashboard
        navigate("/dashboard", {
          replace: true,
          state: {
            logged: true,
          },
        });
      })
      .catch((error) => {
        if (error.response) {
          // Respuesta del servidor con un status diferente a 2xx
          if (error.response.status === 404) {
            Swal.fire({
              title: "<strong>Error!</strong>",
              html: "<i>Usuario no encontrado.</i>",
              icon: "error",
              timer: 3000,
            });
          } else if (error.response.status === 401) {
            Swal.fire({
              title: "<strong>Error!</strong>",
              html: "<i>Contraseña incorrecta.</i>",
              icon: "error",
              timer: 3000,
            });
          } else {
            Swal.fire({
              title: "<strong>Error!</strong>",
              html: "<i>Ocurrió un error. Por favor, inténtalo de nuevo más tarde.</i>",
              icon: "error",
              timer: 3000,
            });
          }
        }
      });
  };

  const limpiar = () => {
    setCorreo("");
    setClave("");
  };
  //validaciones
  const onSubmit = (data) => { };

  // si la sesion aun es verdadera
  const [tokenExiste, setTokenExiste] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const parsedToken = parseJwt(token);
    const expiracion = parsedToken.exp * 1000;
    const ahora = Date.now();

    if (!token) {
      navigate("/login");
      return;
    }
    if (parsedToken === null) {
      navigate("/login");
      return;
    }

    if (expiracion > ahora) {
      setTokenExiste(true);
      navigate("/dashboard", {
        replace: true,
        state: {
          logged: true,
        },
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
      {tokenExiste ? null : (
        <div>
          <NavbarBasic />
          <div className="container-fluid d-flex justify-content-center align-items-center">
            <div className="card text-center mt-5" style={{ maxWidth: '400px', backgroundColor: "#d7eee8" }}>
              <div className="card-header">
                <h2>
                  Bienvenido de nuevo
                  <>
                    <br />
                    Obtén respuestas en minutos y termina las tareas escolares más
                    rápido
                    <br />
                  </>
                </h2>
              </div>
              <div className="card-body">
                <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                  <div className="class">
                    <input
                      {...register("email", {
                        required: true,
                        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      })}
                      onChange={(event) => {
                        setCorreo(event.target.value);
                      }}
                      type="email"
                      className="form-control"
                      placeholder="Correo"
                    />
                    {errors.email?.type === "required" && (
                      <p className="text-danger small mb-0">
                        El email es requerido
                      </p>
                    )}
                    {errors.email?.type === "pattern" && (
                      <p className="text-danger small mb-0">
                        El email es incorrecto
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      {...register("pass", {
                        required: true,
                        maxLength: 10,
                      })}
                      onChange={(event) => {
                        setClave(event.target.value);
                      }}
                      type="password"
                      className="form-control"
                      placeholder="Contraseña"
                    />
                    {errors.pass?.type === "required" && (
                      <p className="text-danger small mb-0">
                        la contraseña es requerido
                      </p>
                    )}
                    {errors.pass?.type === "maxLength" && (
                      <p className="text-danger small mb-0">
                        la contraseña solo puede tener 10 caracteres
                      </p>
                    )}
                  </div>
                  <div className="card-footer">
                    {isValid ? (
                      <button
                        type="submit button"
                        className="btn btn-primary"
                        onClick={iniciarSesion}
                      >
                        Iniciar sesión
                      </button>
                    ) : (
                      <button type="submit button" className="btn btn-primary">
                        Iniciar sesión
                      </button>
                    )}
                  </div>
                </form>
                <samp>¿No tienes una cuenta? </samp>
                <a href="/register" className="link-underline-primary">
                  Registrarse
                </a>
              </div>
            </div>
          </div>

        </div>
      )}
    </>
  );
};
