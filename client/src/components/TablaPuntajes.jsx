import React, { useState, useEffect } from 'react';
import Axios from "axios";
import Swal from "sweetalert2";

export const TablaPuntajes = () => {
    const [calificaciones, setCalificaciones] = useState([]);
    const [calificacionesOrdenadas, setCalificacionesOrdenadas] = useState([]);

    useEffect(() => {
        Axios.get(`http://localhost:3001/cargarCalificaciones`)
            .then((response) => {
                const calificacionesData = response.data;
                const calificacionesOrdenadas = [...calificacionesData].sort((a, b) => b.promedio_calificaciones - a.promedio_calificaciones);
                setCalificaciones(calificacionesData);
                setCalificacionesOrdenadas(calificacionesOrdenadas);

            })
            .catch((error) => {
                Swal.fire({
                    title: "<strong>Error!</strong>",
                    html: "<i>Error al obtener las calificaciones.</i>",
                    icon: "error",
                    timer: 3000,
                });
            });
    }, []);

    return (
        <div className="card ">
            <div className="card-header">Mejores usuarios</div>
            <div className="card-body">
                <table className="table table-hover text-center">
                    <thead>
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Puntuacion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            calificacionesOrdenadas.map((val, key) => (

                                <tr key={key}>
                                    <td>{val.nombre_usuario_calificado}</td>
                                    <td>{val.promedio_calificaciones}</td>
                                </tr>

                            ))
                        }
                    </tbody>

                </table>
            </div>
        </div>
    )
}
