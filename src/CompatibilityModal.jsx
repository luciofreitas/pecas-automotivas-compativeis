import React, { useEffect } from 'react';
import './app.css';

export default function CompatibilityModal({ show, onClose, title, children }) {
	useEffect(() => {
		if (show) {
			// Lock background scroll when modal is open
			const prev = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			return () => { document.body.style.overflow = prev; };
		}
		return undefined;
	}, [show]);

	if (!show) return null;

	const handleOverlayClick = (e) => {
		if (e.target.classList.contains('modal-overlay')) {
			onClose();
		}
	};

	return (
		<div className="modal-overlay" onClick={handleOverlayClick}>
			<div className="modal-content compat-modal" role="dialog" aria-modal="true" aria-label={title || 'Modal'}>
				<div className="app-compat-modal">
					<div className="app-compat-header">
						<span className="app-compat-title">{title}</span>
						<button className="app-compat-close" aria-label="Fechar" onClick={onClose}>✕</button>
					</div>
					<div className="app-compat-body">
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}