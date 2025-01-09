import React, { useState, useEffect } from 'react';
import './StarRating.css';
import Swal from "sweetalert2";
import Axios from 'axios';
import parseJwt from "../components/DesenciptarJWT";


export const MostrarStarRating = ({ id }) => {
    const [calificacion, setCalificacion] = useState(0);

    useEffect(() => {
        // Aquí puedes hacer una llamada a una API o una función para obtener la calificación
        // Por ejemplo, puedes simular una llamada a una API con un setTimeout
        setTimeout(() => {

            Axios.get(`http://localhost:3001/cargarPuntuacion/${id}`)
                .then((response) => {
                    const userData = response.data[0]; // Suponiendo que la consulta devuelve un solo usuario
                    setCalificacion(userData.promedio_calificacion);
                })
                .catch((error) => {
                    Swal.fire({
                        title: "<strong>Error!</strong>",
                        html: "<i>Error al obtener la puntuacion del usuario.</i>",
                        icon: "error",
                        timer: 3000,
                    });
                });

        }, 1000); // Simulando una demora de 1 segundo
    }, []);

    return (
        <form id="form">
            <p className="clasificacion">
                {[...Array(5)].map((_, index) => (
                    <React.Fragment key={index}>
                        <input
                            type="radio"
                            id={`radio${index + 1}`}
                            name="estrellas"
                            value={5 - index}
                            checked={5 - index === calificacion}
                            readOnly // Deshabilita la interactividad del input
                        />
                        <label htmlFor={`radio${index + 1}`}>★</label>
                    </React.Fragment>
                ))}
            </p>
            <p>Calificación: {calificacion}</p>
        </form>
    );
}
