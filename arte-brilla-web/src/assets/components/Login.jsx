import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import '../styles/Login.css';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular pequeña demora para mejor UX
    setTimeout(() => {
      const result = login(password);
      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.message);
        setPassword('');
      }
      setIsLoading(false);
    }, 300);
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
            <label htmlFor="password">Contraseña de Administrador</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa la contraseña"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="login-button"
            disabled={isLoading || !password}
          >
            {isLoading ? 'Verificando...' : 'Acceder'}
          </button>
        </form>

        <div className="login-footer">
          <p>Acceso restringido a personal autorizado</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
