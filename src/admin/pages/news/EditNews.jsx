import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import Spinner from '../../../components/Spinner';
import clientAxios from '../../../config/clientAxios';
import { useNavigate, useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import useAuth from '../../../hooks/useAuth';

const modules = {
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' },
    { 'indent': '-1' }, { 'indent': '+1' }],
    ['link'],
    ['clean'],
  ],
};
const formats = [
  "header", "bold", "italic", "underline", "strike",
  "blockquote", "list", "bullet", "indent", "link"
];

const EditNews = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [blog, setBlog] = useState({
    title: '',
    description: '',
    date: '',
    isPublished: false
  });
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);

  const updateState = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    const getBlog = async () => {
      try {
        const response = await clientAxios.get(`/blog/${id}`);
        setBlog(response.data);
        setImg(response.data?.img);
      } catch (error) {
        console.log(error);
        toast.error('Error al cargar la noticia');
      }
    }
    getBlog();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imgElement = new Image();
    imgElement.src = URL.createObjectURL(file);
    imgElement.onload = () => {
      const { width, height } = imgElement;
      const ratio = width / height;
      const isValid = Math.abs(ratio - (3 / 2)) < 0.02;

      if (!isValid) {
        Swal.fire({
          icon: 'error',
          title: 'Imagen inválida',
          text: 'La imagen debe tener proporción 3:2',
        });
        e.target.value = null;
        setImgUrl(null);
        return;
      }
      setImgUrl(file);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (blog.title.trim() === '' || blog.description.trim() === '' || blog.date.trim() === '') {
      setLoading(false);
      toast.error('Todos los campos son obligatorios');
      return;
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    }

    try {
      const formData = new FormData();
      formData.append('title', blog.title);
      formData.append('description', blog.description);
      formData.append('date', blog.date);
      formData.append('isPublished', blog.isPublished);

      if (imgUrl) {
        formData.append('img', imgUrl);
      }

      const response = await clientAxios.put(`/blog/${id}`, formData, config);

      setLoading(false);

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Noticia actualizada',
          text: 'La noticia se ha guardado correctamente',
          timer: 2000,
          showConfirmButton: false
        });
        navigate('/admin/news');
      }
    } catch (error) {
      console.error('Error al actualizar la noticia:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.msg || 'Error al actualizar la noticia'
      });
      setLoading(false);
    }
  }

  return (
    <section className="container mx-auto">
      <h1 className="text-center text-3xl font-bold text-slate-600 mt-10">Edita una Noticia</h1>

      <div className='p-3 max-w-5xl mx-auto min-h-screen'>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <label htmlFor="title" className="font-semibold text-slate-700 pb-2">Titulo:</label>
              <input
                type="text"
                name="title"
                id="title"
                className='input-auth'
                placeholder="Ej. Noticia de la semana"
                value={blog.title}
                onChange={updateState}
              />
            </div>
            <div>
              <label htmlFor="date" className="font-semibold text-slate-700 pb-2">Fecha:</label>
              <input
                type="text"
                name="date"
                id="date"
                className='input-auth'
                placeholder="Ej. 23 de Enero del 2023"
                value={blog.date}
                onChange={updateState}
              />
            </div>
          </div>

          <div className='flex items-center gap-x-5'>
            <div className='flex items-center w-full'>
              <label htmlFor="img" className="font-semibold text-slate-700 pb-2">Imagen:</label>
              <input
                type="file"
                name="img"
                id="img"
                className='input-auth'
                accept='.jpg,.png,.jpeg,.gif,.webp'
                onChange={handleImageChange}
              />
            </div>

            <div className='flex justify-center items-center w-full gap-4'>
            {img || imgUrl ? (
                <>
                {/* Preview de la imagen */}
                <div className='p-2 border border-slate-200 flex justify-center items-center'>
                    <img
                    src={imgUrl ? URL.createObjectURL(imgUrl) : img}
                    alt="imagen"
                    className='w-48 h-32 object-cover'
                    />
                </div>

                {/* Rectángulo simulando proporción 3:2 */}
                <div className="w-48 h-32 border-2 border-dashed border-slate-400 flex flex-col items-center justify-center text-slate-500 rounded">
                    <span className="text-2xl">🖼️</span>
                    <span className="font-bold">3:2</span>
                </div>
                </>
            ) : (
                // Si no hay imagen cargada, solo mostrar el rectángulo
                <div className="w-48 h-32 border-2 border-dashed border-slate-400 flex flex-col items-center justify-center text-slate-500 rounded">
                <span className="text-2xl">🖼️</span>
                <span className="font-bold">3:2</span>
                </div>
            )}
            </div>
          </div>

          <div className='flex items-center gap-x-5'>
            <div className='flex items-center w-full gap-2'>
              <label htmlFor="isPublished" className="font-semibold text-slate-700 pb-2">Estado:</label>
              <select
                name="isPublished"
                id="isPublished"
                className='input-auth'
                value={blog.isPublished.toString()}
                onChange={updateState}
              >
                <option value="true">Publicado</option>
                <option value="false">No Publicado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 pb-2">Descripción:</label>
            <ReactQuill
              placeholder='Write something...'
              className='h-72 mb-12'
              formats={formats}
              modules={modules}
              value={blog.description}
              onChange={(e) => setBlog({ ...blog, description: e })}
            />
            <div>{parse(blog.description)}</div>
          </div>

          {loading ? <Spinner /> : (
            <button type="submit" className="btn-action">Actualizar Noticia</button>
          )}
        </form>
      </div>
    </section>
  )
}

export default EditNews;
