import { useState, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellido: ''
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre || undefined,
        apellido: formData.apellido || undefined
      });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '450px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{
            color: '#4a5568',
            margin: '0 0 10px 0',
            fontSize: '2rem',
            fontWeight: 'bold'
          }}>
            ⏱️ ClarityTimer
          </h1>
          <p style={{
            color: '#718096',
            margin: '0 0 5px 0',
            fontSize: '1rem'
          }}>
            Crea tu cuenta y recibe
          </p>
          <p style={{
            color: '#667eea',
            margin: 0,
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}>
            🎁 600 puntos de bienvenida + Cinnamoroll gratis
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fee',
            color: '#c33',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #fcc',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#4a5568',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}>
              Usuario *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              placeholder="Mínimo 3 caracteres"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#4a5568',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              placeholder="tu@email.com"
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '15px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#4a5568',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                placeholder="Opcional"
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#4a5568',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>
                Apellido
              </label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                placeholder="Opcional"
              />
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#4a5568',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}>
              Contraseña *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#4a5568',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}>
              Confirmar Contraseña *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              placeholder="Repite tu contraseña"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading 
                ? '#a0aec0' 
                : 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '20px'
            }}
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          paddingTop: '20px',
          borderTop: '1px solid #e2e8f0'
        }}>
          <p style={{
            color: '#718096',
            margin: '0 0 10px 0',
            fontSize: '0.9rem'
          }}>
            ¿Ya tienes una cuenta?
          </p>
          <Link
            to="/login"
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '0.95rem',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#764ba2'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#667eea'}
          >
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}

