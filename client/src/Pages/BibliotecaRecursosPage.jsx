
import parseJwt from "../components/DesenciptarJWT";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarUser } from "../components/NavbarUser";
import {ButtonBiblioteca} from '../components/ButtonBiblioteca';
import { TablaPuntajes } from '../components/TablaPuntajes';
import Axios from 'axios';

export const BibliotecaRecursosPage = () => {
    const [tokenExiste, setTokenExiste] = useState(false);
    const navigate = useNavigate("");
    const [libro, setLibro] = useState([]);

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

        //----------cargar todos los libros---------

        Axios.get("http://localhost:3001/cargarTodosLosLibros").then((response) => {
            setLibro(response.data);

        });
    }, [navigate]);

    const irUploadRecurso =()=>{
        navigate("/uploadRecurso")
    }
    //----------filtro de materias-------------

    const [filtroMateria, setFiltroMateria] = useState("todas");

    const filtrarLibros = () => {
        let librosFiltrados = [...libro];
        if (filtroMateria !== "todas") {
            librosFiltrados = librosFiltrados.filter(doc => doc.materia === filtroMateria);
        }

        return librosFiltrados;
    }
    const irPerfilOtroUser = (idUsuario) => {
        navigate('/perfilOtro', { state: { idUsuario } });
    }


    return (
        <>
            {tokenExiste ? (
                <div>
                    <NavbarUser />

                    <ButtonBiblioteca/>

                    <div className="container-fluid d-flex align-items-left mt-5">
                        <div className="btn-group col-sm-3" role="group" aria-label="Basic outlined example">
                        <select
                                className="form-select form-select-sm"
                                aria-label="Small select example"
                                value={filtroMateria}
                                onChange={(e) => setFiltroMateria(e.target.value)}
                            >
                                <option value="todas">Todas las materias</option>
                                <option value="matematica">Matemáticas</option>
                                <option value="calculo">Cálculo</option>
                                <option value="fisica">Física</option>
                                <option value="algebra lineal">Algebra lineal</option>
                                <option value="probabilidad">Probabilidad</option>
                                <option value="estadistica">Estadística</option>
                            </select>
                        </div>

                        <button type="button" className="btn btn-outline-primary  ms-auto" onClick={irUploadRecurso}>
                            Subir libro
                        </button>

                    </div>

                    <div className="container-fluid mt-3">
                        <div className="row">
                            {/* Contenedor izquierdo */}
                            <div className="col-lg-8 col-md-12">
                            {filtrarLibros().map((libro, index) => (
                                    <div key={index} className="container mb-3" style={{ border: '1px solid', padding: '15px' }}>
                                        <div  className="row">
                                            <div className="col-1">
                                                <a href={libro.url_archivo} target="_blank" rel="noopener noreferrer">
                                                    <img src="https://cdn-icons-png.flaticon.com/512/81/81040.png" alt="Icono Documento" width="50" />
                                                </a>
                                            </div>
                                            <div className="col">
                                                <p className="mb-0"><strong>Título: </strong> {libro.titulo}</p>
                                                <p className="mb-0"><strong>Autor: </strong> {libro.autor}</p>
                                            </div>
                                       
                                            <div className="col">
                                                <p className="mb-0"><strong>Materia: </strong> {libro.materia}</p>
                                            </div>
                                            <div className="col">
                                                <p className="mb-0"><strong>Subido por: </strong>
                                                <a href="/perfilOtro" onClick={() => irPerfilOtroUser(libro.id_usuarios)} className="link-underline-primary">
                                                {libro.nombre}
                                                    </a>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            
                            </div>

                            {/* Contenedor derecho */}
                            <div className="col-lg-4 col-md-12">
                            <TablaPuntajes/>
                            </div>
                        </div>
                    </div>

                </div>
            ) : null}
        </>
    );
}
