/**
 * Sistema de modales custom
 */
export class Modal {
    static show(options) {
        const {
            title = 'Atención',
            message = '',
            type = 'info', // info, error, success, warning
            confirmText = 'Aceptar',
            cancelText = 'Cancelar',
            showCancel = false,
            onConfirm = () => {},
            onCancel = () => {}
        } = options;

        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.style.animation = 'fadeIn 0.2s ease';

        // Crear modal
        const modal = document.createElement('div');
        modal.className = 'modal-basic';
        modal.style.animation = 'slideUp 0.3s ease';

        // Icono según tipo
        const icons = {
            info: '<i class="fas fa-info-circle modal-icon info"></i>',
            error: '<i class="fas fa-exclamation-circle modal-icon error"></i>',
            success: '<i class="fas fa-check-circle modal-icon success"></i>',
            warning: '<i class="fas fa-exclamation-triangle modal-icon warning"></i>'
        };

        modal.innerHTML = `
            <div class="modal-content-basic">
                <div class="modal-content-center">
                    ${icons[type]}
                    <h3 class="modal-title-basic">${title}</h3>
                    <p class="modal-message">${message}</p>
                </div>
                <div class="modal-buttons ${showCancel ? 'between' : 'center'}">
                    ${showCancel ? `
                        <button class="modal-btn-cancel">
                            ${cancelText}
                        </button>
                    ` : ''}
                    <button class="modal-btn-confirm">
                        ${confirmText}
                    </button>
                </div>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Agregar estilos de animación si no existen
        if (!document.getElementById('modal-animations')) {
            const style = document.createElement('style');
            style.id = 'modal-animations';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        // Event listeners
        const confirmBtn = modal.querySelector('.modal-btn-confirm');
        const cancelBtn = modal.querySelector('.modal-btn-cancel');

        const close = () => {
            overlay.style.animation = 'fadeIn 0.2s ease reverse';
            setTimeout(() => overlay.remove(), 200);
        };

        confirmBtn.addEventListener('click', () => {
            onConfirm();
            close();
        });

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                onCancel();
                close();
            });
        }

        // Cerrar al hacer clic fuera
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                if (showCancel) {
                    onCancel();
                }
                close();
            }
        });

        // Cerrar con Escape
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                if (showCancel) {
                    onCancel();
                }
                close();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    static error(message) {
        this.show({
            title: 'Error',
            message,
            type: 'error',
            confirmText: 'Entendido'
        });
    }

    static success(message) {
        this.show({
            title: 'Éxito',
            message,
            type: 'success',
            confirmText: 'Genial'
        });
    }

    static confirm(message, onConfirm, onCancel) {
        this.show({
            title: '¿Estás seguro?',
            message,
            type: 'warning',
            confirmText: 'Sí, continuar',
            cancelText: 'Cancelar',
            showCancel: true,
            onConfirm,
            onCancel
        });
    }
}
