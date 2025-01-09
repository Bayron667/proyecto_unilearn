import React from 'react'
import { useNavigate } from "react-router-dom";


export const ButtonBiblioteca = () => {
    const navigate = useNavigate("");

    const irBibliotecaDocuments =()=>{
        navigate("/documentos")
    }
    const irBibliotecaRecursos =()=>{
        navigate("/recursos")
    }

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center mt-3">

            <div className="btn-group" role="group" aria-label="Basic outlined example">
                <button type="button" className="btn btn-outline-primary" onClick={irBibliotecaDocuments}>
                    Biblioteca de talleres y exámenes
                </button>
                <button type="button" className="btn btn-outline-primary" onClick={irBibliotecaRecursos}>
                    Biblioteca digital de recursos
                </button>
            </div>

        </div>
    )
}
