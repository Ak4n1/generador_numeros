import { Validador } from '../utils/validaciones.js';
import { UIHelper } from '../utils/helpers.js';

/**
 * Controlador para manejar la configuración de la aplicación
 */
export class ConfiguracionController {
    constructor(tipoLoteriaSelect) {
        this.tipoLoteriaSelect = tipoLoteriaSelect;
        this.numerosFijos = [];
        this.filtroActual = 'auto';
        this.filtrosAvanzados = null; // Para 6 números
    }

    /**
     * Obtiene la configuración actual
     */
    obtenerConfiguracion() {
        const tipo = this.tipoLoteriaSelect.getValue();
        const usarRango = document.getElementById('usar-rango').checked;
        const rangoMin = parseInt(document.getElementById('rango-min').value) || 0;
        const rangoMax = parseInt(document.getElementById('rango-max').value) || 100;
        const soloPares = this.filtroActual === 'pares';
        const soloImpares = this.filtroActual === 'impares';

        // Validar rango si está activado
        if (usarRango) {
            const validacion = Validador.validarRangoConFiltros(rangoMin, rangoMax, tipo, soloPares, soloImpares);
            if (!validacion.valido) {
                throw new Error(validacion.mensaje);
            }
        }

        return {
            tipo,
            numerosFijos: [...this.numerosFijos],
            usarRango,
            rangoMin,
            rangoMax,
            soloPares,
            soloImpares,
            filtrosAvanzados: this.filtrosAvanzados
        };
    }

    /**
     * Obtiene la cantidad de jugadas del slider
     */
    obtenerCantidadJugadas() {
        return parseInt(document.getElementById('cantidad-jugadas').value) || 1;
    }

    /**
     * Agrega un número fijo
     */
    agregarNumeroFijo(valor) {
        if (!valor) return false;

        const tipo = this.tipoLoteriaSelect.getValue();
        const validacion = Validador.validarNumero(valor, tipo);

        if (!validacion.valido) {
            UIHelper.mostrarError(validacion.mensaje);
            return false;
        }

        if (this.numerosFijos.includes(validacion.numero)) {
            UIHelper.mostrarError('Este número ya está agregado');
            return false;
        }

        this.numerosFijos.push(validacion.numero);
        return true;
    }

    /**
     * Elimina un número fijo
     */
    eliminarNumeroFijo(numero) {
        this.numerosFijos = this.numerosFijos.filter(n => n !== numero);
    }

    /**
     * Obtiene los números fijos
     */
    getNumerosFijos() {
        return [...this.numerosFijos];
    }

    /**
     * Cambia el filtro par/impar
     */
    setFiltro(filtro) {
        this.filtroActual = filtro;
    }

    /**
     * Obtiene el filtro actual
     */
    getFiltro() {
        return this.filtroActual;
    }

    /**
     * Actualiza los límites del rango según el tipo de lotería
     */
    actualizarLimitesRango() {
        const tipo = this.tipoLoteriaSelect.getValue();
        const rangoMin = document.getElementById('rango-min');
        const rangoMax = document.getElementById('rango-max');

        switch (tipo) {
            case '6-numeros':
                rangoMin.placeholder = 'Mín: 0';
                rangoMax.placeholder = 'Máx: 45';
                rangoMin.min = 0;
                rangoMax.max = 45;
                break;

            case 'quiniela-1':
                rangoMin.placeholder = 'Mín: 0';
                rangoMax.placeholder = 'Máx: 9';
                rangoMin.min = 0;
                rangoMax.max = 9;
                break;

            case 'quiniela-2':
                rangoMin.placeholder = 'Mín: 0';
                rangoMax.placeholder = 'Máx: 99';
                rangoMin.min = 0;
                rangoMax.max = 99;
                break;

            case 'quiniela-3':
                rangoMin.placeholder = 'Mín: 0';
                rangoMax.placeholder = 'Máx: 999';
                rangoMin.min = 0;
                rangoMax.max = 999;
                break;

            case 'quiniela-4':
                rangoMin.placeholder = 'Mín: 0';
                rangoMax.placeholder = 'Máx: 9999';
                rangoMin.min = 0;
                rangoMax.max = 9999;
                break;
        }
    }

    /**
     * Establece los filtros avanzados para 6 números
     */
    setFiltrosAvanzados(filtros) {
        this.filtrosAvanzados = filtros;
    }

    /**
     * Obtiene los filtros avanzados
     */
    getFiltrosAvanzados() {
        return this.filtrosAvanzados;
    }
}
