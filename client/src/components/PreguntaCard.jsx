import React, { useState, useEffect } from 'react';
import Axios from "axios";
import Swal from "sweetalert2";

const PreguntaCard = ({ id }) => {
    const [editModes, setEditModes] = useState([]);
    const [preguntas, setPreguntas] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [preguntasEditadas, setPreguntasEditadas] = useState([]);


    useEffect(() => {
        Axios.get(`http://localhost:3001/cargarPreguntasUsuario/${id}`)
            .then((response) => {
                setPreguntas(response.data);
                setEditModes(Array(response.data.length).fill(false));
                setMaterias(response.data.map(pregunta => pregunta.materia));
                setPreguntasEditadas(response.data.map(pregunta => pregunta.texto));

            })
            .catch((error) => {
                Swal.fire({
                    title: "<strong>Error!</strong>",
                    html: "<i>Error al obtener las preguntas.</i>",
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

        const texto = preguntasEditadas[index];
        const materia = materias[index];

        Axios.put("http://localhost:3001/updatePregunta", {
            texto: texto,
            materia: materia,
            id: idPregunta
        }).then(() => {
            Swal.fire({
                title: "<strong>Actualización exitosa!</strong>",
                html: "<i>La pregunta fue actualizada correctamente</i>",
                icon: "success",
                timer: 3000,
            });
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }).catch(error => {
            console.error("Error al enviar la pregunta", error);
            Swal.fire({
                title: "<strong>Error</strong>",
                html: "<i>Error al enviar la pregunta a la base de datos.</i>",
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
                Axios.delete(`http://localhost:3001/deletePregunta/${idPregunta}`).then(() => {
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
            {preguntas.map((pregunta, index) => (
                <div key={index} className="card mb-2">
                    <div className="card-body">
                        {editModes[index] ? (
                            <>
                                <textarea
                                    className="form-control mb-2"
                                    rows="3"
                                    value={preguntasEditadas[index]}
                                    onChange={(e) => {
                                        const newPreguntasEditadas = [...preguntasEditadas];
                                        newPreguntasEditadas[index] = e.target.value;
                                        setPreguntasEditadas(newPreguntasEditadas);
                                    }}
                                />
                                <select
                                    className="form-select mb-2"
                                    value={materias[index]}
                                    onChange={(e) => {
                                        const newMaterias = [...materias];
                                        newMaterias[index] = e.target.value;
                                        setMaterias(newMaterias);
                                    }}
                                >
                                    <option value="matematica">Matemáticas</option>
                                    <option value="calculo">Cálculo</option>
                                    <option value="fisica">Física</option>
                                    <option value="algebra lineal">Algebra lineal</option>
                                    <option value="probabilidad">Probabilidad</option>
                                    <option value="estadistica">Estadística</option>
                                </select>
                            </>
                        ) : (
                            <>
                                <h5 className="card-title">{pregunta.texto}</h5>
                                <p className="mb-0"><strong>Materia:</strong> {materias[index]}</p>
                            </>
                        )}
                        <div className="d-flex justify-content-end align-items-center">
                            <button className="btn btn-danger me-2" onClick={() => handleDeleteClick(index, pregunta.id_pregunta)}>Eliminar</button>
                            {editModes[index] ? (
                                <button className="btn btn-success" onClick={() => handleSaveClick(index, pregunta.id_pregunta)}>Guardar</button>
                            ) : (
                                <button className="btn btn-primary" onClick={() => handleEditClick(index)} disabled={editModes.some(mode => mode)}>Modificar</button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default PreguntaCard;
