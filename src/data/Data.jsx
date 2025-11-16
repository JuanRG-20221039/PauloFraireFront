import logo1 from "../assets/logo.png";
import logo2 from "../assets/logo2.png";
import logo4 from "../assets/logo4.png";
import logo5 from "../assets/logo5.png";
import logo6 from "../assets/logo6.png";
import logosep from "../assets/logosep.png";
import logousi from "../assets/logousi.png";
import logosev from "../assets/logosev.png";

import hero from "../assets/hero.png";

import photo1 from "../assets/img/photo1.jpg";
import photo2 from "../assets/img/photo2.jpg";
import photo3 from "../assets/img/photo3.jpg";
import photo4 from "../assets/img/photo4.jpg";
import photo5 from "../assets/img/photo5.jpg";
import photo6 from "../assets/img/photo6.jpg";
import photo7 from "../assets/img/photo7.jpg";

import img1 from "../assets/img/img1.jpeg";
import img2 from "../assets/img/img2.jpeg";
import img3 from "../assets/img/img3.jpeg";
import img4 from "../assets/img/img4.jpeg";
import img5 from "../assets/img/img5.jpeg";
import img6 from "../assets/img/img6.jpeg";
import img7 from "../assets/img/img7.jpeg";
import img8 from "../assets/img/img8.jpeg";
import img9 from "../assets/img/img9.jpeg";
import img10 from "../assets/img/img10.jpeg";
import img11 from "../assets/img/img11.jpeg";
import img12 from "../assets/img/img12.jpeg";
import img13 from "../assets/img/img13.jpeg";

import img17 from "../assets/img/img17.jpeg";
import img18 from "../assets/img/img18.jpeg";
import img23 from "../assets/img/img23.jpeg";


import pdfFichaMaestria from "../assets/pdf/FICHA DE INSCRIPCION MAESTRÍA OK.pdf";

import pdfFichaDoctorado from "../assets/pdf/FICHA DE INSCRIPCION DOCTORADO_OK.pdf";

import pdfFichaMaestriaAmbiental from "../assets/pdf/FICHA DE INSCRIPCION MAESTRÍA EDUCACIÓN AMBIENTAL.pdf";
import pdfCartaMaestriaAmbiental from "../assets/pdf/CARTA COMPROMISO MAESTRÍA EDUCACIÓN AMBIENTAL.pdf";
import pdfPlanEstudios from "../assets/pdf/PLAN DE ESTUDIOS, INSCRIPCIONES Y REQUISITOS.pdf";

import pdfCartaCompromisoD from "../assets/pdf/CARTA COMPROMISO DOCTORADO_OK.pdf";
// import pdfCartaCompromisoMEA from "../assets/pdf/CARTA COMPROMISO MAESTRÍA EDUCACIÓN AMBIENTAL.pdf";
import pdfCartaCompromisoMT from "../assets/pdf/CARTA COMPROMISO MAESTRÍA OK.pdf";

export const logos = [logo1, logo2, logo4, logo5, logo6, logosep, logousi, logosev];

export const imgGalery = [
    {
        id: 6,
        img: img6,
        tittle: "Título de la imagen",
        description: "Descripción de la imagen",
    },
    {
        id: 7,
        img: img7,
        tittle: "Título de la imagen",
        description: "Descripción de la imagen",
    },
    {
        id: 8,
        img: img8,
        tittle: "Título de la imagen",
        description: "Descripción de la imagen",
    },
    {
        id: 9,
        img: img9,
        tittle: "Título de la imagen",
        description: "Descripción de la imagen",
    },
    {
        id: 13,
        img: img13,
        tittle: "Título de la imagen",
        description: "Descripción de la imagen",
    },
];

