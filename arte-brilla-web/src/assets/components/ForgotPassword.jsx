import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: email, 2: código, 3: nueva contraseña
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Se ha enviado un código de recuperación a tu correo. Por favor revisa tu bandeja de entrada.');
        setStep(2);
      } else {
        setError(data.message || 'Error al enviar el correo de recuperación');
      }
    } catch {
      setError('Error de conexión. Por favor intenta de nuevo.');
    }

    setIsLoading(false);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Código verificado correctamente. Ahora puedes crear una nueva contraseña.');
        setStep(3);
      } else {
        setError(data.message || 'Código inválido o expirado');
      }
    } catch {
      setError('Error de conexión. Por favor intenta de nuevo.');
    }

    setIsLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Contraseña actualizada correctamente. Redirigiendo al login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Error al actualizar la contraseña');
      }
    } catch {
      setError('Error de conexión. Por favor intenta de nuevo.');
    }

    setIsLoading(false);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <div className="forgot-password-icon" aria-label="Icono de seguridad">🔐</div>
          <h1>Recuperar Contraseña</h1>
          <p className="forgot-password-subtitle">Arte Brilla - Academia de Danza</p>
        </div>

        {/* Paso 1: Enviar email */}
        {step === 1 && (
          <form onSubmit={handleSendEmail} className="forgot-password-form" noValidate>
            <p className="step-description">Ingresa tu correo electrónico para recibir un código de recuperación</p>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                disabled={isLoading}
                required
                autoFocus
                autoComplete="email"
              />
            </div>

            {error && <div className="error-message" role="alert">{error}</div>}
            {message && <div className="success-message" role="status">{message}</div>}

            <button
              type="submit"
              className="forgot-password-button"
              disabled={isLoading || !email}
            >
              {isLoading ? 'Enviando...' : 'Enviar Código'}
            </button>
          </form>
        )}

        {/* Paso 2: Verificar código */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="forgot-password-form" noValidate>
            <p className="step-description">Ingresa el código que recibiste por correo</p>
            <div className="form-group">
              <label htmlFor="code">Código de Recuperación</label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ej: 123456"
                disabled={isLoading}
                required
                autoFocus
                maxLength="6"
                autoComplete="off"
                inputMode="numeric"
              />
            </div>

            {error && <div className="error-message" role="alert">{error}</div>}
            {message && <div className="success-message" role="status">{message}</div>}

            <button
              type="submit"
              className="forgot-password-button"
              disabled={isLoading || !code}
            >
              {isLoading ? 'Verificando...' : 'Verificar Código'}
            </button>

            <button
              type="button"
              className="forgot-password-button-secondary"
              onClick={() => setStep(1)}
              disabled={isLoading}
            >
              Volver
            </button>
          </form>
        )}

        {/* Paso 3: Nueva contraseña */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="forgot-password-form" noValidate>
            <p className="step-description">Crea una nueva contraseña</p>
            <div className="form-group">
              <label htmlFor="newPassword">Nueva Contraseña</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingresa tu nueva contraseña"
                disabled={isLoading}
                required
                autoFocus
                autoComplete="new-password"
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu nueva contraseña"
                disabled={isLoading}
                required
                autoComplete="new-password"
                minLength="6"
              />
            </div>

            {error && <div className="error-message" role="alert">{error}</div>}
            {message && <div className="success-message" role="status">{message}</div>}

            <button
              type="submit"
              className="forgot-password-button"
              disabled={isLoading || !newPassword || !confirmPassword}
            >
              {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
            </button>

            <button
              type="button"
              className="forgot-password-button-secondary"
              onClick={() => setStep(2)}
              disabled={isLoading}
            >
              Volver
            </button>
          </form>
        )}

        <div className="forgot-password-footer">
          <p>
            ¿Recordaste tu contraseña? <Link to="/login" className="forgot-password-link">Volver al login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
