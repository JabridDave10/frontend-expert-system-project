import { useState } from 'react';
import apiClient from '../api/apiClient';

interface ConnectionStatus {
  status: 'idle' | 'testing' | 'success' | 'error';
  message: string;
  response?: any;
}

export default function BackendTest() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'idle',
    message: 'Presiona el botón para probar la conexión'
  });

  const testConnection = async (endpoint: string = '/health/') => {
    setConnectionStatus({
      status: 'testing',
      message: 'Probando conexión...'
    });

    try {
      // Intentar conectar al endpoint especificado
      const response = await apiClient.get(endpoint);
      
      setConnectionStatus({
        status: 'success',
        message: `✅ Conexión exitosa! ${response.data.message}`,
        response: response.data
      });
    } catch (error: any) {
      let errorMessage = '❌ Error de conexión';
      
      if (error.code === 'ECONNREFUSED') {
        errorMessage = '❌ Backend no está ejecutándose (puerto 8000)';
      } else if (error.response) {
        errorMessage = `❌ Error del servidor: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = '❌ No se pudo conectar al backend';
      }
      
      setConnectionStatus({
        status: 'error',
        message: errorMessage,
        response: error.message
      });
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus.status) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'testing': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{
      padding: '20px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      margin: '20px 0',
      backgroundColor: '#f9fafb'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#374151' }}>
        🔗 Prueba de Conexión Backend
      </h3>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>URL del Backend:</strong> {import.meta.env.VITE_API_URL || 'http://localhost:8000'}
      </div>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button
          onClick={() => testConnection('/health/')}
          disabled={connectionStatus.status === 'testing'}
          style={{
            padding: '10px 20px',
            backgroundColor: connectionStatus.status === 'testing' ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: connectionStatus.status === 'testing' ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {connectionStatus.status === 'testing' ? '⏳ Probando...' : '🏥 Health Check'}
        </button>
        
        <button
          onClick={() => testConnection('/health/ping')}
          disabled={connectionStatus.status === 'testing'}
          style={{
            padding: '10px 20px',
            backgroundColor: connectionStatus.status === 'testing' ? '#9ca3af' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: connectionStatus.status === 'testing' ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {connectionStatus.status === 'testing' ? '⏳ Probando...' : '🏓 Ping Test'}
        </button>
      </div>
      
      <div style={{
        marginTop: '15px',
        padding: '10px',
        backgroundColor: 'white',
        borderRadius: '6px',
        border: `2px solid ${getStatusColor()}`,
        color: getStatusColor(),
        fontWeight: '500'
      }}>
        {connectionStatus.message}
      </div>
      
      {connectionStatus.response && (
        <details style={{ marginTop: '15px' }}>
          <summary style={{ cursor: 'pointer', fontWeight: '500' }}>
            📋 Ver respuesta completa
          </summary>
          <pre style={{
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#f3f4f6',
            borderRadius: '4px',
            fontSize: '12px',
            overflow: 'auto',
            maxHeight: '200px'
          }}>
            {JSON.stringify(connectionStatus.response, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
