import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'bootstrap';

const CarouselComponent = () => {
    useEffect(() => {
        const carouselElement = document.getElementById('myCarousel');
        const carousel = new Carousel(carouselElement, {
            interval: 3000, // Cambia de diapositiva cada 3 segundos
            wrap: true // Permite el rebobinado automático
        });

        return () => {
            carousel.dispose(); // Limpia el carrusel al desmontar el componente
        };
    }, []);

    return (
        <div id="myCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner mt-3">
                <div className="carousel-item active" >

                    <div className="card mb-3 mx-5" style={{ backgroundColor: "#5c6ba1 " }}>
                        <div className="row g-0">
                            <div className="col-md-8"   >
                                <div className="card-body mx-4" >
                                    <h5 className="fs-1 card-title">Objetivo del Proyecto</h5>
                                    <p className="fs-4 card-text">
                                        Nuestro objetivo es crear una plataforma donde los usuarios puedan hacer preguntas sobre una amplia variedad de temas y recibir
                                        respuestas de la comunidad. Queremos fomentar el aprendizaje colaborativo y el intercambio de conocimientos.
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <img src="https://1.bp.blogspot.com/-Bh7sJTEn-t4/XtmZrGHj_OI/AAAAAAAAdUA/01abAFtpMGMxZFqw4EiAzK43DPBVBjL6gCLcBGAsYHQ/s1600/fundamprog003.png" className="img-fluid rounded-start" alt="..." />
                            </div>

                        </div>
                    </div>
                </div>
                <div className="carousel-item">
                    <div className="card mb-3 mx-5" style={{ backgroundColor: "#3ca4f4" }}>
                        <div className="row g-0">
                            <div className="col-md-8">
                                <div className="card-body mx-4">
                                    <h5 className="fs-1 card-title">Características Clave</h5>
                                    <p className="fs-4 card-text">
                                        <li>Realiza preguntas sobre cualquier tema.</li>
                                        <li>Obtén respuestas de otros usuarios calificados.</li>
                                        <li>Califica y comenta las respuestas para ayudar a otros usuarios.</li>
                                        <li>Conoce a otros usuarios y visita sus perfiles.</li>
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <img src="https://image.jimcdn.com/app/cms/image/transf/dimension=970x10000:format=gif/path/sa16dc2497d80e05e/image/icd162bb94ffa0064/version/1551588419/image.gif" className="img-fluid rounded-start" alt="..." />
                            </div>

                        </div>
                    </div>
                </div>
                <div className="carousel-item">
                    <div className="card mb-3 mx-5" style={{ backgroundColor: " #6cdce3 " }}>
                        <div className="row g-0">
                            <div className="col-md-8">
                                <div className="card-body mx-4">
                                    <h5 className="fs-1 card-title">Nuestro Propósito</h5>
                                    <p className="fs-4 card-text">
                                        Queremos crear una comunidad en línea donde las personas puedan encontrar
                                        respuestas confiables a sus preguntas y compartir su conocimiento con otros.
                                        Creemos en el poder del aprendizaje colaborativo y en la construcción de una red de conocimiento.

                                    </p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <img src="https://santanderpost.com.ar/wp-content/uploads/2022/11/Educacion-Tecnologia.jpg" className="img-fluid rounded-start" alt="..." />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
}

export default CarouselComponent;