export const navLinks = [
    {
        id: 1,
        link: "Inicio",
        path: "/",
    },
    {
        id: 2,
        link: "Organización",
        path: "/organization",
    },
    {
        id: 3,
        link: "Oferta Educativa",
        path: "/educational-offer",
    },
    {
        id: 4,
        link: "Convocatorias",
        path: "/calls",
    },
    {
        id: 5,
        link: "Actividades Académicas",
        path: "/academy-activities",
    },
    {
        id: 6,
        link: "Análisis educativo contemporáneo",
        path: "/contexto-contemporaneo"
    },    
    {
        id: 7,
        link: "Iniciar Sesión",
        path: "/login"
    },
];

//autoridadeS

export const authorities = [
    {
        id: 1,
        name: "DR. Reynaldo",
        lastName: "Ceballos Hernández",
        position: "DIRECTOR ACADÉMICO DEL CRESPF",
        photo: photo1,
    },
    {
        id: 2,
        name: "DR. Marcelo",
        lastName: "Ramírez Ramírez",
        position: "RECTOR DEL CRESPF",
        photo: photo2,
    },
    {
        id: 3,
        name: "DR. Juan",
        lastName: "Martínez María",
        position: "VICERRECTOR DEL CRESPF",
        photo: photo3,
    },
    {
        id: 4,
        name: "DRA. Oliva Guadalupe",
        lastName: "Ceballos Alpuche",
        position: "DIRECTORA DE EDUCACIÓN EN LÍNEA Y COMUNICACIÓN EDUCATIVA",
        photo: photo4,
    },
    {
        id: 5,
        name: "MTRA. Saira del Carmen",
        lastName: "Rodríguez Galicia",
        position: "DIRECTORA DE PLANEACIÓN Y GESTIÓN INSTITUCIONAL",
        photo: photo5,
    },
    {
        id: 6,
        name: "L.A.E. Gustavo Alejandro",
        lastName: "Arriaga Suárez",
        position: "REPRESENTANTE LEGAL Y DIRECTOR DE FINANZAS",
        photo: photo6,
    },
    {
        id: 7,
        name: "DR. Santiago",
        lastName: "Chávez Cruz",
        position: "DIRECTOR DE SERVICIOS ESCOLARES Y ADMINISTRACIÓN",
        photo: photo7,
    },
];

export const contactInfo = [
    {
        location: "HUEJUTLA",
        personal: [
            { name: "Dr. ECDP: Camilo Arriaga Martínez", phone: "771 152 90 10" },
        ],
    },
    {
        location: "ALAMO, VER.",
        personal: [
            { name: "Dra. ECDP: Nélida Vázquez Luna", phone: "765 123 5646" },
        ],
    },
    {
        location: "TANTOYUCA NORTE",
        personal: [{ name: "Dr.ECDP Alfonso Zenteno Cabrales", phone: "789 891 7562" }],
    },
    {
        location: "TANTOYUCA SUR",
        personal: [
            { name: "Dr. ECDP: Francisco G. Ponce del Ángel", phone: "789 107 88 04" },
        ],
    },
    {
        location: "YATIPAN HGO.",
        personal: [
            { name: "Dr. ECDP: Víctor Hernández Villegas", phone: "771 103 56 49" },
        ],
    },
    {
        location: "TUXPAN, VER.",
        personal: [
            { name: "Dr. ECDP: Yoshimar Martínez Pando", phone: "765 102 1675" },
        ],
    },
    {
        location: "POZA RICA",
        personal: [
            { name: "Dr. ECDP: Víctor Guadalupe Ramírez Azuara", phone: "782 116 71 83" },
        ],
    },
    {
        location: "PLATON SÁNCHEZ, VER.",
        personal: [
            { name: "Dr. ECDP: Ezequiel Ventura Frías", phone: "789 105 84 48" },
        ],
    },
    {
        location: "XILITLA S.L.P.",
        personal: [
            { name: "Dr. ECDP: Gabriel Presfítero Rodríguez Hdez.", phone: "789 898 52 09" },
        ],
    },
    {
        location: "COATZINTLA, VER.",
        personal: [
            { name: "Dr. ECDP: Ernesto Barra Viznado", phone: "782 819 50 98" },
        ],
    },
];

