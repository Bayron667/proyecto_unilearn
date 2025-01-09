import React, { useState, useEffect } from 'react';
import Axios from "axios";
import Swal from "sweetalert2";

const PreguntaRespuestaCard = ({ id }) => {
    const [editModes, setEditModes] = useState([]);
    const [respuestas, setRespuestas] = useState([]);
    const [respuestasEditadas, setRespuestasEditadas] = useState([]);


    useEffect(() => {
        Axios.get(`http://localhost:3001/cargarRespuestasUsuario/${id}`)
            .then((response) => {
                setRespuestas(response.data);
                setEditModes(Array(response.data.length).fill(false));
                setRespuestasEditadas(response.data.map(respuestas => respuestas.respuesta));
            })
            .catch((error) => {
                Swal.fire({
                    title: "<strong>Error!</strong>",
                    html: "<i>Error al obtener las respuestas.</i>",
                    icon: "error",
                    timer: 3000,
                });
            });
    }, [id]);

    const handleEditClick = (index) => {
        const newEditModes = [...editModes];
        newEditModes[index] = true;
        setEditModes(newEditModes);

    }

    const handleSaveClick = (index, idPregunta) => {
        const newEditModes = [...editModes];
        newEditModes[index] = false;
        setEditModes(newEditModes);

        const texto = respuestasEditadas[index];

        Axios.put("http://localhost:3001/updateRespuestas", {
            texto: texto,
            id: idPregunta
        }).then(() => {
            Swal.fire({
                title: "<strong>Actualización exitosa!</strong>",
                html: "<i>La respuesta fue actualizada correctamente</i>",
                icon: "success",
                timer: 3000,
            });
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }).catch(error => {
            console.error("Error al enviar la respuesta", error);
            Swal.fire({
                title: "<strong>Error</strong>",
                html: "<i>Error al enviar la respuesta a la base de datos.</i>",
                icon: "error",
                timer: 3000,
            });
        });
    }

    const handleDeleteClick = (index, idPregunta) => {

        Swal.fire({
            title: '¿Confirmar eliminar?',
            html: "<i>¿Desea Eliminar la pregunta?</i>",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo!'
        }).then((result) => {
            if (result.isConfirmed) {
                Axios.delete(`http://localhost:3001/deleterespuesta/${idPregunta}`).then(() => {
                    Swal.fire(
                        'Eliminado!',
                        'la pregunta fue eliminada',
                        'success'
                    );
                });
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }

        });
    }

    return (
        <>
            {respuestas.map((respuesta, index) => (

                <div key={index} className="mb-2">
                    <div className="card">
                        <div className="card-body">
                        <p className="card-text"><strong>Pregunta:</strong> {respuesta.pregunta}</p>    
                            <div className="d-flex justify-content-end align-items-center">
                                <span className="text-body-secondary card-text me-5"><strong>Materia:</strong> {respuesta.materia} </span>
                                <span className="text-body-secondary card-text "><strong>Hecha por:</strong> {respuesta.nombre}</span>
                            </div>
                            

                        </div>

                    </div>
                    <div className="card mt-2 col-11 ms-auto">
                        <div className="card-body">
                            <h5 className="card-title">Respuesta:</h5>
                            {editModes[index] ? (
                                <>
                                    <textarea
                                        className="form-control mb-2"
                                        rows="3"
                                        value={respuestasEditadas[index]}
                                        onChange={(e) => {
                                            const newRespuestasEditadas = [...respuestasEditadas];
                                            newRespuestasEditadas[index] = e.target.value;
                                            setRespuestasEditadas(newRespuestasEditadas);
                                        }}
                                    />
                                </>
                            ) : (
                                <>
                                    <p className="card-text"><strong>Respuesta:</strong> {respuesta.respuesta}</p>
                                </>
                            )}
                            <div className="d-flex justify-content-end align-items-center">
                                <button className="btn btn-danger me-2" onClick={() => handleDeleteClick(index, respuesta.id_respuesta)}>Eliminar</button>
                                {editModes[index] ? (
                                    <button className="btn btn-success" onClick={() => handleSaveClick(index, respuesta.id_respuesta)}>Guardar</button>
                                ) : (
                                    <button className="btn btn-primary" onClick={() => handleEditClick(index)} disabled={editModes.some(mode => mode)}>Modificar</button>
                                )}
                            </div>

                        </div>

                    </div>
                </div>
            ))}
        </>
    );
};


export default PreguntaRespuestaCard;
