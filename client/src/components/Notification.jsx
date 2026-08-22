import useStore from '../store/authStore';

function Notification() {
  const { notification } = useStore();

  if (!notification) return null;

  const alertClass = notification.type === 'success' ? 'alert-success' : 'alert-error';

  return (
    <div className="fixed top-4 right-4 max-w-md z-50 animate-pulse">
      <div className={`alert ${alertClass}`}>
        {notification.message}
      </div>
    </div>
  );
}

export default Notification;