export const maestrias = [
    {
        name: "Maestría en Tecnologías Aplicadas a la Educación",
        description: "La Maestría en Tecnologías Aplicadas a la Educación (MTAE) es un programa de posgrado que se imparte en la modalidad en línea, que tiene como propósito formar profesionales de la educación con un alto nivel de competencias en el uso de las tecnologías de la información y la comunicación (TIC) para la innovación educativa.",
        photo: img6,
        state: true,
        ficha: pdfFichaMaestria,
        carta: pdfCartaCompromisoMT,
        plan: pdfPlanEstudios
    },
    {
        name: "Doctorado en Educación y Cultura Digital Pedagógica",
        description: "El Doctorado en Educación y Cultura Digital Pedagógica (DECDP) es un programa de posgrado que se imparte en la modalidad en línea, que tiene como propósito formar investigadores de alto nivel con capacidad para generar conocimiento y desarrollar proyectos de investigación en el campo de la educación y la cultura digital pedagógica.",
        photo: img13,
        state: false,
        ficha: pdfFichaDoctorado,
        carta: pdfCartaCompromisoD,
        plan: pdfPlanEstudios
    },
    {
        name: "Maestría en Educación Ambiental",
        description: "La Maestría en Educación Ambiental (MEA) es un programa de posgrado que se imparte en la modalidad en línea, que tiene como propósito formar profesionales de la educación con un alto nivel de competencias en el campo de la educación ambiental.",
        photo: img7,
        state: true,
        ficha: pdfFichaMaestriaAmbiental,
        carta: pdfCartaMaestriaAmbiental,
        plan: pdfPlanEstudios
    }
]

export const news = [
    {
        id: 1,
        titulo: 'Doctorado Honoris Causa Mtro. Marcelo Ramírez Ramírez',
        descripcion: 'El otorgamiento del “Doctorado Honoris Causa” en Educación al maestro Marcelo Ramírez Ramírez, acto de gran importancia en el ámbito de la educación, la cultura y la política a quien ya es un profesional reconocido por su trayectoria académica y social.',
        img: photo2,
        date: "Sábado 08 de diciembre del 2018",
        path: "/noticia-mtro-marcelo",
    },
    {
        id: 2,
        titulo: "Doctorado Honoris Causa del Mtro. Reynaldo Ceballos Hernández",
        descripcion: 'El pasado martes 28 de marzo del año 2023; en las instalaciones del Centro Regional de Estudios Superiores Paulo Freire, A.C. con sede en la cabecera municipal Dr. Rafael Lucio, Ver, se entregó al maestro Reynaldo Ceballos Hernández el Doctorado Honoris Causa en Educación y Cultura Digital Pedagógica.',
        img: hero,
        date: "28 de marzo del año 2023",
        path: "/noticia-mtro-reynaldo",
    },
    {
        id: 3,
        titulo: "Doctorado Honoris Causa del Mtro. Juan Martínez María ",
        descripcion: 'El pasado sábado 05 de agosto del año 2023; en las instalaciones del Centro Regional de Estudios Superiores Paulo Freire, A.C. con sede en la cabecera municipal Dr. Rafael Lucio, Ver, se entregó al maestro Juan Martínez María el Doctorado Honoris Causa en Gestión Escolar',
        img: img17,
        date: "Sábado 05 de agosto del año 2023",
        path: "/noticia-mtro-juan",
    }, {
        id: 4,
        titulo: "Reuniones de colaboración",
        descripcion: "El dia 9 de febrero el CRESPF se llevó a cabo una reunión con los funcionarios de la Coordinación de Actualización Magisterial donde se lograron varios acuerdos de cooperación academica con los. Diplomados, de este trabajo se tiene el compromiso de insertar dentro de cada curso, taller o Diplomado criterios de la Estrategia Nacional de Formación Continua así como perfiles de la NEM.  Lo anterior será un aporte de nuestra institución para fortalecer  la política educativa nacional.",
        img: img23,
        date: "9 de febrero 2024",
        path: "/noticia-reunion",
    }

]