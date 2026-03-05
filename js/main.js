import { Validador } from './utils/validaciones.js';
import { UIHelper } from './utils/helpers.js';
import { ResultadosUI, GuardadosUI } from './ui/resultados.js';
import { CustomSelect } from './ui/customSelect.js';
import { FiltrosAvanzadosModal } from './ui/filtrosAvanzadosModal.js';
import { GeneradorService } from './services/GeneradorService.js';
import { AutoGeneradorService } from './services/AutoGeneradorService.js';
import { ItemAutoShuffleService } from './services/ItemAutoShuffleService.js';
import { ConfiguracionController } from './controllers/ConfiguracionController.js';
import { ResultadosController } from './controllers/ResultadosController.js';

/**
 * Aplicación principal - Orquesta todos los módulos
 */
class App {
    constructor() {
        this.initServices();
        this.initControllers();
        this.initUI();
        this.initEventListeners();
        this.resultadosController.cargarGuardados();
        
        // Inicializar visibilidad del botón de filtros avanzados
        this.toggleFiltrosAvanzadosButton('6-numeros');
    }

    /**
     * Inicializa los servicios
     */
    initServices() {
        this.generadorService = new GeneradorService();
        this.autoGeneradorService = new AutoGeneradorService();
        this.itemAutoShuffleService = new ItemAutoShuffleService();
    }

    /**
     * Inicializa los controladores
     */
    initControllers() {
        // Primero crear el select para pasarlo al controlador
        const loteriaOptions = [
            { 
                value: '6-numeros', 
                label: '6 Números (0-45)',
                description: 'Genera 6 números del 0 al 45'
            },
            { 
                value: 'quiniela-1', 
                label: 'Número de 1 Cifra',
                description: 'Del 0 al 9'
            },
            { 
                value: 'quiniela-2', 
                label: 'Número de 2 Cifras',
                description: 'Del 00 al 99'
            },
            { 
                value: 'quiniela-3', 
                label: 'Número de 3 Cifras',
                description: 'Del 000 al 999'
            },
            { 
                value: 'quiniela-4', 
                label: 'Número de 4 Cifras',
                description: 'Del 0000 al 9999'
            }
        ];

        this.tipoLoteriaSelect = new CustomSelect('tipo-loteria-container', loteriaOptions, '6-numeros');
        this.tipoLoteriaSelect.onChange = async (value) => {
            if (await this.verificarCambioConAutoActivo('cambiar el tipo de lotería')) {
                this.configuracionController.actualizarLimitesRango();
                this.toggleFiltrosAvanzadosButton(value);
            } else {
                // Revertir al valor anterior
                const valorAnterior = this.tipoLoteriaSelect.selectedValue;
                // No hacer nada, el select ya tiene el valor anterior
            }
        };

        this.configuracionController = new ConfiguracionController(this.tipoLoteriaSelect);
        
        // Actualizar estado inicial del botón de filtros avanzados
        this.actualizarEstadoBotonFiltrosAvanzados(null);
    }

    /**
     * Inicializa la UI
     */
    initUI() {
        const resultadosUI = new ResultadosUI('resultados-container');
        const guardadosUI = new GuardadosUI('guardados-container');
        this.resultadosController = new ResultadosController(resultadosUI, guardadosUI);

        // Conectar callbacks de shuffle
        resultadosUI.onShuffle = (index) => this.shuffleJugada(index);
        resultadosUI.onToggleAutoShuffle = (index, button) => this.toggleAutoShuffleJugada(index, button);
    }

