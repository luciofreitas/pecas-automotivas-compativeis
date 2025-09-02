import React from 'react';
import './page-App.css';

export default function CompatibilityModal({ show, onClose, title, children }) {
	if (!show) return null;
	const handleOverlayClick = (e) => {
		if (e.target.classList.contains('modal-overlay')) {
			onClose();
		}
	};
	return (
		<div className="modal-overlay" onClick={handleOverlayClick}>
			<div className="modal-content compat-modal">
				{children}
			</div>
		</div>
	);
}