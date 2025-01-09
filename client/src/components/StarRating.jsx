import React, { useState } from 'react';
import './StarRating.css';
import Swal from "sweetalert2";
import Axios from 'axios';
import parseJwt from "../components/DesenciptarJWT";

const StarRating = ({ idCalificado }) => {
    const [rating, setRating] = useState(0);

    const handleStarClick = (value) => {
        setRating(value);
        Axios.post("http://localhost:3001/createCalificacion", {
            id: parseJwt(localStorage.getItem("token")).id,
            idCalificado: idCalificado,
            puntuacion: value

        }).then(() => {
            Swal.fire({
                title: "<strong>Registro exitoso!</strong>",
                html: "<i>La Calificacion fue enviada correctamente!</i>",
                icon: "success",
                timer: 3000,
            });
        }).catch((error) => {
            if (error) {
                Swal.fire({
                    title: "<strong>Error!</strong>",
                    html: "<i>ocurrio un error al enviar la calificacion</i>",
                    icon: "error",
                    timer: 3000,
                });
            }
        });

    };

    return (
        <>
            <form id="form">
                <p className="clasificacion">
                    {[...Array(5)].map((_, index) => (
                        <React.Fragment key={index}>
                            <input
                                type="radio"
                                id={`radio${index + 1}`}
                                name="estrellas"
                                value={5 - index}
                                checked={5 - index === rating}
                                onChange={() => handleStarClick(5 - index)}
                            />
                            <label htmlFor={`radio${index + 1}`}>★</label>
                        </React.Fragment>
                    ))}
                </p>
            </form>
        </>


    );
};

export default StarRating;



