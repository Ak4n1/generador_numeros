/**
 * Servicio para consumir la API de resultados de Quini 6
 */
class Quini6APIService {
    constructor() {
        this.apiUrl = 'https://loteriaapp.vercel.app';
    }

    /**
     * Obtiene los resultados del Quini 6
     * @returns {Promise<Object>}
     */
    async obtenerResultados() {
        try {
            const response = await fetch(`${this.apiUrl}/api/quini6`);
            
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
            'tradicional': 'Tradicional',
            'segunda-vuelta': 'Segunda Vuelta',
            'revancha': 'Revancha',
            'siempre-sale': 'Siempre Sale'
        };
        return nombres[sorteo] || sorteo;
    }
}

export default Quini6APIService;
