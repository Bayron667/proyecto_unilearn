import parseJwt from "../components/DesenciptarJWT";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarUser } from "../components/NavbarUser";
import { useForm } from 'react-hook-form';
import { upLoadFileUser } from "../FireBase/config";
import Axios from "axios";
import Swal from "sweetalert2";

export const UploadDocument = () => {
    const [tokenExiste, setTokenExiste] = useState(false);
    const navigate = useNavigate("");
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [documentoSubido, setDocumentoSubido] = useState(false);
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
       Axios.post("http://localhost:3001/createDocument", {
            titulo: data.titulo,
            materia: data.materia,
            universidad: data.universidad,
            semestre: data.semestre,
            url_archivo: Url,
            tipo_documento: data.tipoDocumento,
            id: parseJwt(localStorage.getItem("token")).id

        })
            .then(() => {
                Swal.fire({
                    title: "<strong>Registro exitoso!</strong>",
                    html: "<i>El documento fue subido con exito!</i>",
                    icon: "success",
                    timer: 3000,
                });
                navigate("/documentos");
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
    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {

            try {
                const result = await upLoadFileUser(selectedFile)
                setUrl(result);
                setDocumentoSubido(true);
            } catch (error) {
                Swal.fire({
                    title: "<strong>Error!</strong>",
                    html: "<i>Error al cargar el documento.</i>",
                    icon: "error",
                    timer: 3000,
                });

            }
        } else {
            setDocumentoSubido(false);
        }
    }

    return (
        <>
            {tokenExiste ? (
                <div>
                    <NavbarUser />

                    <div className="container-fluid mt-4">
                        <div className="row justify-content-center">
                            <div className="col-md-5 mx-5 mt-5">
                                <p className="fs-1">Subir documento</p>
                                <p className="fs-4">¡Tu conocimiento es valioso! Comparte tus
                                    talleres, exámenes y materiales de estudio
                                    en UniLearn y contribuye a la comunidad
                                    educativa. Ayuda a tus compañeros a
                                    alcanzar el éxito académico juntos.
                                    Juntos, construimos un camino hacia el
                                    aprendizaje más eficaz y colaborativo.
                                    ¡Anímate a compartir hoy!</p>
                            </div>

                            {/* Contenedor derecho */}
                            <div className="col-md-6 mt-5">
                                <div className="card mx-5" style={{ maxWidth: '500px' }}>
                                    <div className="card-header text-center">
                                        <label htmlFor="file-upload" className="btn btn-primary me-2">
                                            Subir documento
                                        </label>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            className="form-control"
                                            onChange={handleFileChange}
                                            accept=".pdf, .docx"
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                    <div className="card-body text-center">
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text" id="basic-addon1">Título</span>
                                                    <input {...register('titulo', { required: true })} type="text" className="form-control" id="titulo" />
                                                </div>
                                                {errors.titulo && <span className="text-danger">Este campo es requerido</span>}
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

                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text" id="basic-addon1">Universidad</span>
                                                    <input {...register('universidad', { required: true })} type="text" className="form-control" id="universidad" />
                                                </div>
                                                {errors.universidad && <span className="text-danger">Este campo es requerido</span>}
                                            </div>

                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text" id="basic-addon1">Semestre</span>
                                                    <input {...register('semestre', { required: true })} type="number" className="form-control" id="semestre" />
                                                </div>
                                                {errors.semestre && <span className="text-danger">Este campo es requerido</span>}
                                            </div>

                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <label className="input-group-text" htmlFor="inputGroupSelect01">
                                                        Tipo de Documento
                                                    </label>
                                                    <select
                                                        {...register('tipoDocumento')}
                                                        className="form-select"
                                                        id="tipoDocumento"
                                                    >
                                                        <option value="taller">Taller</option>
                                                        <option value="examen">Examen</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <button type="submit" className="btn btn-primary" disabled={!documentoSubido}>Cargar Datos</button>
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
