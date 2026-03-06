import { Validador } from './utils/validaciones.js';
import { UIHelper } from './utils/helpers.js';
import { ResultadosUI, GuardadosUI } from './ui/resultados.js';
import { CustomSelect } from './ui/customSelect.js';
import { FiltrosAvanzadosModal } from './ui/filtrosAvanzadosModal.js';
import ResultadosQuini6Modal from './ui/resultadosQuini6Modal.js';
import ResultadosQuinielaModal from './ui/resultadosQuinielaModal.js';
import { GeneradorService } from './services/GeneradorService.js';
import { GeneradorInteligenteService } from './services/GeneradorInteligenteService.js';
import { AutoGeneradorService } from './services/AutoGeneradorService.js';
import { ItemAutoShuffleService } from './services/ItemAutoShuffleService.js';
import { ConfiguracionController } from './controllers/ConfiguracionController.js';
import { ResultadosController } from './controllers/ResultadosController.js';

/**
 * Aplicación principal - Orquesta todos los módulos
 */
class App {
    constructor() {
        this.init();
    }

    async init() {
        console.log('🔧 [DEBUG] Iniciando servicios...');
        this.initServices();
        
        console.log('🔧 [DEBUG] Iniciando controladores...');
        this.initControllers();
        
        console.log('🔧 [DEBUG] Iniciando UI...');
        this.initUI();
        
        console.log('🔧 [DEBUG] Iniciando event listeners...');
        this.initEventListeners();
        
        console.log('🔧 [DEBUG] Cargando guardados...');
        this.resultadosController.cargarGuardados();
        
        // Inicializar variables de control
        this.generandoNumeros = false;
        
        console.log('🔧 [DEBUG] Configurando filtros avanzados...');
        // Inicializar visibilidad del botón de filtros avanzados y generadores inteligentes
        this.toggleFiltrosAvanzadosButton('6-numeros');
        await this.toggleGeneradoresInteligentes('6-numeros');
        
        // Actualizar estado inicial del botón de filtros avanzados
        this.actualizarEstadoBotonFiltrosAvanzados(null);
        
        console.log('✅ [DEBUG] Inicialización completa');
    }

