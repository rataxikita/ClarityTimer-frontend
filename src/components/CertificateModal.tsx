import React from 'react';
import { InventarioUsuario } from '../services/personajeService';
import { useAuth } from '../contexts/AuthContext';

interface CertificateModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: InventarioUsuario;
}

export default function CertificateModal({ isOpen, onClose, item }: CertificateModalProps) {
    const { user } = useAuth();

    if (!isOpen) return null;

    // 🎯 PRESENTACIÓN: Certificados se generan dinámicamente como HTML
    // Se imprimen usando window.print() - abre el diálogo de impresión del navegador
    const handlePrint = () => {
        window.print();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px'
        }} onClick={onClose}>
            <div
                onClick={e => e.stopPropagation()}
                className="certificate-container"
                style={{
                    background: 'white',
                    padding: '40px',
                    borderRadius: '20px',
                    maxWidth: '800px',
                    width: '100%',
                    position: 'relative',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                    border: '15px solid #f0e6d2',
                    backgroundImage: 'radial-gradient(#f0e6d2 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            >
                {/* Decoraciones de Esquinas */}
                <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '40px' }}>✨</div>
                <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '40px' }}>✨</div>
                <div style={{ position: 'absolute', bottom: '10px', left: '10px', fontSize: '40px' }}>✨</div>
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '40px' }}>✨</div>

                <div style={{ textAlign: 'center', border: '2px solid #d4c5a9', padding: '30px', backgroundColor: 'rgba(255,255,255,0.9)' }}>

                    <h1 style={{
                        fontFamily: "'Brush Script MT', cursive",
                        fontSize: '3.5rem',
                        color: '#2c3e50',
                        margin: '0 0 10px 0'
                    }}>
                        Certificado de Compañía
                    </h1>

                    <p style={{
                        textTransform: 'uppercase',
                        letterSpacing: '3px',
                        color: '#7f8c8d',
                        fontSize: '0.9rem',
                        marginBottom: '30px'
                    }}>
                        Oficialmente Otorgado
                    </p>

                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ fontSize: '1.1rem', color: '#34495e', fontStyle: 'italic' }}>Presentado a:</p>
                        <h2 style={{
                            fontSize: '2.5rem',
                            color: '#e67e22',
                            borderBottom: '2px solid #bdc3c7',
                            display: 'inline-block',
                            padding: '0 20px 5px',
                            margin: '10px 0 20px',
                            fontFamily: "'Times New Roman', serif"
                        }}>
                            {user?.nombre ? `${user.nombre} ${user.apellido || ''}` : user?.username}
                        </h2>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <p style={{ fontSize: '1.1rem', color: '#34495e', fontStyle: 'italic' }}>Por adoptar al compañero de estudio:</p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', margin: '15px 0' }}>
                            <img
                                src={item.personaje.imagenEstudio}
                                alt={item.personaje.nombre}
                                style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                            />
                            <h2 style={{
                                fontSize: '2.2rem',
                                color: item.personaje.categoria.color || '#e67e22',
                                fontFamily: "'Times New Roman', serif",
                                margin: 0
                            }}>
                                {item.personaje.nombre}
                            </h2>
                        </div>
                    </div>

                    <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px', fontStyle: 'italic' }}>
                        <p style={{ fontSize: '1.2rem', color: '#555', lineHeight: '1.6' }}>
                            "Prometo esforzarme en mis estudios, mantener la concentración y nunca rendirme,
                            con el apoyo incondicional de mi nuevo compañero."
                        </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '40px', alignItems: 'flex-end' }}>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ borderTop: '1px solid #333', width: '200px', margin: '0 auto', paddingTop: '5px', fontWeight: 'bold' }}>
                                {new Date(item.fechaObtencion).toLocaleDateString()}
                            </p>
                            <p style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>Fecha de Adopción</p>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontFamily: "'Brush Script MT', cursive", fontSize: '1.5rem', color: '#2c3e50', marginBottom: '5px' }}>
                                ClarityTimer Oficial
                            </div>
                            <p style={{ borderTop: '1px solid #333', width: '200px', margin: '0 auto', paddingTop: '5px', fontWeight: 'bold' }}>
                                Firma Autorizada
                            </p>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px', fontSize: '0.7rem', color: '#bdc3c7' }}>
                        ID Certificado: {item.codigoCertificado || 'PENDIENTE'}
                    </div>

                </div>

                <div className="no-print" style={{ marginTop: '20px', textAlign: 'center', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button
                        onClick={handlePrint}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#34495e',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        🖨️ Imprimir
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Cerrar
                    </button>
                </div>

                <style>
                    {`
            @media print {
              body * {
                visibility: hidden;
              }
              .certificate-container, .certificate-container * {
                visibility: visible;
              }
              .certificate-container {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                margin: 0;
                padding: 0;
                box-shadow: none;
                border: 5px solid #f0e6d2;
              }
              .no-print {
                display: none !important;
              }
            }
          `}
                </style>
            </div>
        </div>
    );
}
