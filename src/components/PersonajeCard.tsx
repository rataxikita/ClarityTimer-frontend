import { useState } from 'react';
import { personajeService, type PersonajeSanrio, type InventarioUsuario } from '../services/personajeService';
import { useAuth } from '../contexts/AuthContext';

interface PersonajeCardProps {
  personaje: PersonajeSanrio;
  inventario?: InventarioUsuario[];
  onCompraExitosa: () => void;
  onViewCertificate?: () => void;
}

export default function PersonajeCard({ personaje, inventario = [], onCompraExitosa, onViewCertificate }: PersonajeCardProps) {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Validar que personaje existe
  if (!personaje || !personaje.id) {
    return null;
  }

  // Filtrar inventario válido y verificar si ya tiene el personaje
  const inventarioValido = inventario.filter(inv => inv && inv.personaje && inv.personaje.id);
  const yaTienePersonaje = inventarioValido.some(inv => inv.personaje.id === personaje.id);
  const personajeActivo = inventarioValido.find(inv => inv.esActivo && inv.personaje.id === personaje.id);
  const puedeComprar = user && user.puntosDisponibles >= personaje.precioPuntos && !yaTienePersonaje && personaje.disponible;

  const getRarezaColor = (rareza: string) => {
    switch (rareza) {
      case 'COMUN': return '#95a5a6';
      case 'RARO': return '#3498db';
      case 'EPICO': return '#9b59b6';
      case 'LEGENDARIO': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  const getRarezaLabel = (rareza: string) => {
    switch (rareza) {
      case 'COMUN': return 'Común';
      case 'RARO': return 'Raro';
      case 'EPICO': return 'Épico';
      case 'LEGENDARIO': return 'Legendario';
      default: return rareza;
    }
  };

  const handleComprar = async () => {
    if (!puedeComprar || !user) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('Comprando personaje:', personaje.id);
      const resultado = await personajeService.comprar(personaje.id);
      console.log('Resultado de compra:', resultado);
      if (resultado.exito) {
        setSuccess(true);
        await updateUser(); // Actualizar puntos del usuario
        onCompraExitosa(); // Recargar datos de la tienda
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(resultado.mensaje || 'Error al comprar el personaje');
      }
    } catch (err: any) {
      console.error('Error en compra:', err);
      const errorMsg = err.response?.data?.message
        || err.message
        || 'Error al comprar el personaje. Verifica tu conexión.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleActivar = async () => {
    if (!yaTienePersonaje || personajeActivo) return;

    setLoading(true);
    setError(null);

    try {
      console.log('Activando personaje:', personaje.id);
      await personajeService.activar(personaje.id);
      await updateUser();
      onCompraExitosa(); // Recargar datos para actualizar el estado activo
    } catch (err: any) {
      console.error('Error activando personaje:', err);
      const errorMsg = err.response?.data?.message
        || err.message
        || 'Error al activar el personaje. Verifica tu conexión.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '15px',
      padding: '20px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      border: personajeActivo ? '3px solid #667eea' : '1px solid #e2e8f0',
      position: 'relative',
      overflow: 'hidden'
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
      }}
    >
      {/* Imagen del personaje */}
      <div style={{
        width: '100%',
        height: '200px',
        borderRadius: '10px',
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'white',
        border: '1px solid #e2e8f0',
        padding: '15px',
        position: 'relative'
      }}>
        {personaje.imagenEstudio ? (
          <img
            src={personaje.imagenEstudio}
            alt={personaje.nombre}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center'
            }}
            onError={(e) => {
              // Si la imagen falla al cargar, mostrar placeholder
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = '<div style="font-size: 4rem;">🎴</div><div style="font-size: 0.8rem; color: white; margin-top: 10px;">Imagen no encontrada</div>';
              }
            }}
          />
        ) : (
          <div style={{ fontSize: '4rem', color: 'white' }}>🎴</div>
        )}
      </div>

      {/* Nombre */}
      <h3 style={{
        margin: '0 0 10px 0',
        color: '#4a5568',
        fontSize: '1.3rem',
        fontWeight: 'bold'
      }}>
        {personaje.nombre}
      </h3>

      {/* Descripción */}
      {personaje.descripcion && (
        <p style={{
          margin: '0 0 15px 0',
          color: '#718096',
          fontSize: '0.9rem',
          lineHeight: '1.5'
        }}>
          {personaje.descripcion}
        </p>
      )}

      {/* Precio */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        padding: '10px',
        background: '#f7fafc',
        borderRadius: '8px'
      }}>
        <span style={{ color: '#4a5568', fontWeight: 'bold' }}>Precio:</span>
        <span style={{
          color: '#667eea',
          fontWeight: 'bold',
          fontSize: '1.1rem'
        }}>
          💎 {personaje.precioPuntos} puntos
        </span>
      </div>

      {/* Mensajes de estado */}
      {error && (
        <div style={{
          padding: '10px',
          background: '#fee',
          color: '#c33',
          borderRadius: '8px',
          marginBottom: '10px',
          fontSize: '0.85rem'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: '10px',
          background: '#efe',
          color: '#3c3',
          borderRadius: '8px',
          marginBottom: '10px',
          fontSize: '0.85rem',
          fontWeight: 'bold'
        }}>
          ✅ ¡Comprado exitosamente!
        </div>
      )}

      {/* Botones de acción */}
      <div>
        {personajeActivo ? (
          <button
            disabled
            style={{
              width: '100%',
              padding: '12px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'not-allowed',
              opacity: 0.7
            }}
          >
            ✓ Activo
          </button>
        ) : yaTienePersonaje ? (
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
            {onViewCertificate && (
              <button
                onClick={onViewCertificate}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#f1c40f',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}
              >
                📜 Ver Certificado
              </button>
            )}
            <button
              onClick={handleActivar}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: '#4ecdc4',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Activando...' : 'Activar Personaje'}
            </button>
          </div>
        ) : puedeComprar ? (
          <button
            onClick={handleComprar}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Comprando...' : `Comprar por ${personaje.precioPuntos} puntos`}
          </button>
        ) : (
          <button
            disabled
            style={{
              width: '100%',
              padding: '12px',
              background: '#cbd5e0',
              color: '#718096',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'not-allowed'
            }}
          >
            {!personaje.disponible
              ? 'No disponible'
              : user && user.puntosDisponibles < personaje.precioPuntos
                ? `Necesitas ${personaje.precioPuntos - user.puntosDisponibles} puntos más`
                : 'No disponible'}
          </button>
        )}
      </div>
    </div>
  );
}

