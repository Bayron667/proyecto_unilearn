import axios from 'axios';
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import parseJwt from "../components/DesenciptarJWT";
import logo from "../asset/logoImagen.png";
import Swal from "sweetalert2";

export const BuscarPage = () => {

    const [tokenExiste, setTokenExiste] = useState(false);
    const navigate = useNavigate("");
    const { state } = useLocation();
    const [textoBuscar, setTextoBuscar] = useState(state?.textoBuscar || "");
    const [datos, setDatos] = useState([]);
    const [estado, setEstado] = useState(false);




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

    const irDashboard = () => {
        navigate("/dashboard");
    };

    const cerrarSesion = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const irPerfil = () => {
        navigate("/perfil");
    }

    const buscarPreguntas = async () => {
        if (textoBuscar.trim() === "") {
            // Si el campo de búsqueda está vacío, no hacemos la solicitud
            return;
        }

        const stopWords = [
            "de", "la", "que", "el", "en", "y", "a", "los", "se", "del",
            "las", "un", "por", "con", "no", "una", "su", "para", "es", "al"
        ];

        const palabras = textoBuscar.split(' ');
        const palabrasFiltradas = palabras.filter(palabra => !stopWords.includes(palabra));

        try {
            const resultados = [];
            for (const palabra of palabrasFiltradas) {
                const response = await axios.get(`http://localhost:3001/buscar/${palabra}`);
                resultados.push(...response.data);
            }
            if (resultados.length === 0) {
                Swal.fire({
                    title: "Sin Resultados",
                    text: "No se encontraron preguntas para tu búsqueda.",
                    icon: "info",
                    confirmButtonText: "Cerrar"
                });
            } else {
                setDatos(resultados);
                setEstado(true);
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error",
                text: "Hubo un error al buscar preguntas.",
                icon: "error",
                confirmButtonText: "Cerrar"
            });
        }
    };
    const irResolver = (idPregunta, pregunta, materia, nombre, idUsuario) => {
        navigate('/respuestas', { state: { idPregunta, pregunta, materia, nombre, idUsuario } });
    }

    const irPerfilOtroUser = (idUsuario) => {
        navigate('/perfilOtro', { state: { idUsuario } });
    }

    return (
        <>
            {tokenExiste ? (
                <div>
                    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#e3f2fd" }}>
                        <div className="container-fluid">
                            {/* Logo */}
                            <button
                                className="navbar-brand me-auto"
                                onClick={irDashboard}
                                style={{
                                    border: "none",
                                    padding: "0",
                                    background: "none",
                                    cursor: "pointer",
                                    outline: "none",
                                }}
                            >
                                <img src={logo} width="70" height="70" />
                            </button>

                            {/* Barra de Búsqueda */}
                            <form className="d-flex mx-2 me-auto" onSubmit={(e) => e.preventDefault()}>
                                <input className="form-control me-2" type="search" value={textoBuscar} placeholder="Buscar" aria-label="Buscar" onChange={(e) => setTextoBuscar(e.target.value)} />
                                <button className="btn btn-outline-success" onClick={buscarPreguntas}>Buscar</button>
                            </form>

                            {/* Botones de Perfil y Cerrar Sesión */}
                            <div className="d-flex align-items-center">
                                <button className="btn btn-outline-success me-2" onClick={irPerfil}>
                                    {parseJwt(localStorage.getItem("token")).nombre}
                                </button>

                                <button
                                    className="btn btn-outline-success col-auto"
                                    onClick={cerrarSesion}
                                >
                                    Cerrar sesion
                                </button>
                            </div>
                        </div>
                    </nav>

                    {
                        estado ? (
                            <div className="container-fluid align-items-center justify-content-center col-10 mt-5">
                                {datos.map((preguntas, index) => (
                                    <div key={index} className="card mt-4" style={{ border: '1px solid', padding: '15px' }}>
                                        <div className="row">

                                            <div className="col-7">

                                                <p className="mb-0"><strong>Pregunta: </strong> {preguntas.texto}</p>

                                            </div>
                                            <div className="col-auto">
                                                <p className="mb-0"><strong>Materia: </strong> {preguntas.materia}</p>
                                                <p className="mb-0"><strong>Subido por: </strong>
                                                    <a href="/perfilOtro" onClick={() => irPerfilOtroUser(preguntas.id_usuarios)} className="link-underline-primary">
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
                        ) : (
                            <div className="text-center my-5">
                                <h1>¡Haz cualquier pregunta!</h1>
                            </div>
                        )
                    }
                </div>



            ) : null}
        </>
    )
}
