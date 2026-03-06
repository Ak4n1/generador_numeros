/**
 * Servicio para consumir la API de resultados de Quiniela
 */
class QuinielaAPIService {
    constructor() {
        this.apiUrl = 'https://apigeneradornumeros.vercel.app';
    }

    /**
     * Obtiene los resultados de la Quiniela
     * @returns {Promise<Object>}
     */
    async obtenerResultados() {
        try {
            const response = await fetch(`${this.apiUrl}/api/quiniela`);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Error desconocido');
            }
            
            return data;
        } catch (error) {
            console.error('Error obteniendo resultados:', error);
            throw error;
        }
    }

    /**
     * Formatea el nombre del sorteo para mostrar
     * @param {string} sorteo 
     * @returns {string}
     */
    formatearNombreSorteo(sorteo) {
        const nombres = {
            'previa': 'La Previa',
            'primera': 'Primera',
            'matutina': 'Matutina',
            'vespertina': 'Vespertina',
            'nocturna': 'Nocturna'
        };
        return nombres[sorteo] || sorteo;
    }
}

export default QuinielaAPIService;
