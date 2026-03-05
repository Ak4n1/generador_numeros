import { GeneradorQuini6 } from '../generadores/quini6.js';
import { GeneradorQuiniela, GeneradorQuinielaCompleta } from '../generadores/quiniela.js';

/**
 * Servicio para manejar la lógica de generación de números
 */
export class GeneradorService {
    constructor() {
        this.generadorActual = null;
    }

    /**
     * Crea el generador apropiado según el tipo de lotería
     */
    crearGenerador(config) {
        switch (config.tipo) {
            case '6-numeros':
                return new GeneradorQuini6(config);

            case 'quiniela-1':
                return new GeneradorQuiniela({ ...config, cifras: 1, cantidadNumeros: 1 });

            case 'quiniela-2':
                return new GeneradorQuiniela({ ...config, cifras: 2, cantidadNumeros: 1 });

            case 'quiniela-3':
                return new GeneradorQuiniela({ ...config, cifras: 3, cantidadNumeros: 1 });

            case 'quiniela-4':
                return new GeneradorQuiniela({ ...config, cifras: 4, cantidadNumeros: 1 });

            default:
                throw new Error('Tipo de lotería no válido');
        }
    }

    /**
     * Genera múltiples jugadas
     */
    generarJugadas(config, cantidad) {
        const generador = this.crearGenerador(config);
        return generador.generarMultiples(cantidad);
    }

    /**
     * Genera una sola jugada
     */
    generarJugada(config) {
        const generador = this.crearGenerador(config);
        return generador.generar();
    }
}
