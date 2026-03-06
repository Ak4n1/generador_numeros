import { StorageHelper, UIHelper } from '../utils/helpers.js';

/**
 * Controlador para manejar los resultados y guardados
 */
export class ResultadosController {
    constructor(resultadosUI, guardadosUI) {
        this.resultadosUI = resultadosUI;
        this.guardadosUI = guardadosUI;
        this.resultadosActuales = [];

        // Configurar callbacks
        this.resultadosUI.onGuardar = (jugada) => this.guardarJugada(jugada);
        this.guardadosUI.onEliminar = (id) => this.eliminarGuardado(id);
    }

    /**
     * Muestra los resultados generados
     */
    mostrarResultados(jugadas) {
        console.log('🎮 [DEBUG] ResultadosController.mostrarResultados llamado con:', jugadas);
        console.log('🎮 [DEBUG] this.resultadosUI:', this.resultadosUI);
        
        this.resultadosActuales = jugadas;
        
        console.log('🎮 [DEBUG] Llamando a resultadosUI.renderizar...');
        this.resultadosUI.renderizar(jugadas);
        console.log('🎮 [DEBUG] resultadosUI.renderizar completado');
    }

    /**
     * Agrega un resultado a los existentes (para modo auto)
     */
    agregarResultado(jugada, maxResultados = 20) {
        this.resultadosActuales.unshift(jugada); // Agregar al inicio
        
        // Limitar según maxResultados
        if (this.resultadosActuales.length > maxResultados) {
            this.resultadosActuales = this.resultadosActuales.slice(0, maxResultados);
        }
        
        this.resultadosUI.renderizar(this.resultadosActuales);
    }

    /**
     * Reemplaza el último resultado (para modo auto con cantidad fija)
     */
    reemplazarResultados(jugadas, mantenerCantidad) {
        if (mantenerCantidad) {
            // Agregar al inicio y mantener solo la cantidad especificada
            this.resultadosActuales = [...jugadas, ...this.resultadosActuales];
            this.resultadosActuales = this.resultadosActuales.slice(0, mantenerCantidad);
        } else {
            this.resultadosActuales = jugadas;
        }
        
        this.resultadosUI.renderizar(this.resultadosActuales);
    }

    /**
     * Limpia todos los resultados
     */
    limpiarResultados() {
        this.resultadosActuales = [];
        this.resultadosUI.limpiar();
    }

    /**
     * Guarda una jugada en favoritos
     */
    guardarJugada(jugada) {
        try {
            StorageHelper.guardar(jugada);
            UIHelper.mostrarExito('Números guardados correctamente');
            this.cargarGuardados();
        } catch (error) {
            UIHelper.mostrarError('Error al guardar: ' + error.message);
        }
    }

    /**
     * Carga los números guardados
     */
    cargarGuardados() {
        const guardados = StorageHelper.obtenerTodos();
        this.guardadosUI.renderizar(guardados);
    }

    /**
     * Elimina un guardado
     */
    async eliminarGuardado(id) {
        const confirmado = await UIHelper.confirmar('¿Estás seguro de eliminar estos números?');
        if (confirmado) {
            StorageHelper.eliminar(id);
            UIHelper.mostrarExito('Números eliminados correctamente');
            this.cargarGuardados();
        }
    }

    /**
     * Limpia todos los guardados
     */
    async limpiarGuardados() {
        const confirmado = await UIHelper.confirmar('¿Estás seguro de eliminar TODOS los números guardados? Esta acción no se puede deshacer.');
        if (confirmado) {
            StorageHelper.limpiarTodos();
            UIHelper.mostrarExito('Todos los números guardados fueron eliminados');
            this.cargarGuardados();
        }
    }

    /**
     * Hace scroll a la sección de resultados
     */
    scrollToResultados() {
        const resultadosSection = document.getElementById('resultados-container');
        if (resultadosSection) {
            resultadosSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}
