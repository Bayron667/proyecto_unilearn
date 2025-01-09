import parseJwt from "../components/DesenciptarJWT";
import { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { NavbarBasic } from "../components/NavbarBasic";

export const RegisterPage = () => {
  // redirigir usuario
  const navigate = useNavigate();
  const [tokenExiste, setTokenExiste] = useState(false);
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [genero, setGenero] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const parsedToken = parseJwt(token);

    if (parsedToken === null) {

      return;
    }

    const expiracion = parsedToken.exp * 1000;
    const ahora = Date.now();

    if (expiracion > ahora) {
      setTokenExiste(true);
      navigate("/dashboard");
    } 

  }, [navigate]);

  //crear usuario funcion

  const add = () => {
    Axios.post("http://localhost:3001/create", {
      nombre: nombre,
      edad: edad,
      genero: genero,
      correo: correo,
      clave: clave,
    })
      .then(() => {
        Swal.fire({
          title: "<strong>Registro exitoso!</strong>",
          html: "<i>El empleado " + nombre + " fue registrado con exito!</i>",
          icon: "success",
          timer: 3000,
        });
        limpiar();
        navigate("/login");
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Swal.fire({
            title: "<strong>Error!</strong>",
            html: "<i>El correo ya está en uso.</i>",
            icon: "error",
            timer: 3000,
          });
          limpiar();
        }
      });
  };
  //validaciones
  const onSubmit = (data) => { };

  //limpiar

  const limpiar = () => {
    setNombre("");
    setEdad("");
    setGenero("");
    setCorreo("");
    setClave("");
  };

  return (
    <>
      {!tokenExiste ? (
        <div>


          <NavbarBasic />
          <div className="container-fluid d-flex justify-content-center align-items-center" >
            <div className="card text-center mt-5" style={{ maxWidth: '400px', backgroundColor: "#d7eee8" }} >
              <div className="card-header">
                <h2>
                  Únete a UniLearn
                  <>
                    <br />
                    Crea una cuenta para ser parte de la comunidad
                    <br />
                  </>
                </h2>
              </div>
              <div className="card-body">
                <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <input
                      {...register("name", {
                        required: true,
                        maxLength: 30,
                      })}
                      onChange={(event) => {
                        setNombre(event.target.value);
                      }}
                      type="text"
                      className="form-control"
                      placeholder="Nombre y Apelido"
                    />
                    {errors.name?.type === "required" && (
                      <p className="text-danger small mb-0">
                        El nombre y apellido es requerido
                      </p>
                    )}
                    {errors.name?.type === "maxLength" && (
                      <p className="text-danger small mb-0">
                        El nombre y apellido solo puede tener 30 caracteres
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      {...register("age", {
                        required: true,
                        maxLength: 3,
                      })}
                      onChange={(event) => {
                        setEdad(event.target.value);
                      }}
                      type="number"
                      className="form-control"
                      placeholder="Edad"
                    />
                    {errors.age?.type === "required" && (
                      <p className="text-danger small mb-0">la edad es requerido</p>
                    )}
                    {errors.age?.type === "maxLength" && (
                      <p className="text-danger small mb-0">
                        la edad solo puede tener 3 caracteres
                      </p>
                    )}
                  </div>

                  <div>
                    <select
                      className="form-select"
                      {...register("sex", {
                        required: true,
                      })}
                      onChange={(event) => {
                        setGenero(event.target.value);
                      }}
                      defaultValue="0"
                    >
                      <option value="0" disabled>
                        Seleccione un genero
                      </option>
                      <option value="1">Hombre</option>
                      <option value="2">Mujer</option>
                      <option value="3">Otro</option>
                    </select>
                    {errors.sex?.type === "required" && (
                      <p className="text-danger small mb-0">
                        Seleciona una opcion de genero
                      </p>
                    )}
                  </div>

                  <div>
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
                      <p className="text-danger small mb-0">El email es requerido</p>
                    )}
                    {errors.email?.type === "pattern" && (
                      <p className="text-danger small mb-0">El email es incorrecto</p>
                    )}
                  </div>
                  <div className="class">
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
                      <p class="text-danger small mb-0">la contraseña es requerido</p>
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
                        onClick={add}
                      >
                        Registrar
                      </button>
                    ) : (
                      <button type="submit button" className="btn btn-primary">
                        Registrar
                      </button>
                    )}
                  </div>
                </form>
                <samp>¿Ya tienes una cueta? </samp>
                <a href="/login" className="link-underline-primary">
                  Iniciar sesión
                </a>
              </div>
            </div>
          </div>



        </div>
      ) : null}
    </>

  );
};
