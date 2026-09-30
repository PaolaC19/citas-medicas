export default function ErrorBanner({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="banner" role="alert">
      <span>{message}</span>
      {onClose && <button onClick={onClose} aria-label="Cerrar">×</button>}
    </div>
  );
}
