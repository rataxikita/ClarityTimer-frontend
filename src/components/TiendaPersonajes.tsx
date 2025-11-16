import { useState, useEffect } from 'react';
import { personajeService, type PersonajeSanrio, type InventarioUsuario } from '../services/personajeService';
import { useAuth } from '../contexts/AuthContext';
import PersonajeCard from './PersonajeCard';

export default function TiendaPersonajes() {
  const { user } = useAuth();
  const [personajes, setPersonajes] = useState<PersonajeSanrio[]>([]);
  const [inventario, setInventario] = useState<InventarioUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroRareza, setFiltroRareza] = useState<string>('TODAS');
  const [mostrarSoloDisponibles, setMostrarSoloDisponibles] = useState(false);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Cargando personajes...');
      const [personajesData, inventarioData] = await Promise.all([
        personajeService.getAll(),
        personajeService.getDesbloqueados()
      ]);
      console.log('Personajes cargados:', personajesData.length);
      console.log('Personajes datos COMPLETOS:', JSON.stringify(personajesData, null, 2));
      console.log('Tipo de personajesData:', Array.isArray(personajesData) ? 'Array' : typeof personajesData);
      if (Array.isArray(personajesData)) {
        console.log('Primer personaje:', personajesData[0]);
        console.log('Todos los IDs:', personajesData.map(p => p.id));
      }
      console.log('Inventario cargado:', inventarioData.length);
      console.log('Inventario datos:', inventarioData);
      console.log('Usuario puntos disponibles:', user?.puntosDisponibles);
      setPersonajes(personajesData);
      setInventario(inventarioData);
    } catch (err: any) {
      console.error('Error cargando personajes:', err);
      const errorMessage = err.response?.data?.message 
        || err.message 
        || 'Error al cargar los personajes. Verifica tu conexión.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cargar datos cuando el componente se monta o cuando el usuario está disponible
    if (user) {
      cargarDatos();
    }
  }, [user?.id]); // Recargar si cambia el usuario


  // Filtrar personajes según los filtros
  // IMPORTANTE: Mostrar TODOS los personajes disponibles, incluso si no puede comprarlos
  // El componente PersonajeCard se encargará de mostrar el botón deshabilitado si no puede comprar
  const personajesFiltrados = personajes.filter(p => {
    const cumpleRareza = filtroRareza === 'TODAS' || p.rareza === filtroRareza;
    const cumpleDisponibilidad = !mostrarSoloDisponibles || p.disponible;
    
    // Si el filtro "Solo disponibles para comprar" está activado, filtrar solo los que NO tiene
    // pero mostrar todos los que puede comprar (incluso si no tiene puntos suficientes)
    if (mostrarSoloDisponibles && user) {
      const yaTiene = inventario.some(inv => inv.personaje?.id === p.id);
      // Mostrar solo los que NO tiene (puede comprar o no, pero no los tiene)
      return cumpleRareza && cumpleDisponibilidad && !yaTiene;
    }
    
    return cumpleRareza && cumpleDisponibilidad;
  });
  
  console.log('Personajes filtrados:', personajesFiltrados.length);
  console.log('Filtro rareza:', filtroRareza);
  console.log('Mostrar solo disponibles:', mostrarSoloDisponibles);

  const personajesOrdenados = [...personajesFiltrados].sort((a, b) => {
    // Primero por orden de tienda, luego por precio
    if (a.ordenTienda !== b.ordenTienda) {
      return a.ordenTienda - b.ordenTienda;
    }
    return a.precioPuntos - b.precioPuntos;
  });

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
        <p style={{ color: '#4a5568', fontSize: '1.1rem' }}>Cargando personajes...</p>
        <p style={{ color: '#718096', fontSize: '0.9rem', marginTop: '10px' }}>
          Conectando con el servidor...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>❌</div>
        <p style={{ color: '#e74c3c', fontSize: '1.1rem', marginBottom: '10px', fontWeight: 'bold' }}>
          Error al cargar la tienda
        </p>
        <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '20px' }}>
          {error}
        </p>
        <button
          onClick={cargarDatos}
          style={{
            padding: '10px 20px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#5568d3';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#667eea';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          🔄 Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header con puntos */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '30px',
        color: 'white',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '1.8rem' }}>
          🛍️ Tienda de Personajes
        </h2>
        <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
          💎 Tienes {user?.puntosDisponibles || 0} puntos disponibles
        </p>
      </div>

      {/* Filtros */}
      <div style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '30px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#4a5568',
            fontWeight: 'bold',
            fontSize: '0.9rem'
          }}>
            Filtrar por rareza:
          </label>
          <select
            value={filtroRareza}
            onChange={(e) => setFiltroRareza(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '2px solid #e2e8f0',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            <option value="TODAS">Todas las rarezas</option>
            <option value="COMUN">Común</option>
            <option value="RARO">Raro</option>
            <option value="EPICO">Épico</option>
            <option value="LEGENDARIO">Legendario</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            id="soloDisponibles"
            checked={mostrarSoloDisponibles}
            onChange={(e) => setMostrarSoloDisponibles(e.target.checked)}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
          <label
            htmlFor="soloDisponibles"
            style={{
              color: '#4a5568',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Solo disponibles para comprar
          </label>
        </div>
      </div>

      {/* Inventario */}
      {inventario.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{
            color: '#4a5568',
            marginBottom: '20px',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            🎁 Mis Personajes ({inventario.length})
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {inventario.map((inv) => (
              <PersonajeCard
                key={inv.id}
                personaje={inv.personaje}
                inventario={inventario}
                onCompraExitosa={cargarDatos}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tienda */}
      <div>
        <h3 style={{
          color: '#4a5568',
          marginBottom: '20px',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          🏪 Tienda ({personajesOrdenados.length} personajes)
        </h3>

        {personajesOrdenados.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            background: '#f7fafc',
            borderRadius: '15px'
          }}>
            <p style={{ color: '#718096', fontSize: '1.1rem' }}>
              No hay personajes que coincidan con los filtros seleccionados.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {personajesOrdenados.map((personaje) => (
              <PersonajeCard
                key={personaje.id}
                personaje={personaje}
                inventario={inventario}
                onCompraExitosa={cargarDatos}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

