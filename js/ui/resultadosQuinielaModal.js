import QuinielaAPIService from '../services/QuinielaAPIService.js';
import { Modal } from './modal.js';

/**
 * Modal para mostrar resultados de la Quiniela
 */
class ResultadosQuinielaModal {
    constructor() {
        this.apiService = new QuinielaAPIService();
    }

    /**
     * Muestra el modal con los resultados de la Quiniela
     */
    async mostrar() {
        try {
            // Mostrar modal de carga
            Modal.show({
                title: 'Cargando resultados...',
                message: 'Obteniendo datos de la Quiniela',
                type: 'info',
                confirmText: 'Esperar...'
            });
            
            // Obtener resultados de la API
            const response = await this.apiService.obtenerResultados();
            
            // Generar HTML con los resultados
            const html = this.generarHTML(response.data, response.timestamp);
            
            // Cerrar modal de carga y mostrar resultados
            setTimeout(() => {
                Modal.show({
                    title: 'Resultados Quiniela',
                    message: html,
                    type: 'info',
                    confirmText: 'Cerrar'
                });
            }, 100);
        } catch (error) {
            Modal.show({
                title: 'Error',
                message: `No se pudieron obtener los resultados de la Quiniela.<br><br>
                    <span style="color: #666; font-size: 0.9em;">Error: ${error.message}</span>`,
                type: 'error',
                confirmText: 'Entendido'
            });
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

        // Agrupar por provincia
        const porProvincia = resultados.reduce((acc, r) => {
            if (!acc[r.provincia]) {
                acc[r.provincia] = [];
            }
            acc[r.provincia].push(r);
            return acc;
        }, {});

        let html = `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 1.1em; color: #4a5568; margin-bottom: 5px;">
                    Sorteos del ${fecha}
                </div>
            </div>
            <div style="max-height: 400px; overflow-y: auto; padding-right: 10px;">
        `;

        // Mostrar resultados por provincia
        Object.entries(porProvincia).forEach(([provincia, sorteos]) => {
            html += `
                <div style="margin-bottom: 20px; padding: 12px; background: #f7fafc; border-radius: 8px; border-left: 4px solid #48bb78;">
                    <div style="font-weight: bold; color: #2d3748; margin-bottom: 10px; font-size: 1em;">
                        ${provincia}
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px;">
            `;
            
            sorteos.forEach(sorteo => {
                const nombreSorteo = this.apiService.formatearNombreSorteo(sorteo.sorteo);
                html += `
                    <div style="text-align: center;">
                        <div style="font-size: 0.75em; color: #718096; margin-bottom: 4px;">
                            ${nombreSorteo}
                        </div>
                        <div style="
                            padding: 8px;
                            border-radius: 6px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            font-weight: bold;
                            font-size: 1em;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        ">
                            ${sorteo.numero}
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });

        html += `
            </div>
            <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
                <div style="font-size: 0.85em; color: #a0aec0;">
                    Fuente: notitimba.com
                </div>
                <div style="font-size: 0.75em; color: #cbd5e0; margin-top: 5px;">
                    Actualizado: ${new Date(timestamp).toLocaleString('es-AR')}
                </div>
            </div>
        `;

        return html;
    }
}

export default ResultadosQuinielaModal;
