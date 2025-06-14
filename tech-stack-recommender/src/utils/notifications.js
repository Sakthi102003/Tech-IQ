// Utility functions for showing notifications

export const showNotification = (message, type = 'info', duration = 3000) => {
  // Remove any existing notifications of the same type
  const existingNotifications = document.querySelectorAll('.notification-toast');
  existingNotifications.forEach(notification => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  });

  const notification = document.createElement('div');
  notification.className = `notification-toast fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 ${getNotificationClasses(type)}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Add entrance animation
  notification.style.transform = 'translateX(100%)';
  notification.style.transition = 'transform 0.3s ease-in-out';
  
  // Trigger animation
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  // Remove notification after duration
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 300);
    }
  }, duration);
  
  return notification;
};

const getNotificationClasses = (type) => {
  switch (type) {
    case 'success':
      return 'bg-green-600 text-white';
    case 'error':
      return 'bg-red-600 text-white';
    case 'warning':
      return 'bg-yellow-600 text-white';
    case 'loading':
      return 'bg-blue-600 text-white';
    default:
      return 'bg-gray-600 text-white';
  }
};

export const showSuccessNotification = (message, duration = 3000) => {
  return showNotification(message, 'success', duration);
};

export const showErrorNotification = (message, duration = 3000) => {
  return showNotification(message, 'error', duration);
};

export const showLoadingNotification = (message, duration = 0) => {
  return showNotification(message, 'loading', duration);
};

export const showWarningNotification = (message, duration = 3000) => {
  return showNotification(message, 'warning', duration);
};

export const removeNotification = (notification) => {
  if (notification && notification.parentNode) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }
};

export const removeAllNotifications = () => {
  const notifications = document.querySelectorAll('.notification-toast');
  notifications.forEach(notification => {
    removeNotification(notification);
  });
};