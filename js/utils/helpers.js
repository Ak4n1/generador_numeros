import { Modal } from '../ui/modal.js';

export class StorageHelper {
    static STORAGE_KEY = 'loteria_guardados';

    static guardar(jugada) {
        const guardados = this.obtenerTodos();
        const jugadaConId = {
            ...jugada,
            id: Date.now(),
            fechaGuardado: new Date().toISOString()
        };
        guardados.push(jugadaConId);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(guardados));
        return jugadaConId;
    }

    static obtenerTodos() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    static eliminar(id) {
        const guardados = this.obtenerTodos();
        const filtrados = guardados.filter(item => item.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtrados));
    }

    static limpiarTodos() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}

export class UIHelper {
    static mostrarError(mensaje) {
        Modal.error(mensaje);
    }

    static mostrarExito(mensaje) {
        Modal.success(mensaje);
    }

    static confirmar(mensaje) {
        return new Promise((resolve) => {
            Modal.confirm(
                mensaje,
                () => resolve(true),
                () => resolve(false)
            );
        });
    }
}

export class FormatHelper {
    static formatearFecha(fecha) {
        const date = new Date(fecha);
        return date.toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    static obtenerNombreTipo(tipo) {
        const nombres = {
            '6-numeros': '6 Números (1-45)',
            'quiniela-completa': 'Quiniela Completa',
            'quiniela-1': 'Quiniela 1 Cifra',
            'quiniela-2': 'Quiniela 2 Cifras',
            'quiniela-3': 'Quiniela 3 Cifras',
            'quiniela-4': 'Quiniela 4 Cifras'
        };
        return nombres[tipo] || tipo;
    }
}
