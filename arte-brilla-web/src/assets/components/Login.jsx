import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      const destination = (result.role === 'OWNER' || result.role === 'ADMIN') ? '/admin' : '/teacher';
      navigate(destination, { replace: true });
    } else {
      setError(result.message || 'Credenciales inválidas o error de conexión');
      setPassword('');
    }

    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">✨</div>
          <h1>Panel Administrativo</h1>
          <p className="login-subtitle">Arte Brilla - Academia de Danza</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Correo</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              disabled={isLoading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit"
            className="login-button"
            disabled={isLoading || !email || !password}
          >
            {isLoading ? 'Verificando...' : 'Acceder'}
          </button>

          <div className="forgot-password-container-login">
            <Link to="/forgot-password" className="forgot-password-link-login">
              ¿Se te olvidó la contraseña?
            </Link>
          </div>
        </form>

        <div className="login-footer">
          <p>Acceso restringido a personal autorizado</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