    /**
     * Inicializa los event listeners
     */
    initEventListeners() {
        // Slider de cantidad
        const cantidadSlider = document.getElementById('cantidad-jugadas');
        const cantidadDisplay = document.getElementById('cantidad-display');
        let cantidadAnterior = cantidadSlider.value;
        
        cantidadSlider.addEventListener('change', async (e) => {
            if (this.autoGeneradorService.getIsRunning()) {
                const confirmado = await UIHelper.confirmar(
                    `La generación automática está activa.<br><br>
                     Si cambias la cantidad de jugadas, se detendrá la generación automática y se aplicará la nueva cantidad.<br><br>
                     ¿Deseas continuar?`
                );
                
                if (confirmado) {
                    this.toggleAutoGenerar();
                    cantidadAnterior = e.target.value;
                } else {
                    e.target.value = cantidadAnterior;
                    cantidadDisplay.textContent = cantidadAnterior;
                }
            } else {
                cantidadAnterior = e.target.value;
            }
        });
        
        cantidadSlider.addEventListener('input', (e) => {
            cantidadDisplay.textContent = e.target.value;
        });

        // Agregar número fijo
        document.getElementById('btn-agregar-fijo').addEventListener('click', () => {
            this.agregarNumeroFijo();
        });

        document.getElementById('input-numero-fijo').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.agregarNumeroFijo();
            }
        });

        // Toggle rango personalizado
        document.getElementById('usar-rango').addEventListener('change', async (e) => {
            if (await this.verificarCambioConAutoActivo('cambiar el rango personalizado')) {
                const container = document.getElementById('rango-container');
                if (e.target.checked) {
                    container.classList.remove('hidden');
                    container.classList.add('flex');
                } else {
                    container.classList.add('hidden');
                    container.classList.remove('flex');
                }
            } else {
                e.target.checked = !e.target.checked; // Revertir
            }
        });

        // Botones de filtro
        document.getElementById('filtro-auto').addEventListener('click', async () => {
            if (await this.verificarCambioConAutoActivo('cambiar el filtro')) {
                this.cambiarFiltro('auto');
            }
        });
        document.getElementById('filtro-pares').addEventListener('click', async () => {
            if (await this.verificarCambioConAutoActivo('cambiar el filtro a "Solo pares"')) {
                this.cambiarFiltro('pares');
            }
        });
        document.getElementById('filtro-impares').addEventListener('click', async () => {
            if (await this.verificarCambioConAutoActivo('cambiar el filtro a "Solo impares"')) {
                this.cambiarFiltro('impares');
            }
        });

        // Botón generar
        document.getElementById('btn-generar').addEventListener('click', () => {
            this.generarNumeros();
        });

        // Botón auto-generar
        document.getElementById('btn-auto-generar').addEventListener('click', () => {
            this.toggleAutoGenerar();
        });

        // Botón limpiar
        document.getElementById('btn-limpiar').addEventListener('click', () => {
            this.resultadosController.limpiarResultados();
        });

        // Botón limpiar guardados
        document.getElementById('btn-limpiar-guardados').addEventListener('click', () => {
            this.resultadosController.limpiarGuardados();
        });

        // Botón filtros avanzados
        document.getElementById('btn-filtros-avanzados').addEventListener('click', () => {
            this.abrirFiltrosAvanzados();
        });
    }

    /**
     * Muestra/oculta el botón de filtros avanzados según el tipo de lotería
     */
    toggleFiltrosAvanzadosButton(tipo) {
        const btn = document.getElementById('btn-filtros-avanzados');
        if (tipo === '6-numeros') {
            btn.classList.remove('hidden');
        } else {
            btn.classList.add('hidden');
        }
    }

    /**
     * Abre el modal de filtros avanzados
     */
    abrirFiltrosAvanzados() {
        const filtrosActuales = this.configuracionController.getFiltrosAvanzados();
        
        FiltrosAvanzadosModal.show(filtrosActuales, (nuevosFiltros) => {
            this.configuracionController.setFiltrosAvanzados(nuevosFiltros);
            this.actualizarEstadoBotonFiltrosAvanzados(nuevosFiltros);
            UIHelper.mostrarExito('Filtros avanzados aplicados correctamente');
        });
    }

    /**
     * Actualiza el estilo del botón de filtros avanzados según si hay filtros activos
     */
    actualizarEstadoBotonFiltrosAvanzados(filtros) {
        const btn = document.getElementById('btn-filtros-avanzados');
        
        if (!filtros || !filtros.rangos) {
            // Sin filtros - estado normal
            btn.className = 'mt-2 px-4 py-2 rounded-lg border-2 border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors text-sm font-semibold flex items-center justify-center gap-2';
            btn.innerHTML = `
                <i class="fas fa-sliders-h"></i>
                Filtros Avanzados
            `;
            return;
        }
        
        // Contar cuántos números tienen configuración personalizada
        let numerosConfigurados = 0;
        filtros.rangos.forEach(rango => {
            const esRangoDefault = rango.min === 0 && rango.max === 45;
            const esFiltroDefault = rango.filtro === 'auto';
            const tieneNumeroFijo = rango.numeroFijo !== null && rango.numeroFijo !== undefined;
            
            if (!esRangoDefault || !esFiltroDefault || tieneNumeroFijo) {
                numerosConfigurados++;
            }
        });
        
        if (numerosConfigurados > 0) {
            // Con filtros activos - estado destacado
            btn.className = 'mt-2 px-4 py-2 rounded-lg border-2 border-primary bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/30';
            btn.innerHTML = `
                <i class="fas fa-sliders-h"></i>
                Filtros Avanzados
                <span class="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-xs font-bold">${numerosConfigurados}</span>
            `;
        } else {
            // Sin filtros personalizados - estado normal
            btn.className = 'mt-2 px-4 py-2 rounded-lg border-2 border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors text-sm font-semibold flex items-center justify-center gap-2';
            btn.innerHTML = `
                <i class="fas fa-sliders-h"></i>
                Filtros Avanzados
            `;
        }
    }

    /**
     * Verifica si hay auto-generación activa antes de permitir cambios
     */
    async verificarCambioConAutoActivo(accion) {
        if (this.autoGeneradorService.getIsRunning()) {
            const confirmado = await UIHelper.confirmar(
                `La generación automática está activa.<br><br>
                 Si ${accion}, se detendrá la generación automática y se aplicarán los nuevos cambios.<br><br>
                 ¿Deseas continuar?`
            );
            
            if (confirmado) {
                // Detener auto-generación
                this.toggleAutoGenerar();
                return true;
            }
            return false;
        }
        return true;
    }

    /**
     * Agrega un número fijo
     */
    agregarNumeroFijo() {
        const input = document.getElementById('input-numero-fijo');
        const valor = input.value.trim();
        
        if (this.configuracionController.agregarNumeroFijo(valor)) {
            this.renderizarNumerosFijos();
            input.value = '';
            input.focus();
        }
    }

    /**
     * Elimina un número fijo
     */
    eliminarNumeroFijo(numero) {
        this.configuracionController.eliminarNumeroFijo(numero);
        this.renderizarNumerosFijos();
    }

    /**
     * Renderiza los números fijos en la UI
     */
    renderizarNumerosFijos() {
        const container = document.getElementById('lista-numeros-fijos');
        const numerosFijos = this.configuracionController.getNumerosFijos();
        
        if (numerosFijos.length === 0) {
            container.innerHTML = '<span class="text-xs text-slate-400">Sin números fijos</span>';
            return;
        }

        container.innerHTML = '';
        numerosFijos.forEach(num => {
            const tag = document.createElement('span');
            tag.className = 'inline-flex items-center gap-1 px-2 py-1 rounded bg-primary text-white text-xs font-bold';
            tag.innerHTML = `
                ${num}
                <i class="fas fa-times text-[10px] cursor-pointer hover:text-red-200" onclick="app.eliminarNumeroFijo(${num})"></i>
            `;
            container.appendChild(tag);
        });
    }

    /**
     * Cambia el filtro par/impar
     */
    cambiarFiltro(filtro) {
        this.configuracionController.setFiltro(filtro);
        
        const botones = {
            'auto': document.getElementById('filtro-auto'),
            'pares': document.getElementById('filtro-pares'),
            'impares': document.getElementById('filtro-impares')
        };

        Object.keys(botones).forEach(key => {
            const btn = botones[key];
            if (key === filtro) {
                btn.className = 'p-2 text-xs font-bold rounded-lg border border-primary/20 bg-primary/10 text-primary';
            } else {
                btn.className = 'p-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-primary/10 hover:bg-primary/5';
            }
        });
    }

    /**
     * Genera números manualmente
     */
    generarNumeros() {
        try {
            const config = this.configuracionController.obtenerConfiguracion();
            const cantidad = this.configuracionController.obtenerCantidadJugadas();
            
            const validacionCantidad = Validador.validarCantidadJugadas(cantidad);
            if (!validacionCantidad.valido) {
                UIHelper.mostrarError(validacionCantidad.mensaje);
                return;
            }

            const jugadas = this.generadorService.generarJugadas(config, validacionCantidad.cantidad);
            this.resultadosController.mostrarResultados(jugadas);

        } catch (error) {
            UIHelper.mostrarError(error.message);
        }
    }

    /**
     * Toggle auto-generación
     */
    toggleAutoGenerar() {
        const btn = document.getElementById('btn-auto-generar');
        const icon = document.getElementById('auto-icon');
        const text = document.getElementById('auto-text');

        if (this.autoGeneradorService.getIsRunning()) {
            // Detener
            this.autoGeneradorService.stop();
            icon.className = 'fas fa-play text-2xl';
            text.textContent = 'AUTO';
            btn.classList.remove('bg-red-500/80', 'hover:bg-red-600/80');
            btn.classList.add('bg-white/20', 'hover:bg-white/30');
        } else {
            // Iniciar
            const cantidadJugadas = this.configuracionController.obtenerCantidadJugadas();
            
            this.autoGeneradorService.start(() => {
                try {
                    const config = this.configuracionController.obtenerConfiguracion();
                    const jugadas = this.generadorService.generarJugadas(config, cantidadJugadas);
                    
                    // Reemplazar manteniendo la cantidad configurada
                    this.resultadosController.reemplazarResultados(jugadas, cantidadJugadas);
                } catch (error) {
                    this.autoGeneradorService.stop();
                    UIHelper.mostrarError(error.message);
                    // Restaurar botón
                    icon.className = 'fas fa-play text-2xl';
                    text.textContent = 'AUTO';
                    btn.classList.remove('bg-red-500/80', 'hover:bg-red-600/80');
                    btn.classList.add('bg-white/20', 'hover:bg-white/30');
                }
            });
            
            icon.className = 'fas fa-stop text-2xl';
            text.textContent = 'STOP';
            btn.classList.remove('bg-white/20', 'hover:bg-white/30');
            btn.classList.add('bg-red-500/80', 'hover:bg-red-600/80');
        }
    }

    /**
     * Mezcla los números de una jugada específica
     */
    async shuffleJugada(index) {
        // Verificar si el auto-generador está activo
        if (this.autoGeneradorService.getIsRunning()) {
            const confirmado = await UIHelper.confirmar(
                `La generación automática está activa.<br><br>
                 Si mezclas los números manualmente, se detendrá la generación automática.<br><br>
                 ¿Deseas continuar?`
            );
            
            if (!confirmado) return;
            
            // Detener auto-generación
            this.toggleAutoGenerar();
        }

        const jugadas = this.resultadosController.resultadosActuales;
        if (!jugadas[index]) return;

        const jugada = jugadas[index];
        
        // Mezclar el array de números
        const numerosArray = Array.isArray(jugada.numeros) ? [...jugada.numeros] : [];
        
        // Fisher-Yates shuffle
        for (let i = numerosArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numerosArray[i], numerosArray[j]] = [numerosArray[j], numerosArray[i]];
        }
        
        jugada.numeros = numerosArray;
        
        // Re-renderizar solo ese item
        this.resultadosController.mostrarResultados(jugadas);
    }

    /**
     * Toggle auto-shuffle para una jugada específica
     */
    async toggleAutoShuffleJugada(index, button) {
        // Verificar si el auto-generador está activo
        if (this.autoGeneradorService.getIsRunning()) {
            const confirmado = await UIHelper.confirmar(
                `La generación automática está activa.<br><br>
                 Si activas la mezcla automática de este item, se detendrá la generación automática global.<br><br>
                 ¿Deseas continuar?`
            );
            
            if (!confirmado) return;
            
            // Detener auto-generación
            this.toggleAutoGenerar();
        }

        const isRunning = this.itemAutoShuffleService.isRunning(index);
        
        if (isRunning) {
            // Detener
            this.itemAutoShuffleService.stop(index);
            this.resultadosController.resultadosUI.updateAutoShuffleButton(index, false);
        } else {
            // Iniciar
            this.itemAutoShuffleService.start(index, (itemIndex) => {
                this.shuffleJugadaSinValidacion(itemIndex);
            });
            this.resultadosController.resultadosUI.updateAutoShuffleButton(index, true);
        }
    }

    /**
     * Mezcla sin validación (para uso interno del auto-shuffle)
     */
    shuffleJugadaSinValidacion(index) {
        const jugadas = this.resultadosController.resultadosActuales;
        if (!jugadas[index]) return;

        const jugada = jugadas[index];
        
        // Mezclar el array de números
        const numerosArray = Array.isArray(jugada.numeros) ? [...jugada.numeros] : [];
        
        // Fisher-Yates shuffle
        for (let i = numerosArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numerosArray[i], numerosArray[j]] = [numerosArray[j], numerosArray[i]];
        }
        
        jugada.numeros = numerosArray;
        
        // Re-renderizar solo ese item
        this.resultadosController.mostrarResultados(jugadas);
    }
}

// Inicializar app
const app = new App();
window.app = app; // Para acceso global desde HTML
