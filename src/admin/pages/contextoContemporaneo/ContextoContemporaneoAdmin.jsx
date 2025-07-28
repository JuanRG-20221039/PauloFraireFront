import React, { useState, useEffect } from 'react';
import clientAxios from '../../../config/clientAxios';
import useAuth from '../../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Spinner from '../../../components/Spinner';

export default function ContextoContemporaneoAdmin() {
  const { token } = useAuth();
  const [pdfList, setPdfList] = useState([]);
  const [contextos, setContextos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    mainSection: '',
    author: '',
    article: '',
    articleDescription: '',
    mainLinkAutor: '',
    mainLink: '',
    secondaryLinks: [{ name: '', url: '' }]
  });

  const [pdfData, setPdfData] = useState({
    pdfs: [{ nombre: '', descripcion:'', archivo: null, tipo: 0 }],
    Ppdfs: [{ nombre: '', descripcion:'', archivo: null, imagen: null, tipo: 1 }]
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchContextos();
  }, []);

  const fetchContextos = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };
      const response = await clientAxios.get('/contexto-contemporaneo', config);
      const contextosData = Array.isArray(response.data) ? response.data : [];
      setContextos(contextosData);

      if (contextosData.length > 0) {
        const firstContext = contextosData[0];
        setFormData({
          title: firstContext.title || '',
          mainSection: firstContext.mainSection || '',
          author: firstContext.author || '',
          article: firstContext.article || '',
          articleDescription: firstContext.articleDescription || '',
          mainLinkAutor: firstContext.mainLinkAutor || '',
          mainLink: firstContext.mainLink || '',
          secondaryLinks: firstContext.secondaryLinks?.length
            ? firstContext.secondaryLinks
            : [{ name: '', url: '' }]
        });
        setEditingId(firstContext._id);
      }
    } catch (error) {
      console.error('Error fetching contextos:', error);
      toast.error('Error al cargar los contextos');
      setContextos([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para verificar el tamaño del archivo PDF
  const checkPdfFileSize = (file) => {
    if (!file) return true;
    
    const maxSize = 10 * 1024 * 1024; // 10MB en bytes
    if (file.size > maxSize) {
      // Convertir bytes a MB para mostrar en el mensaje
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      toast.error(`El archivo PDF excede el tamaño máximo permitido: ${fileSizeMB}MB / 10MB`);
      return false;
    }
    return true;
  };

  const handleArrayInputChange = (index, field, value) => {
    if (field === 'secondaryLinks') {
      setFormData(prev => {
        const newArray = [...prev[field]];
        newArray[index] = value;
        return {
          ...prev,
          [field]: newArray
        };
      });
    } else if (field === 'pdfs' || field === 'Ppdfs') {
      // Verificar el tamaño del archivo PDF si se está cambiando el archivo
      if (value.archivo instanceof File) {
        if (!checkPdfFileSize(value.archivo)) {
          return; // No actualizar el estado si el archivo es demasiado grande
        }
      }
      
      setPdfData(prev => {
        const newArray = [...prev[field]];
        newArray[index] = { ...newArray[index], ...value };
        return {
          ...prev,
          [field]: newArray
        };
      });
    }
  };

  const addArrayField = (field) => {
    if (field === 'secondaryLinks') {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], { name: '', url: '' }]
      }));
    } else if (field === 'pdfs') {
      setPdfData(prev => ({
        ...prev,
        [field]: [...prev[field], { nombre: '', descripcion:'', archivo: null, tipo: 0 }]
      }));
    } else if (field === 'Ppdfs') {
      setPdfData(prev => ({
        ...prev,
        [field]: [...prev[field], { nombre: '', descripcion:'', archivo: null, imagen: null, tipo: 1 }]
      }));
    }
  };

  const removeArrayField = (field, index) => {
    if (field === 'secondaryLinks') {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    } else {
      setPdfData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const fetchPdfs = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await clientAxios.get('/pdfs-cc', config);
      setPdfList(response.data);
    } catch (error) {
      console.error("Error fetching PDFs:", error);
      toast.error("Error al cargar los PDFs");
    }
  };
  
  const handleDeletePdf = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await clientAxios.delete(`/pdfs-cc/${id}`, config);
      toast.success("PDF eliminado exitosamente");
      fetchPdfs();
    } catch (error) {
      console.error("Error deleting PDF:", error);
      toast.error("Error al eliminar el PDF");
    }
  };
  
  useEffect(() => {
    fetchPdfs();
  }, []);

  const handleContextSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const contextConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };
      let contextResponse;
      if (editingId) {
        contextResponse = await clientAxios.put(
          `/contexto-contemporaneo/${editingId}`,
          formData,
          contextConfig
        );
      } else {
        contextResponse = await clientAxios.post(
          '/contexto-contemporaneo',
          formData,
          contextConfig
        );
      }
      toast.success(editingId ? 'Contenido actualizado exitosamente' : 'Contenido creado exitosamente');
      await fetchContextos();
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.msg ||
        error.message ||
        'Error desconocido al procesar la solicitud';

      toast.error(`Error al ${editingId ? 'actualizar' : 'crear'} el contenido: ${errorMessage}`);
      console.error("Error al enviar contexto:", error); // DEBUG
    } finally {
      setLoading(false);
    }
  };

  const handlePdfSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Función para validar que los campos requeridos estén presentes
      const validatePdfFields = (pdf) => {
        if (!pdf.nombre?.trim()) throw new Error('El nombre del PDF es requerido');
        if (!pdf.descripcion) throw new Error('La descripcion del PDF es requerido');
        if (!pdf.archivo) throw new Error('El archivo PDF es requerido');
        if (pdf.tipo === undefined) throw new Error('El tipo de PDF es requerido');
      };

      // Función para validar que el archivo sea un PDF válido y no exceda el tamaño máximo
      const validatePdfFile = (file) => {
        if (!file) return true;
        if (file.type !== 'application/pdf') {
          throw new Error('El archivo debe ser un PDF');
        }
        // Usar la misma función de verificación de tamaño que se usa en la interfaz
        if (!checkPdfFileSize(file)) {
          throw new Error(`El archivo PDF excede el tamaño máximo permitido de 10MB`);
        }
        return true;
      };

      // Función para subir los PDFs
      const uploadPdfs = async (pdfs, isPremium = false) => {
        for (const pdf of pdfs) {

          if (!pdf.nombre?.trim() || !pdf.archivo) {
            continue;
          }

          try {
            validatePdfFields(pdf);
            validatePdfFile(pdf.archivo);

            const formData = new FormData();
            formData.append('nombre', pdf.nombre.trim());
            formData.append('descripcion', pdf.descripcion);
            formData.append('archivo', pdf.archivo);
            formData.append('tipo', isPremium ? '1' : '0');

            if (isPremium && pdf.imagen instanceof File) {
              if (!pdf.imagen.type.startsWith('image/')) {
                throw new Error('El archivo de imagen debe ser una imagen válida');
              }
              formData.append('imagen', pdf.imagen);
            }

            for (let pair of formData.entries()) {
            }

            const pdfConfig = {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
            };

            const response = await clientAxios.post('/pdfs-cc', formData, pdfConfig);
          } catch (error) {
            console.error('PDF upload failed:', error.response?.data || error.message);
            throw error;
          }
        }
      };

      await uploadPdfs(pdfData.pdfs.filter(pdf => pdf.nombre && pdf.archivo));
      await uploadPdfs(pdfData.Ppdfs.filter(pdf => pdf.nombre && pdf.archivo), true);

      toast.success('PDFs subidos exitosamente');

      // Reiniciar el estado de los PDFs después de una subida exitosa
      setPdfData({
        pdfs: [{ nombre: '', descripcion:'', archivo: null, tipo: 0 }],
        Ppdfs: [{ nombre: '', descripcion:'', archivo: null, imagen: null, tipo: 1 }],
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        error.message ||
        'Error desconocido al procesar la solicitud';

      toast.error(`Error al subir los PDFs: ${errorMessage}`);
      console.error("Error al subir PDFs:", error); // DEBUG
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container p-4 -ml-1 bg-gray-50 mt-5">
      <h2 className="text-center text-3xl font-bold text-slate-600">
        Análisis Educativo Contemporáneo
      </h2>

      <form onSubmit={handleContextSubmit} className="mb-8 space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label className="block mb-2 text-xl font-medium text-gray-700">Título:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-xl font-medium text-gray-700">Sección Principal:</label>
          <input
            type="text"
            name="mainSection"
            value={formData.mainSection}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-xl font-medium text-gray-700">Autor:</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="p-6 rounded-lg bg-gradient-to-tr from-green-300 to-red-300 via-yellow-300 shadow-lg w-full h-34">
          <label className="block mb-2 text-xl font-medium text-gray-700">Título del Artículo:</label>
          <input
            name="article"
            value={formData.article}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <label className="block mb-2 text-xl font-medium text-gray-700 mt-5">Descripción del Artículo:</label>
          <input
            type="text"
            name="articleDescription"
            value={formData.articleDescription}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <label className="block mb-2 text-xl font-medium text-gray-700 mt-5">Créditos para el Autor:</label>
          <input
            type="text"
            name="mainLinkAutor"
            value={formData.mainLinkAutor}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <label className="block mb-2 text-xl font-medium text-gray-700 mt-5">Enlace Principal:</label>
          <input
            type="url"
            name="mainLink"
            value={formData.mainLink}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="bg-gray-300 p-4 rounded-lg shadow-lg">
          <label className="block mb-2 text-xl font-medium text-gray-700">Enlaces Secundarios:</label>
          {formData.secondaryLinks.map((link, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Nombre del enlace"
                value={link.name}
                onChange={(e) =>
                  handleArrayInputChange(index, 'secondaryLinks', {
                    ...formData.secondaryLinks[index],
                    name: e.target.value
                  })
                }
                className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="url"
                placeholder="URL del enlace"
                value={link.url}
                onChange={(e) =>
                  handleArrayInputChange(index, 'secondaryLinks', {
                    ...formData.secondaryLinks[index],
                    url: e.target.value
                  })
                }
                className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => removeArrayField('secondaryLinks', index)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center justify-center"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('secondaryLinks')}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
          >
            <FaPlus /> Agregar enlace
          </button>
        </div>

        <hr></hr>

        <div className="bg-gray-300 p-4 rounded-lg shadow-lg mt-4">
          <label className="block mb-2 text-xl font-medium text-gray-700">PDFs Básicos:</label>
          {pdfData.pdfs.map((pdf, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Nombre del PDF"
                value={pdf.nombre}
                onChange={(e) => handleArrayInputChange(index, 'pdfs', { nombre: e.target.value })}
                className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />              
              <input
                type="text"
                placeholder="Descripcion del PDF"
                value={pdf.descripcion}
                onChange={(e) => handleArrayInputChange(index, 'pdfs', { descripcion: e.target.value })}
                className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="flex-1 flex flex-col">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleArrayInputChange(index, 'pdfs', { archivo: e.target.files[0] })}
                  className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                />
                <small className="text-amber-600 font-medium mt-1">⚠️ Tamaño máximo: 10MB</small>
              </div>
              <button
                type="button"
                onClick={() => removeArrayField('pdfs', index)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center justify-center"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('pdfs')}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
          >
            <FaPlus /> Agregar PDF Básico
          </button>
        </div>

        <div className="bg-gray-300 p-4 rounded-lg shadow-lg mt-4">
          <label className="block mb-2 text-xl font-medium text-gray-700">PDFs Con Imagen:</label>
          {pdfData.Ppdfs.map((pdf, index) => (
            <div key={index} className="flex flex-col gap-4 mb-4 w-full">
              <div className="w-full">
                <label className="block mb-2">Nombre del PDF:</label>
                <input
                  type="text"
                  placeholder="Nombre del PDF"
                  value={pdf.nombre}
                  onChange={(e) => handleArrayInputChange(index, 'Ppdfs', { nombre: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="w-full">
                <label className="block mb-2">Descripcion del PDF:</label>
                <input
                  type="text"
                  placeholder="Nombre del PDF"
                  value={pdf.descripcion}
                  onChange={(e) => handleArrayInputChange(index, 'Ppdfs', { descripcion: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="w-full">
                <label className="block mb-2">PDF:</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleArrayInputChange(index, 'Ppdfs', { archivo: e.target.files[0] })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <small className="text-amber-600 font-medium mt-1">⚠️ Tamaño máximo: 10MB</small>
              </div>

              <div className="w-full">
                <label className="block mb-2">Imagen:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleArrayInputChange(index, 'Ppdfs', { imagen: e.target.files[0] })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={() => removeArrayField('Ppdfs', index)}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center justify-center"
              >
                <FaTrash className="mr-2" /> Eliminar
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('Ppdfs')}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
          >
            <FaPlus /> Agregar PDF con imagen
          </button>
        </div>
        <hr></hr>
        <br></br>

        {!loading ? (
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleContextSubmit}
              className="flex-1 px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
            >
              <FaEdit /> Actualizar Contexto
            </button>
            <button
              type="button"
              onClick={handlePdfSubmit}
              className="flex-1 px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
            >
              <FaPlus /> Subir todos los PDFs
            </button>
          </div>
        ) : (
          <Spinner />
        )}

        <br></br>
        <hr></hr>
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4">Lista de PDFs Enviados</h3>
          {pdfList.length === 0 ? (
            <p>No hay PDFs subidos.</p>
          ) : (
          <ul className="space-y-4">
            {pdfList.map((pdf) => (
              <li key={pdf._id} className="flex items-center justify-between border p-4 rounded">
                <div className="flex items-center">
                  {pdf.imagen && (
                    <img src={pdf.imagen} alt={pdf.nombre} className="w-16 h-16 object-cover mr-4" />
                  )}
                  <a
                    href={pdf.archivo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-medium text-blue-600 hover:underline"
                  >
                    {pdf.nombre}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeletePdf(pdf._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>          
          )}
        </div>

      </form>
    </div>
  );
}
