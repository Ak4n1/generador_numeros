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
        overlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4';
        overlay.style.animation = 'fadeIn 0.2s ease';

        // Crear modal
        const modal = document.createElement('div');
        modal.className = 'bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-primary/20';
        modal.style.animation = 'slideUp 0.3s ease';

        // Icono según tipo
        const icons = {
            info: '<i class="fas fa-info-circle text-blue-500 text-4xl"></i>',
            error: '<i class="fas fa-exclamation-circle text-red-500 text-4xl"></i>',
            success: '<i class="fas fa-check-circle text-green-500 text-4xl"></i>',
            warning: '<i class="fas fa-exclamation-triangle text-yellow-500 text-4xl"></i>'
        };

        modal.innerHTML = `
            <div class="p-6">
                <div class="flex flex-col items-center text-center gap-4">
                    ${icons[type]}
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white">${title}</h3>
                    <p class="text-slate-600 dark:text-slate-300 leading-relaxed">${message}</p>
                </div>
                <div class="flex gap-3 mt-6 ${showCancel ? 'justify-between' : 'justify-center'}">
                    ${showCancel ? `
                        <button class="modal-cancel flex-1 px-6 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            ${cancelText}
                        </button>
                    ` : ''}
                    <button class="modal-confirm flex-1 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors">
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
        const confirmBtn = modal.querySelector('.modal-confirm');
        const cancelBtn = modal.querySelector('.modal-cancel');

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
