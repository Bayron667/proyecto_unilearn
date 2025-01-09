import parseJwt from "../components/DesenciptarJWT";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarUser } from "../components/NavbarUser";
import Axios from "axios";
import Swal from "sweetalert2";
import { upLoadFile } from "../FireBase/config";
import { useForm } from 'react-hook-form';
import { MostrarStarRating } from "../components/MostrarStarRating";
import PreguntaCard from "../components/PreguntaCard";
import PreguntaRespuestaCard from "../components/PreguntaRespuestaCard";

export const PerfilUsuarioPage = () => {
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
    // obtener datos del usuario
    const id = parseJwt(localStorage.getItem("token")).id;
    const correo = parseJwt(localStorage.getItem("token")).correo;
    // Supongamos que `blobImage` contiene el BLOB de la imagen recibida del servidor

    Axios.get(`http://localhost:3001/usuario/${id}`)
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

  //cargar de la foto de perfil

  const handleFileChange = async (e) => {
    const selectedFoto = e.target.files[0];
    try {
      const result = await upLoadFile(selectedFoto)
      const id = parseJwt(localStorage.getItem("token")).id;

      Axios.put("http://localhost:3001/updateFoto", {
        url: result,
        id: id
      }).then(() => {
        Swal.fire({
          title: "<strong>Actualización exitosa!</strong>",
          html: "<i>Foto subida con exito!</i>",
          icon: "success",
          timer: 3000,
        });
      }).catch(error => {
        console.error("Error al enviar la foto a la base de datos:", error);
        Swal.fire({
          title: "<strong>Error</strong>",
          html: "<i>Error al enviar la foto a la base de datos.</i>",
          icon: "error",
          timer: 3000,
        });
      });


    } catch (error) {
      Swal.fire({
        title: "<strong>Error!</strong>",
        html: "<i>Error al cargar la imagen.</i>",
        icon: "error",
        timer: 3000,
      });


    }

    const reader = new FileReader();

    reader.onload = () => {
      setFotoPerfil(reader.result);
    };

    if (selectedFoto) {
      reader.readAsDataURL(selectedFoto);
    }

  };
  //-------------------------------------------------
  //--------Actuaizar datos---------------

  const updateDatos = () => {

    const id = parseJwt(localStorage.getItem("token")).id;

    Axios.put("http://localhost:3001/updateDatos", {
      id: id,
      nombre: nombre,
      edad: edad,
      genero: genero,
      correo: email
    }).then(() => {
      Swal.fire({
        title: "<strong>Actualización exitosa!</strong>",
        html: "<i>Datos actualizados correctamente!</i>",
        icon: "success",
        timer: 3000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }).catch((error) => {
      Swal.fire({
        title: "<strong>Error</strong>",
        html: `<i>${error.message}</i>`, // Mostrar el mensaje de error del servidor
        icon: "error",
        timer: 3000,
      });
    });

  }

  //-------------modificar la contraseña del usuairo--------------------------
  const updatePassword = (data) => {
    const id = parseJwt(localStorage.getItem("token")).id;

    Axios.put("http://localhost:3001/updatePassword", {
      id: id,
      antiguaClave: data.claveAntigua,
      nuevaClave: data.claveNueva
    })
      .then(() => {
        limpiar();
        Swal.fire({
          title: "<strong>Actualización exitosa!</strong>",
          html: "<i>Contraseña actualizada correctamente!</i>",
          icon: "success",
          timer: 3000,
        });
      }).catch((error) => {
        if (error.response && error.response.status === 401) {
          Swal.fire({
            title: "<strong>Error</strong>",
            html: "<i>La contraseña antigua es incorrecta</i>",
            icon: "error",
            timer: 3000,
          });
        } else {
          Swal.fire({
            title: "<strong>Error</strong>",
            html: `<i>${error.message}</i>`,
            icon: "error",
            timer: 3000,
          });
        }
      });

  };

  //---------------------------------------

  const limpiar = () => {
    setClaveNueva("");
    setClaveAntigua("");
  }
  const deleteCuenta = () =>{
      const id = parseJwt(localStorage.getItem("token")).id;
      const nombre = parseJwt(localStorage.getItem("token")).nombre;
      Swal.fire({
        title: '¿Confirmar eliminar?',
        html: "<i>¿Desea Eliminar la cuenta " + nombre + "?</i>",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo!'
      }).then((result) => {
        if (result.isConfirmed) {
          Axios.delete(`http://localhost:3001/delete/${id}`).then(() => {  
            Swal.fire(
              'Eliminado!',
              'La cuenta de '+nombre + ' fue eliminada.',
              'success'
            );
          });
          localStorage.removeItem("token");
          navigate("/");
  
          
        }
      });
  
    
  }

  return (
    <>
      {tokenExiste ? (
        <div>
          <NavbarUser />
          <div className="container-fluid mt-3">
            <div className="row">
              {/* Contenedor izquierdo */}
              <div className="col-lg-4 col-md-12">
                <div className="card text-center">

                  <div className="card-heder text-center mt-3" >
                    <h5 className="card-title">{parseJwt(localStorage.getItem("token")).nombre}</h5>
                    <img src={fotoPerfil || "https://cdn-icons-png.flaticon.com/512/6073/6073873.png"} className="card-img-top rounded-circle"
                      alt="Foto de perfil" style={{ width: "150px", height: "150px", margin: "auto" }} />
                      <MostrarStarRating id ={parseJwt(localStorage.getItem("token")).id}/>
                    <div className="mb-1 mt-3">
                      <label htmlFor="file-upload" className="btn btn-primary me-2">
                        Elegir Archivo
                      </label>
                      <input id="file-upload" type="file" className="form-control" onChange={handleFileChange}  accept="image/*"
                        style={{ display: 'none' }} />
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="input-group mb-3">
                      <span className="input-group-text" id="basic-addon1">
                        Nombre
                      </span>
                      <input value={nombre} onChange={(event) => { setNombre(event.target.value); }} type="text"
                        className="form-control" aria-label="Username" aria-describedby="basic-addon1"
                      />
                    </div>

                    <div className="input-group mb-3">
                      <span className="input-group-text" id="basic-addon1">
                        Edad
                      </span>
                      <input value={edad} onChange={(event) => { setEdad(event.target.value) }} type="text"
                        className="form-control" aria-label="Username" aria-describedby="basic-addon1"
                      />
                      <span className="input-group-text" id="basic-addon1">
                        Genero
                      </span>
                      <select className="form-select" value={genero} onChange={(event) => {setGenero(event.target.value) }} >
                        <option value="1">Hombre</option>
                        <option value="2">Mujer</option>
                        <option value="3">Otro</option>
                      </select>
                    </div>

                    <div className="input-group mb-3">
                      <span className="input-group-text" id="basic-addon1">
                        Correo
                      </span>
                      <input value={email} onChange={(event) => { setEmail(event.target.value)}} type="text"
                        className="form-control" aria-label="Username" aria-describedby="basic-addon1" />
                    </div>
                    <button className="btn btn-primary" onClick={updateDatos}>Actualizar datos</button>
                    <button className="btn btn-danger mx-2" onClick={deleteCuenta}>Eliminar cuenta</button>
                  </div>

                  <div className="border-top"></div>

                  <div className="card-body">
                    <form onSubmit={handleSubmit(updatePassword)}>
                      <div className="mb-3">
                        <div className="input-group">
                          <span className="input-group-text" id="basic-addon1">Contraseña</span>
                          <input {...register('claveAntigua', { required: true })} onChange={(e) => { setClaveAntigua(e.target.value) }} value={claveAntigua} type="password" className="form-control" />
                        </div>
                        {errors.claveAntigua && <span className="text-danger">Este campo es requerido</span>}
                      </div>

                      <div className="mb-3">
                        <div className="input-group">
                          <span className="input-group-text" id="basic-addon1">Nueva contraseña</span>
                          <input {...register('claveNueva', { required: true })} onChange={(e) => { setClaveNueva(e.target.value) }} type="password" className="form-control" value={claveNueva} />
                        </div>
                        {errors.claveNueva && <span className="text-danger">Este campo es requerido</span>}
                      </div>
                      <button type="submit" className="btn btn-primary">Cambiar contraseña</button>
                    </form>

                  </div>
                </div>
              </div>

              {/* Contenedor derecho */}
              <div className="col-lg-8 col-md-12">
                <div className="card">
                  <div className="card-header">
                    <ul className="nav nav-tabs card-header-tabs">
                      <li className="nav-item">
                        <button
                          className={`nav-link ${activeTab === "description" ? "active" : ""
                            }`}
                          onClick={() => handleTabClick("description")}
                        >
                          Preguntas
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className={`nav-link ${activeTab === "history" ? "active" : ""
                            }`}
                          onClick={() => handleTabClick("history")}
                        >
                          Respuestas
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div className="card-body">
                    {activeTab === "description" && (
                      <>
                        <PreguntaCard id={parseJwt(localStorage.getItem("token")).id}/>
                      </>
                    )}

                    {activeTab === "history" && (
                      <>
                        <PreguntaRespuestaCard id={parseJwt(localStorage.getItem("token")).id}/>  
                      </>
                    )}


                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
