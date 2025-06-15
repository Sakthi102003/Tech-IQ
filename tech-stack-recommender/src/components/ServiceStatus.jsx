import { useEffect, useState } from 'react';
import backendService from '../services/api/backendService';

const ServiceStatus = () => {
  const [status, setStatus] = useState({
    backend: 'checking',
    message: 'Checking services...'
  });

  useEffect(() => {
    checkServices();
  }, []);

  const checkServices = async () => {
    try {
      await backendService.checkHealth();
      setStatus({
        backend: 'online',
        message: 'All services operational'
      });
    } catch (error) {
      setStatus({
        backend: 'offline',
        message: 'Using local recommendations service'
      });
    }
  };

  const getStatusColor = () => {
    switch (status.backend) {
      case 'online':
        return 'text-green-600 bg-green-100';
      case 'offline':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = () => {
    switch (status.backend) {
      case 'online':
        return '🟢';
      case 'offline':
        return '🟡';
      default:
        return '⚪';
    }
  };

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
      <span className="mr-2">{getStatusIcon()}</span>
      {status.message}
    </div>
  );
};

export default ServiceStatus;