    /**
     * Inicializa los servicios
     */
    initServices() {
        this.generadorService = new GeneradorService();
        this.generadorInteligenteService = new GeneradorInteligenteService();
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
                await this.toggleGeneradoresInteligentes(value);
            } else {
                // Revertir al valor anterior
                const valorAnterior = this.tipoLoteriaSelect.selectedValue;
                // No hacer nada, el select ya tiene el valor anterior
            }
        };

        this.configuracionController = new ConfiguracionController(this.tipoLoteriaSelect);
    }

    /**
     * Inicializa la UI
     */
    initUI() {
        console.log('🎨 [DEBUG] Inicializando UI...');
        
        try {
            console.log('🔧 [DEBUG] Creando ResultadosUI...');
            const resultadosUI = new ResultadosUI('resultados-container');
            console.log('🔧 [DEBUG] ResultadosUI creado:', resultadosUI);
            
            console.log('🔧 [DEBUG] Creando GuardadosUI...');
            const guardadosUI = new GuardadosUI('guardados-container');
            console.log('🔧 [DEBUG] GuardadosUI creado:', guardadosUI);
            
            if (!resultadosUI.container) {
                console.error('❌ [DEBUG] FALLO CRÍTICO: ResultadosUI no se inicializó correctamente');
                return;
            }
            
            console.log('🔧 [DEBUG] Creando ResultadosController...');
            this.resultadosController = new ResultadosController(resultadosUI, guardadosUI);
            console.log('✅ [DEBUG] ResultadosController creado');

            // Conectar callbacks de shuffle
            resultadosUI.onShuffle = (index) => this.shuffleJugada(index);
            resultadosUI.onToggleAutoShuffle = (index, button) => this.toggleAutoShuffleJugada(index, button);

            // Inicializar modales de resultados
            this.resultadosQuini6Modal = new ResultadosQuini6Modal();
            this.resultadosQuinielaModal = new ResultadosQuinielaModal();
            
            console.log('✅ [DEBUG] UI inicializada completamente');
            
        } catch (error) {
            console.error('❌ [DEBUG] ERROR CRÍTICO en initUI:', error);
        }
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
        const btnGenerar = document.getElementById('btn-generar');
        if (btnGenerar) {
            console.log('✅ [DEBUG] Botón generar encontrado, agregando listener');
            btnGenerar.addEventListener('click', () => {
                console.log('🎯 [DEBUG] Click en botón generar');
                this.generarNumeros();
            });
        } else {
            console.error('❌ [DEBUG] Botón generar NO encontrado');
        }

        // Botón auto-generar
        const btnAutoGenerar = document.getElementById('btn-auto-generar');
        if (btnAutoGenerar) {
            console.log('✅ [DEBUG] Botón auto-generar encontrado, agregando listener');
            btnAutoGenerar.addEventListener('click', () => {
                console.log('🎯 [DEBUG] Click en botón auto-generar');
                this.toggleAutoGenerar();
            });
        } else {
            console.error('❌ [DEBUG] Botón auto-generar NO encontrado');
        }

        // Botón limpiar
        const btnLimpiar = document.getElementById('btn-limpiar');
        if (btnLimpiar) {
            console.log('✅ [DEBUG] Botón limpiar encontrado, agregando listener');
            btnLimpiar.addEventListener('click', () => {
                console.log('🎯 [DEBUG] Click en botón limpiar');
                this.resultadosController.limpiarResultados();
            });
        } else {
            console.error('❌ [DEBUG] Botón limpiar NO encontrado');
        }

        // Botón limpiar guardados
        document.getElementById('btn-limpiar-guardados').addEventListener('click', () => {
            this.resultadosController.limpiarGuardados();
        });

        // Botón filtros avanzados
        document.getElementById('btn-filtros-avanzados').addEventListener('click', () => {
            this.abrirFiltrosAvanzados();
        });

        // Botones generadores inteligentes (verificar que existan)
        const btnFrecuenciaAlta = document.getElementById('btn-frecuencia-alta');
        if (btnFrecuenciaAlta) {
            btnFrecuenciaAlta.addEventListener('click', () => {
                this.generarNumerosInteligentes('frecuencia-alta');
            });
        }
        
        const btnFrecuenciaBaja = document.getElementById('btn-frecuencia-baja');
        if (btnFrecuenciaBaja) {
            btnFrecuenciaBaja.addEventListener('click', () => {
                this.generarNumerosInteligentes('frecuencia-baja');
            });
        }
        
        const btnTemporalAscendente = document.getElementById('btn-temporal-ascendente');
        if (btnTemporalAscendente) {
            btnTemporalAscendente.addEventListener('click', () => {
                this.generarNumerosInteligentes('temporal-ascendente');
            });
        }
        
        const btnTemporalDescendente = document.getElementById('btn-temporal-descendente');
        if (btnTemporalDescendente) {
            btnTemporalDescendente.addEventListener('click', () => {
                this.generarNumerosInteligentes('temporal-descendente');
            });
        }
        
        const btnDistribucion = document.getElementById('btn-distribucion');
        if (btnDistribucion) {
            btnDistribucion.addEventListener('click', () => {
                this.generarNumerosInteligentes('distribucion');
            });
        }
        
        const btnHibridoEquilibrado = document.getElementById('btn-hibrido-equilibrado');
        if (btnHibridoEquilibrado) {
            btnHibridoEquilibrado.addEventListener('click', () => {
                this.generarNumerosInteligentes('hibrido-equilibrado');
            });
        }
        
        const btnHibridoAgresivo = document.getElementById('btn-hibrido-agresivo');
        if (btnHibridoAgresivo) {
            btnHibridoAgresivo.addEventListener('click', () => {
                this.generarNumerosInteligentes('hibrido-agresivo');
            });
        }
        
        const btnAntiCrowd = document.getElementById('btn-anti-crowd');
        if (btnAntiCrowd) {
            btnAntiCrowd.addEventListener('click', () => {
                this.generarNumerosInteligentes('anti-crowd');
            });
        }

        // Botón toggle acordeón generadores inteligentes
        const btnToggleGeneradores = document.getElementById('btn-toggle-generadores');
        if (btnToggleGeneradores) {
            btnToggleGeneradores.addEventListener('click', () => {
                this.toggleAcordeonGeneradores();
            });
        }

        // Botones de resultados (verificar que existan)
        const btnResultadosQuini6 = document.getElementById('btn-ver-resultados-quini6');
        if (btnResultadosQuini6) {
            btnResultadosQuini6.addEventListener('click', () => {
                this.resultadosQuini6Modal.mostrar();
            });
        }
        
        const btnResultadosQuiniela = document.getElementById('btn-ver-resultados-quiniela');
        if (btnResultadosQuiniela) {
            btnResultadosQuiniela.addEventListener('click', () => {
                this.resultadosQuinielaModal.mostrar();
            });
        }
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
     * Toggle del acordeón de generadores inteligentes
     */
    toggleAcordeonGeneradores() {
        const contenido = document.getElementById('contenido-generadores');
        const icono = document.getElementById('icono-acordeon');
        
        if (contenido && icono) {
            if (contenido.classList.contains('hidden')) {
                contenido.classList.remove('hidden');
                icono.classList.add('rotate-180');
            } else {
                contenido.classList.add('hidden');
                icono.classList.remove('rotate-180');
            }
        }
    }
    async toggleGeneradoresInteligentes(tipo) {
        const container = document.getElementById('generadores-inteligentes');
        if (tipo === '6-numeros') {
            container.classList.remove('hidden');
            
            try {
                await this.generadorInteligenteService.cargarDatosHistoricos();
            } catch (error) {
                console.error('❌ [DEBUG] Error cargando datos:', error);
            }
        } else {
            container.classList.add('hidden');
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
            btn.className = 'btn-filtros-avanzados';
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
            btn.className = 'btn-filtros-avanzados filtros-activos';
            btn.innerHTML = `
                <i class="fas fa-sliders-h"></i>
                Filtros Avanzados
                <span class="filtros-badge">${numerosConfigurados}</span>
            `;
        } else {
            // Sin filtros personalizados - estado normal
            btn.className = 'btn-filtros-avanzados';
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
            container.innerHTML = '<span class="numeros-fijos-empty">Sin números fijos</span>';
            return;
        }

        container.innerHTML = '';
        numerosFijos.forEach(num => {
            const tag = document.createElement('span');
            tag.className = 'numero-fijo-chip';
            tag.innerHTML = `
                ${num}
                <button class="remove-btn" onclick="app.eliminarNumeroFijo(${num})">
                    <i class="fas fa-times"></i>
                </button>
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
                btn.className = 'filtro-btn filtro-active';
            } else {
                btn.className = 'filtro-btn';
            }
        });
    }

    /**
     * Genera números manualmente
     */
    generarNumeros() {
        console.log('🎲 [DEBUG] Iniciando generación de números...');
        try {
            const config = this.configuracionController.obtenerConfiguracion();
            console.log('🔍 [DEBUG] Configuración obtenida:', config);
            
            const cantidad = this.configuracionController.obtenerCantidadJugadas();
            console.log('🔍 [DEBUG] Cantidad de jugadas:', cantidad);
            
            const validacionCantidad = Validador.validarCantidadJugadas(cantidad);
            if (!validacionCantidad.valido) {
                console.error('❌ [DEBUG] Validación cantidad falló:', validacionCantidad.mensaje);
                UIHelper.mostrarError(validacionCantidad.mensaje);
                return;
            }

            console.log('🎯 [DEBUG] Generando jugadas...');
            const jugadas = this.generadorService.generarJugadas(config, validacionCantidad.cantidad);
            console.log('✅ [DEBUG] Jugadas generadas:', jugadas);
            
            this.resultadosController.mostrarResultados(jugadas);
            console.log('✅ [DEBUG] Resultados mostrados');

        } catch (error) {
            console.error('❌ [DEBUG] Error en generarNumeros:', error);
            UIHelper.mostrarError(error.message);
        }
    }

    /**
     * Genera números usando algoritmos inteligentes
     */
    async generarNumerosInteligentes(algoritmo) {
        const loadingElement = document.getElementById('loading-generador');
        
        // Prevenir múltiples clicks
        if (this.generandoNumeros) {
            return;
        }
        
        try {
            // Bloquear nuevas generaciones
            this.generandoNumeros = true;
            this.deshabilitarBotonesGeneradores(true);
            
            // Mostrar loading
            loadingElement.classList.remove('hidden');
            
            // Verificar si hay auto-generación activa
            if (this.autoGeneradorService.getIsRunning()) {
                const confirmado = await UIHelper.confirmar(
                    `La generación automática está activa.<br><br>
                     Si generas números inteligentes, se detendrá la generación automática.<br><br>
                     ¿Deseas continuar?`
                );
                
                if (!confirmado) {
                    return;
                }
                
                this.toggleAutoGenerar();
            }

            // Generar números inteligentes
            const resultado = await this.generadorInteligenteService.generarNumeros(algoritmo);
            const jugada = this.generadorInteligenteService.convertirAJugada(resultado);
            
            // Mostrar resultado
            this.resultadosController.mostrarResultados([jugada]);
            
            // Mostrar modal con información del algoritmo
            const descripcion = this.generadorInteligenteService.getDescripcionAlgoritmo(algoritmo);
            const icono = this.generadorInteligenteService.getIconoAlgoritmo(algoritmo);
            const autor = this.generadorInteligenteService.getAutorAlgoritmo(algoritmo);
            const totalSorteos = this.generadorInteligenteService.datosHistoricos.length;
            
            // Convertir nombre del algoritmo a formato legible
            const nombreAlgoritmo = algoritmo
                .split('-')
                .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
                .join(' ');
            
            const mensajeDetallado = `
                <div class="modal-content-algoritmo">
                    <div class="modal-algoritmo-icon">${icono}</div>
                    <div class="modal-algoritmo-title">Algoritmo: ${nombreAlgoritmo}</div>
                    <div class="modal-algoritmo-description">${descripcion}</div>
                    
                    <!-- Números generados -->
                    <div class="modal-numeros-section">
                        <div class="modal-numeros-header">
                            <div class="modal-numeros-title">🎲 Números generados</div>
                            <button id="btn-regenerar-modal" class="modal-btn-regenerar" title="Regenerar con el mismo algoritmo">
                                <i class="fas fa-redo"></i>
                                Regenerar
                            </button>
                        </div>
                        <div id="numeros-generados-modal" class="modal-numeros-display">
                            ${resultado.numeros.map(num => 
                                `<span class="modal-numero">${num}</span>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div class="modal-datos-section">
                        <div class="modal-datos-header">
                            <div class="modal-datos-title"><i class="fas fa-chart-bar"></i> Datos analizados</div>
                            <a href="quini6.html" target="_blank" class="modal-datos-link" title="Ver datos históricos de Quini 6">
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                        </div>
                        <div class="modal-datos-text">${totalSorteos} sorteos históricos</div>
                    </div>
                    
                    <!-- Advertencia importante -->
                    <div class="modal-warning-section">
                        <div class="modal-warning-content">
                            <i class="fas fa-info-circle modal-warning-icon"></i>
                            <div class="modal-warning-text">
                                <div class="modal-warning-title">Importante:</div>
                                <div>Los algoritmos analizan patrones históricos. Cada sorteo es independiente y aleatorio.</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-success-text">
                        Números generados exitosamente
                    </div>
                    <div class="modal-author-section">
                        <i class="fas fa-graduation-cap"></i> ${autor}
                    </div>
                </div>
            `;
            
            UIHelper.mostrarExito(mensajeDetallado);
            
            // Agregar event listener al botón de regenerar
            setTimeout(() => {
                const btnRegenerar = document.getElementById('btn-regenerar-modal');
                if (btnRegenerar) {
                    btnRegenerar.addEventListener('click', async () => {
                        // Deshabilitar botón durante regeneración
                        btnRegenerar.disabled = true;
                        btnRegenerar.innerHTML = '<i class="fas fa-spinner fa-spin text-xs"></i> Generando...';
                        
                        try {
                            // Regenerar números con el mismo algoritmo
                            const nuevoResultado = await this.generadorInteligenteService.generarNumeros(algoritmo);
                            const nuevaJugada = this.generadorInteligenteService.convertirAJugada(nuevoResultado);
                            
                            // Actualizar resultados en la UI principal
                            this.resultadosController.mostrarResultados([nuevaJugada]);
                            
                            // Actualizar números en el modal usando ID específico
                            const numerosContainer = document.getElementById('numeros-generados-modal');
                            
                            if (numerosContainer) {
                                numerosContainer.innerHTML = nuevoResultado.numeros.map(num => 
                                    `<span class="modal-numero">${num}</span>`
                                ).join('');
                            }
                            
                            // Actualizar estadísticas si existen
                            const estadisticasElements = document.querySelectorAll('.swal2-html-container [class*="text-slate-600"]');
                            estadisticasElements.forEach(el => {
                                if (el.textContent.includes('sorteos históricos')) {
                                    // Mantener el texto de sorteos históricos
                                } else if (el.textContent.includes('puntuación') && nuevoResultado.estadisticas.puntuacion) {
                                    el.textContent = `Puntuación: ${nuevoResultado.estadisticas.puntuacion}`;
                                }
                            });
                            
                        } catch (error) {
                            console.error('Error regenerando números:', error);
                            UIHelper.mostrarError('Error al regenerar números');
                        } finally {
                            // Restaurar botón
                            btnRegenerar.disabled = false;
                            btnRegenerar.innerHTML = '<i class="fas fa-redo"></i> Regenerar';
                        }
                    });
                }
            }, 100);

        } catch (error) {
            console.error('Error generando números inteligentes:', error);
            UIHelper.mostrarError(`Error al generar números inteligentes: ${error.message}`);
        } finally {
            // Desbloquear generaciones
            this.generandoNumeros = false;
            this.deshabilitarBotonesGeneradores(false);
            
            // Ocultar loading
            loadingElement.classList.add('hidden');
        }
    }

    /**
     * Deshabilita/habilita todos los botones de generadores inteligentes
     */
    deshabilitarBotonesGeneradores(deshabilitar) {
        const botones = [
            'btn-frecuencia-alta',
            'btn-frecuencia-baja', 
            'btn-temporal-ascendente',
            'btn-temporal-descendente',
            'btn-distribucion',
            'btn-hibrido-equilibrado',
            'btn-hibrido-agresivo',
            'btn-anti-crowd'
        ];

        botones.forEach(id => {
            const boton = document.getElementById(id);
            if (boton) {
                if (deshabilitar) {
                    boton.disabled = true;
                    boton.classList.add('opacity-50', 'cursor-not-allowed');
                    boton.classList.remove('hover:bg-primary/5');
                } else {
                    boton.disabled = false;
                    boton.classList.remove('opacity-50', 'cursor-not-allowed');
                    boton.classList.add('hover:bg-primary/5');
                }
            }
        });
    }

    /**
     * Toggle auto-generación
     */
    toggleAutoGenerar() {
        console.log('🔄 [DEBUG] Toggle auto generar iniciado');
        
        const btn = document.getElementById('btn-auto-generar');
        const icon = document.getElementById('auto-icon');
        const text = document.getElementById('auto-text');

        if (!btn || !icon || !text) {
            console.error('❌ [DEBUG] Elementos auto-generar no encontrados:', { btn: !!btn, icon: !!icon, text: !!text });
            return;
        }

        if (this.autoGeneradorService.getIsRunning()) {
            console.log('🛑 [DEBUG] Deteniendo auto-generador');
            // Detener
            this.autoGeneradorService.stop();
            icon.className = 'fas fa-play auto-icon';
            text.textContent = 'AUTO';
            btn.classList.remove('auto-active');
        } else {
            console.log('▶️ [DEBUG] Iniciando auto-generador');
            // Iniciar
            const cantidadJugadas = this.configuracionController.obtenerCantidadJugadas();
            console.log('🔍 [DEBUG] Cantidad jugadas para auto:', cantidadJugadas);
            
            this.autoGeneradorService.start(() => {
                try {
                    console.log('🎲 [DEBUG] Ejecutando auto-generación...');
                    const config = this.configuracionController.obtenerConfiguracion();
                    const jugadas = this.generadorService.generarJugadas(config, cantidadJugadas);
                    
                    // Reemplazar manteniendo la cantidad configurada
                    this.resultadosController.reemplazarResultados(jugadas, cantidadJugadas);
                    console.log('✅ [DEBUG] Auto-generación completada');
                } catch (error) {
                    console.error('❌ [DEBUG] Error en auto-generación:', error);
                    this.autoGeneradorService.stop();
                    UIHelper.mostrarError(error.message);
                    // Restaurar botón
                    icon.className = 'fas fa-play auto-icon';
                    text.textContent = 'AUTO';
                    btn.classList.remove('auto-active');
                }
            });
            
            icon.className = 'fas fa-stop auto-icon';
            text.textContent = 'STOP';
            btn.classList.add('auto-active');
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

// Inicializar app cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 [DEBUG] DOM cargado, inicializando app...');
    try {
        const app = new App();
        window.app = app; // Para acceso global desde HTML
        console.log('✅ [DEBUG] App inicializada correctamente');
    } catch (error) {
        console.error('❌ [DEBUG] Error inicializando app:', error);
    }
});
