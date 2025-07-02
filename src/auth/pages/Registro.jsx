import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import clientAxios from '../../config/clientAxios';
import Spinner from '../../components/Spinner';
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

export default function Registro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [token, setToken] = useState('');
  const [loadingToken, setLoadingToken] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordStrengthText, setPasswordStrengthText] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name' || name === 'lastName') {
      const regex = /^[a-zA-ZñÑüÜáéíóúÁÉÍÓÚ\s]*$/;
      if (!regex.test(value)) {
        toast.error('Solo se permiten letras, espacios y caracteres como ñ o ü en este campo.');
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'password') {
      evaluatePasswordStrength(value);
    }
  };

  const evaluatePasswordStrength = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const noCommonPatterns = !/(1234|password|abcd|qwerty)/i.test(password);

    let strength = 0;
    if (hasMinLength) strength += 1;
    if (hasUpperCase) strength += 1;
    if (hasLowerCase) strength += 1;
    if (hasNumber) strength += 1;
    if (hasSpecialChar) strength += 1;
    if (noCommonPatterns) strength += 1;

    setPasswordStrength(strength);

    if (strength <= 2) {
      setPasswordStrengthText('Débil');
    } else if (strength <= 4) {
      setPasswordStrengthText('Media');
    } else {
      setPasswordStrengthText('Fuerte');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.name.trim() === '' || 
        formData.lastName.trim() === '' || 
        formData.email.trim() === '' || 
        formData.password.trim() === '' || 
        formData.confirmPassword.trim() === '') {
      toast.error('Todos los campos son obligatorios');
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
  
    if (passwordStrengthText === 'Débil') {
      toast.error('La contraseña es débil. Por favor, elija una más fuerte.', { icon: '⚠️' });
      return;
    } else if (passwordStrengthText === 'Media') {
      toast('La contraseña es media, Por favor, elija una más fuerte.', { icon: '⚠️' });
      return;
    }
  
    // Validar si la contraseña ha sido comprometida
    const isPwned = await checkPasswordPwned(formData.password);
    if (isPwned) {
      toast.error('La contraseña ingresada ha sido comprometida en una filtración anterior. Por favor, elija otra.');
      return;
    }
  
    setLoading(true);
    try {
      const response = await clientAxios.post('/token-create', {
        email: formData.email,
      });
  
      if (response.status === 201) {
        toast.success('Se ha enviado un token de verificación a tu correo');
        setShowModal(true); // Mostrar el modal
      }
    } catch (error) {
      console.error(error.response?.data || error);
      toast.error('Hubo un error al enviar el token');
    } finally {
      setLoading(false);
    }
  };
  
  const checkPasswordPwned = async (password) => {
    const sha1Hash = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(password));
    const hashHex = Array.from(new Uint8Array(sha1Hash))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
  
    const prefix = hashHex.slice(0, 5);
    const suffix = hashHex.slice(5);
  
    try {
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      const data = await response.text();
  
      // Verificar si el sufijo está en la lista de hashes filtrados
      return data.split('\n').some((line) => line.split(':')[0] === suffix);
    } catch (error) {
      console.error('Error verificando contraseñas comprometidas:', error);
      toast.error('No se pudo verificar si la contraseña ha sido comprometida.');
      return false;
    }
  };  

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    setLoadingToken(true);
    try {
      const response = await clientAxios.post('/token-verify', {
        email: formData.email,
        token,
      });

      if (response.status === 200) {
        const userResponse = await clientAxios.post('/user', {
          name: formData.name,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: 0
        });

        if (userResponse.status === 200) {

          toast.success('Usuario registrado correctamente');
          navigate('/login');

          await clientAxios.delete('/tokens-delete-email', {
            data: { email: formData.email },
          });
        }
      }
    } catch (error) {
      console.error(error.response?.data || error);
      toast.error('Token inválido o ya utilizado');
    } finally {
      setLoadingToken(false);
      setShowModal(false); // Cerrar el modal
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 1:
      case 2:
        return 'bg-red-500';
      case 3:
      case 4:
        return 'bg-yellow-500';
      case 5:
      case 6:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow shadow-slate-300 my-16">
      <h2 className="text-4xl font-bold text-center text-slate-700">Registro</h2>
      <form onSubmit={handleSubmit} className="my-5">
        <div className="flex flex-col space-y-5">
          <div>
            <label htmlFor="name" className="font-medium text-slate-700 pb-2">Nombres:</label>
            <input
              type="text"
              name="name"
              id="name"
              className="input-auth"
              placeholder="Ingrese su nombre"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="font-medium text-slate-700 pb-2">Apellidos:</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              className="input-auth"
              placeholder="Ingrese su apellido"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="font-medium text-slate-700 pb-2">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              className="input-auth"
              placeholder="Ingrese su email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="font-medium text-slate-700 pb-2">Contraseña:</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                className="input-auth"
                placeholder="Ingrese su contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <IoIosEyeOff /> : <IoIosEye />}
              </button>
            </div>
            <div className="flex items-center mt-2">
              <div className={`h-2 rounded ${getPasswordStrengthColor()}`} style={{ width: "65%" }}></div>
              <span className="ml-2">{`Fortaleza: ${passwordStrengthText}`}</span>
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="font-medium text-slate-700 pb-2">Confirmar Contraseña:</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                id="confirmPassword"
                className="input-auth"
                placeholder="Confirme su contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <IoIosEyeOff /> : <IoIosEye />}
              </button>
            </div>
          </div>
          {
            !loading ? 
              <button type="submit" className="btn-action">
                Registrar
              </button> : 
              <Spinner />
          }
        </div>
      </form>
  
      {/* Modal para ingresar el token */}
      {showModal && (
        <div className="modal">
          <h2>Ingrese el Token de Verificación</h2>
          <form onSubmit={handleTokenSubmit}>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Ingrese el token"
              required
            />
            <button type="submit" disabled={loadingToken}>
              {loadingToken ? 'Verificando...' : 'Verificar'}
            </button>
          </form>
        </div>
      )}
    </div>
  );  
}
