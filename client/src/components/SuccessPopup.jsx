import { useEffect } from "react";

export default function SuccessPopup({ onClose }) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [onClose]);

  return (
    <div className="success-popup">
      <p>Successful Submission</p>
    </div>
  );
}
