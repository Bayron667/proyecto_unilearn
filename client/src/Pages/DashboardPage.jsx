import parseJwt from "../components/DesenciptarJWT";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarUser } from "../components/NavbarUser";
import { ButtonBiblioteca } from '../components/ButtonBiblioteca';
import { TablaPuntajes } from "../components/TablaPuntajes";
import Axios from 'axios';

export const DashboardPage = () => {
    const [tokenExiste, setTokenExiste] = useState(false);
    const navigate = useNavigate("");
    const [preguntas, setPreguntas] = useState([]);

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

        //-----------cargar preguntas---------
        Axios.get("http://localhost:3001/cargarTodasLasPreguntas").then((response) => {
            setPreguntas(response.data);

        });
    }, [navigate]);

    const irUploadPregunta = () => {
        navigate("/preguntas")
    }
    const irResolver = (idPregunta, pregunta, materia, nombre, idUsuario) => {
        navigate('/respuestas', { state: { idPregunta, pregunta, materia, nombre, idUsuario } });
    }

    //----------aplicar filtros-------------

    const [filtroMateria, setFiltroMateria] = useState("todas");

    const filtrarPreguntas = () => {
        let preguntasFiltrados = [...preguntas];

        if (filtroMateria !== "todas") {
            preguntasFiltrados = preguntasFiltrados.filter(doc => doc.materia === filtroMateria);
        }

        return preguntasFiltrados;
    }

    const irPerfilOtroUser = (idUsuario) => {
        navigate('/perfilOtro', { state: { idUsuario } });
    }

    return (
        <>
            {tokenExiste ? (
                <div>
                    <NavbarUser />

                    <ButtonBiblioteca />


                    <div className="container-fluid d-flex align-items-left mt-5">
                        <div className="btn-group col-sm-2" role="group" aria-label="Basic outlined example">


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
                        <button type="button" className="btn btn-outline-primary  ms-auto" onClick={irUploadPregunta}>
                            Realiazar una pregunta
                        </button>

                    </div>

                    <div className="container-fluid mt-3">
                        <div className="row">
                            {/* Contenedor izquierdo */}
                            <div className="col-lg-8 col-md-12">
                                {filtrarPreguntas().map((preguntas, index) => (
                                    <div key={index} className="container mb-3" style={{ border: '1px solid', padding: '15px' }}>
                                        <div className="row">

                                            <div className="col-7">

                                                <p className="mb-0"><strong>Pregunta: </strong> {preguntas.texto}</p>

                                            </div>
                                            <div className="col">
                                                <p className="mb-0"><strong>Materia: </strong> {preguntas.materia}</p>
                                                <p className="mb-0"><strong>Subido por: </strong>
                                                    <a href="/perfilOtro" onClick={()=>irPerfilOtroUser(preguntas.id_usuarios)} className="link-underline-primary">
                                                        {preguntas.nombre}
                                                    </a>
                                                </p>


                                            </div>

                                            <div className="col d-flex justify-content-end mt-auto">
                                                <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => irResolver(preguntas.id_pregunta, preguntas.texto, preguntas.materia, preguntas.nombre, preguntas.id_usuarios)}>
                                                    Resolver
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Contenedor derecho */}
                            <div className="col-lg-4 col-md-12">
                                <TablaPuntajes />
                            </div>
                        </div>
                    </div>

                </div>
            ) : null}
        </>
    );
};
