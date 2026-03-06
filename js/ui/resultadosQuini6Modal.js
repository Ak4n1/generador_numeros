import Quini6APIService from '../services/Quini6APIService.js';
import { Modal } from './modal.js';

/**
 * Modal para mostrar resultados del Quini 6
 */
class Quini6ModalActuales {
    constructor() {
        this.apiService = new Quini6APIService();
    }

    /**
     * Muestra el modal con los resultados del Quini 6
     */
    async mostrar() {
        try {
            // Mostrar loading spinner
            this.mostrarLoading();
            
            // Obtener resultados de la API
            const response = await this.apiService.obtenerResultados();
            
            // Ocultar loading
            this.ocultarLoading();
            
            // Generar HTML con los resultados
            const html = this.generarHTML(response.data, response.timestamp);
            
            // Mostrar resultados
            Modal.show({
                title: 'Resultados Quini 6',
                message: html,
                type: 'info',
                confirmText: 'Cerrar'
            });
        } catch (error) {
            this.ocultarLoading();
            Modal.show({
                title: 'Error',
                message: `No se pudieron obtener los resultados del Quini 6.<br><br>
                    <span style="color: #666; font-size: 0.9em;">Error: ${error.message}</span>`,
                type: 'error',
                confirmText: 'Entendido'
            });
        }
    }

    /**
     * Muestra un loading spinner
     */
    mostrarLoading() {
        const loading = document.createElement('div');
        loading.id = 'quini6-loading';
        loading.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center';
        loading.innerHTML = `
            <div class="bg-slate-900 rounded-xl p-8 flex flex-col items-center gap-4">
                <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                <p class="text-white font-semibold">Cargando resultados...</p>
            </div>
        `;
        document.body.appendChild(loading);
    }

    /**
     * Oculta el loading spinner
     */
    ocultarLoading() {
        const loading = document.getElementById('quini6-loading');
        if (loading) {
            loading.remove();
        }
    }

    /**
     * Genera el HTML para mostrar los resultados
     * @param {Array} resultados 
     * @param {string} timestamp 
     * @returns {string}
     */
    generarHTML(resultados, timestamp) {
        if (!resultados || resultados.length === 0) {
            return '<p>No hay resultados disponibles.</p>';
        }

        const fecha = resultados[0].fecha;
        const concurso = resultados[0].concurso;

        let html = `
            <div style="text-align: center; margin-bottom: 12px;">
                <div style="font-size: 0.95em; color: #94a3b8; margin-bottom: 2px;">
                    Sorteo del ${fecha}
                </div>
                <div style="font-size: 0.8em; color: #64748b;">
                    Concurso N° ${concurso}
                </div>
            </div>
        `;

        resultados.forEach(resultado => {
            const nombreSorteo = this.apiService.formatearNombreSorteo(resultado.sorteo);
            
            html += `
                <div style="margin-bottom: 12px; padding: 10px; background: #1e293b; border-radius: 8px; border-left: 3px solid #667eea;">
                    <div style="font-weight: 600; color: #e2e8f0; margin-bottom: 6px; font-size: 0.9em;">
                        ${nombreSorteo}
                    </div>
                    <div style="display: flex; gap: 5px; justify-content: center; flex-wrap: wrap;">
                        ${resultado.numeros.map(num => `
                            <div style="
                                width: 36px;
                                height: 36px;
                                border-radius: 50%;
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                color: white;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-weight: bold;
                                font-size: 0.9em;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                            ">
                                ${num.toString().padStart(2, '0')}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        html += `
            <div style="text-align: center; margin-top: 12px; padding-top: 10px; border-top: 1px solid #334155;">
                <div style="font-size: 0.75em; color: #64748b;">
                    Fuente: notitimba.com
                </div>
                <div style="font-size: 0.7em; color: #475569; margin-top: 2px;">
                    Actualizado: ${new Date(timestamp).toLocaleString('es-AR')}
                </div>
            </div>
        `;

        return html;
    }
}

export default Quini6ModalActuales;
