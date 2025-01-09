
import parseJwt from "../components/DesenciptarJWT";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarUser } from "../components/NavbarUser";
import { ButtonBiblioteca } from '../components/ButtonBiblioteca';
import Axios from 'axios';
import { TablaPuntajes } from "../components/TablaPuntajes";

export const BibliotecaDocumentsPage = () => {
    const [tokenExiste, setTokenExiste] = useState(false);
    const navigate = useNavigate("");
    const [documentos, setDocumentos] = useState([]);

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

        //-----------cargar documentos---------
        Axios.get("http://localhost:3001/cargarTodosLosDocumentos").then((response) => {
            setDocumentos(response.data);

        });

    }, [navigate]);

    const irUploadDocument = () => {
        navigate("/uploadDocument")
    }

    //----------aplicar filtros-------------

    const [filtroTipo, setFiltroTipo] = useState("todas");
    const [filtroMateria, setFiltroMateria] = useState("todas");

    const filtrarDocumentos = () => {
        let documentosFiltrados = [...documentos];
        if (filtroTipo !== "todas") {
            documentosFiltrados = documentosFiltrados.filter(doc => doc.tipo_documento === filtroTipo);
        }

        if (filtroMateria !== "todas") {
            documentosFiltrados = documentosFiltrados.filter(doc => doc.materia === filtroMateria);
        }

        return documentosFiltrados;
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
                        <div className="btn-group col-sm-4" role="group" aria-label="Basic outlined example">
                            <select
                                className="form-select form-select-sm"
                                aria-label="Small select example"
                                value={filtroTipo}
                                onChange={(e) => setFiltroTipo(e.target.value)}
                            >
                                <option value="todas">Todo</option>
                                <option value="taller">Taller</option>
                                <option value="examen">Examen</option>
                            </select>

                            <select
                                className="form-select form-select-sm mx-2"
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

                        <button type="button" className="btn btn-outline-primary  ms-auto" onClick={irUploadDocument}>
                            Subir documento
                        </button>

                    </div>

                    <div className="container-fluid mt-3">
                        <div className="row">
                            {/* Contenedor izquierdo */}
                            <div className="col-lg-8 col-md-12">

                                {filtrarDocumentos().map((documento, index) => (
                                    <div key={index} className="container mb-3" style={{ border: '1px solid', padding: '15px' }}>
                                        <div className="row">
                                            <div className="col-1">
                                                <a href={documento.url_archivo} target="_blank" rel="noopener noreferrer">
                                                    <img src="https://cdn-icons-png.flaticon.com/512/81/81040.png" alt="Icono Documento" width="50" />
                                                </a>
                                            </div>
                                            <div className="col">

                                                <p className="mb-0"><strong>Título: </strong> {documento.titulo}</p>
                                                <p className="mb-0"><strong>Materia: </strong> {documento.materia}</p>
                                            </div>
                                            <div className="col">
                                                <p className="mb-0"><strong>Universidad: </strong> {documento.universidad}</p>
                                                <p className="mb-0"><strong>Semestre: </strong> {documento.semestre}</p>
                                            </div>
                                            <div className="col">
                                                <p className="mb-0"><strong>Tipo de documento: </strong> {documento.tipo_documento}</p>
                                                <p className="mb-0"><strong>Subido por: </strong>
                                                    <a href="/perfilOtro" onClick={() => irPerfilOtroUser(documento.id_usuarios)} className="link-underline-primary">
                                                        {documento.nombre}
                                                    </a>

                                                </p>
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
}
