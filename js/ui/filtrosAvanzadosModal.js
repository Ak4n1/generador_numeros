/**
 * Modal de filtros avanzados para 6 números
 */
import { UIHelper } from '../utils/helpers.js';

export class FiltrosAvanzadosModal {
    static show(filtrosActuales = null, onConfirm) {
        // Valores por defecto
        const defaults = filtrosActuales || {
            rangos: [
                { min: 0, max: 45, filtro: 'auto', multiplo: null, numeroFijo: null },
                { min: 0, max: 45, filtro: 'auto', multiplo: null, numeroFijo: null },
                { min: 0, max: 45, filtro: 'auto', multiplo: null, numeroFijo: null },
                { min: 0, max: 45, filtro: 'auto', multiplo: null, numeroFijo: null },
                { min: 0, max: 45, filtro: 'auto', multiplo: null, numeroFijo: null },
                { min: 0, max: 45, filtro: 'auto', multiplo: null, numeroFijo: null }
            ]
        };

        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.style.animation = 'fadeIn 0.2s ease';

        // Crear modal
        const modal = document.createElement('div');
        modal.className = 'modal-large';
        modal.style.animation = 'slideUp 0.3s ease';

        modal.innerHTML = `
            <div class="modal-header-advanced">
                <div class="modal-header-content">
                    <div class="modal-header-info">
                        <div class="modal-header-icon">
                            <i class="fas fa-sliders-h text-primary"></i>
                        </div>
                        <div>
                            <h3 class="modal-title-advanced">Filtros Avanzados</h3>
                            <p class="modal-subtitle">Configura el rango de cada número</p>
                        </div>
                    </div>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <div class="modal-body-advanced custom-scrollbar">
                <!-- Info -->
                <div class="info-box">
                    <div class="info-box-content">
                        <i class="fas fa-info-circle info-box-icon"></i>
                        <div class="info-box-text">
                            <p class="info-box-title">¿Cómo funciona?</p>
                            <p>Define el rango de cada uno de los 6 números. Por ejemplo, el primer número puede salir entre 0-10, el segundo entre 11-20, etc.</p>
                        </div>
                    </div>
                </div>

                <!-- Botones de acción rápida -->
                <div class="presets-section">
                    <h4 class="presets-title">
                        <i class="fas fa-magic text-primary"></i>
                        Presets
                    </h4>
                    
                    <div class="presets-grid">
                        <button class="preset-btn" data-preset="reset">
                            <i class="fas fa-undo text-xs mr-2"></i>
                            Resetear Todo
                        </button>
                        <button class="preset-btn" data-preset="distribuido">
                            <i class="fas fa-chart-bar text-xs mr-2"></i>
                            Distribuido
                        </button>
                    </div>
                </div>

                <!-- Rangos de números -->
                <div class="rangos-section">
                    <h4 class="rangos-title">
                        <i class="fas fa-hashtag text-primary"></i>
                        Rangos por Número
                    </h4>
                    
                    <div class="rangos-grid">
                        ${defaults.rangos.map((rango, index) => `
                            <div class="numero-card">
                                <div class="numero-card-header">
                                    <label class="numero-label">
                                        Número ${index + 1}
                                    </label>
                                    <button class="reset-numero-btn" data-index="${index}" title="Resetear este número">
                                        <i class="fas fa-undo text-xs"></i>
                                    </button>
                                </div>
                                
                                <!-- Toggle Número Fijo -->
                                <div class="numero-fijo-toggle-container">
                                    <label class="toggle-label">
                                        <input 
                                            type="checkbox" 
                                            class="numero-fijo-toggle toggle-input" 
                                            ${rango.numeroFijo !== null && rango.numeroFijo !== undefined ? 'checked' : ''}
                                            data-index="${index}"
                                        />
                                        <div class="toggle-slider"></div>
                                        <span class="toggle-text">Número fijo</span>
                                    </label>
                                </div>
                                
                                <!-- Input Número Fijo -->
                                <div class="numero-fijo-container ${rango.numeroFijo !== null && rango.numeroFijo !== undefined ? '' : 'hidden'}" data-index="${index}">
                                    <label class="numero-fijo-label">Número fijo:</label>
                                    <div class="numero-fijo-input-group">
                                        <button class="decrement-btn" data-target="numero-fijo-input" data-index="${index}">
                                            <i class="fas fa-minus text-xs"></i>
                                        </button>
                                        <input 
                                            type="number" 
                                            class="numero-fijo-input numero-input"
                                            min="0" 
                                            max="45" 
                                            value="${rango.numeroFijo !== null && rango.numeroFijo !== undefined ? rango.numeroFijo : 0}"
                                            data-index="${index}"
                                        />
                                        <button class="increment-btn" data-target="numero-fijo-input" data-index="${index}">
                                            <i class="fas fa-plus text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <!-- Rangos y Filtros (ocultos si número fijo está activo) -->
                                <div class="rangos-filtros-container ${rango.numeroFijo !== null && rango.numeroFijo !== undefined ? 'hidden' : ''}" data-index="${index}">
                                    <div class="rango-inputs-group">
                                        <div class="rango-input-container">
                                            <label class="rango-input-label">Desde</label>
                                            <div class="numero-fijo-input-group">
                                                <button class="decrement-btn" data-target="rango-min" data-index="${index}">
                                                    <i class="fas fa-minus text-xs"></i>
                                                </button>
                                                <input 
                                                    type="number" 
                                                    class="rango-min numero-input"
                                                    min="0" 
                                                    max="45" 
                                                    value="${rango.min}"
                                                    data-index="${index}"
                                                />
                                                <button class="increment-btn" data-target="rango-min" data-index="${index}">
                                                    <i class="fas fa-plus text-xs"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <span class="rango-separator">-</span>
                                        <div class="rango-input-container">
                                            <label class="rango-input-label">Hasta</label>
                                            <div class="numero-fijo-input-group">
                                                <button class="decrement-btn" data-target="rango-max" data-index="${index}">
                                                    <i class="fas fa-minus text-xs"></i>
                                                </button>
                                                <input 
                                                    type="number" 
                                                    class="rango-max numero-input"
                                                    min="0" 
                                                    max="45" 
                                                    value="${rango.max}"
                                                    data-index="${index}"
                                                />
                                                <button class="increment-btn" data-target="rango-max" data-index="${index}">
                                                    <i class="fas fa-plus text-xs"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="filtros-grid">
                                        <button class="filtro-btn-advanced ${rango.filtro === 'auto' ? 'active' : ''}" data-index="${index}" data-filtro="auto">
                                            Auto
                                        </button>
                                        <button class="filtro-btn-advanced ${rango.filtro === 'pares' ? 'active' : ''}" data-index="${index}" data-filtro="pares">
                                            Pares
                                        </button>
                                        <button class="filtro-btn-advanced ${rango.filtro === 'impares' ? 'active' : ''}" data-index="${index}" data-filtro="impares">
                                            Impares
                                        </button>
                                        <button class="filtro-btn-advanced ${rango.filtro === 'multiplos' ? 'active' : ''}" data-index="${index}" data-filtro="multiplos">
                                            Múltiplos
                                        </button>
                                    </div>
                                    <div class="multiplo-input-container ${rango.filtro === 'multiplos' ? '' : 'hidden'}" data-index="${index}">
                                        <label class="multiplo-label">Múltiplos de:</label>
                                        <div class="numero-fijo-input-group">
                                            <button class="decrement-btn" data-target="multiplo-input" data-index="${index}">
                                                <i class="fas fa-minus text-xs"></i>
                                            </button>
                                            <input 
                                                type="number" 
                                                class="multiplo-input numero-input"
                                                min="2" 
                                                max="45" 
                                                value="${rango.multiplo || 3}"
                                                placeholder="Ej: 3, 5, 7..."
                                                data-index="${index}"
                                            />
                                            <button class="increment-btn" data-target="multiplo-input" data-index="${index}">
                                                <i class="fas fa-plus text-xs"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="disponibles-indicator" data-index="${index}">
                                        <i class="fas fa-check-circle"></i>
                                        <span class="disponibles-text">Calculando...</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="modal-footer-advanced">
                <button class="modal-btn-advanced modal-btn-cancel-advanced">
                    Cancelar
                </button>
                <button class="modal-btn-advanced modal-btn-confirm-advanced">
                    Aplicar Filtros
                </button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Función para calcular números disponibles
        const calcularDisponibles = (index) => {
            const minInput = modal.querySelector(`.rango-min[data-index="${index}"]`);
            const maxInput = modal.querySelector(`.rango-max[data-index="${index}"]`);
            const indicator = modal.querySelector(`.disponibles-indicator[data-index="${index}"]`);
            const indicatorText = indicator.querySelector('.disponibles-text');
            const indicatorIcon = indicator.querySelector('i');
            
            const min = parseInt(minInput.value) || 0;
            const max = parseInt(maxInput.value) || 45;
            
            // Encontrar filtro activo
            let filtroActivo = 'auto';
            let multiplo = 3;
            modal.querySelectorAll(`.filtro-btn-advanced[data-index="${index}"]`).forEach(btn => {
                if (btn.classList.contains('active')) {
                    filtroActivo = btn.dataset.filtro;
                }
            });
            
            if (filtroActivo === 'multiplos') {
                const multiploInput = modal.querySelector(`.multiplo-input[data-index="${index}"]`);
                multiplo = parseInt(multiploInput.value) || 3;
            }
            
            // Calcular números disponibles
            const disponibles = [];
            for (let i = min; i <= max; i++) {
                if (filtroActivo === 'auto') {
                    disponibles.push(i);
                } else if (filtroActivo === 'pares' && i % 2 === 0) {
                    disponibles.push(i);
                } else if (filtroActivo === 'impares' && i % 2 !== 0) {
                    disponibles.push(i);
                } else if (filtroActivo === 'multiplos' && i % multiplo === 0) {
                    disponibles.push(i);
                }
            }
            
            // Actualizar indicador
            const count = disponibles.length;
            if (count === 0) {
                indicator.className = 'disponibles-indicator error';
                indicatorIcon.className = 'fas fa-exclamation-triangle';
                indicatorText.textContent = 'Sin números disponibles';
            } else if (count < 3) {
                indicator.className = 'disponibles-indicator warning';
                indicatorIcon.className = 'fas fa-exclamation-circle';
                indicatorText.textContent = `Solo ${count} número${count > 1 ? 's' : ''} disponible${count > 1 ? 's' : ''}`;
            } else {
                indicator.className = 'disponibles-indicator success';
                indicatorIcon.className = 'fas fa-check-circle';
                indicatorText.textContent = `${count} números disponibles`;
            }
        };
        
        // Calcular disponibles inicialmente para todos
        for (let i = 0; i < 6; i++) {
            calcularDisponibles(i);
        }

        // Event listeners
        const confirmBtn = modal.querySelector('.modal-btn-confirm-advanced');
        const cancelBtn = modal.querySelector('.modal-btn-cancel-advanced');
        const closeBtn = modal.querySelector('.modal-close');
        const presetBtns = modal.querySelectorAll('.preset-btn');

        const close = () => {
            overlay.style.animation = 'fadeIn 0.2s ease reverse';
            setTimeout(() => overlay.remove(), 200);
        };

        const obtenerFiltros = () => {
            const rangos = [];
            const minInputs = modal.querySelectorAll('.rango-min');
            const maxInputs = modal.querySelectorAll('.rango-max');
            const filtroBtns = modal.querySelectorAll('.filtro-btn-advanced');
            const multiploInputs = modal.querySelectorAll('.multiplo-input');
            const numeroFijoToggles = modal.querySelectorAll('.numero-fijo-toggle');
            const numeroFijoInputs = modal.querySelectorAll('.numero-fijo-input');

            for (let i = 0; i < 6; i++) {
                // Verificar si número fijo está activado
                const usarNumeroFijo = numeroFijoToggles[i].checked;
                
                if (usarNumeroFijo) {
                    // Solo guardar el número fijo
                    let numeroFijo = parseInt(numeroFijoInputs[i].value);
                    if (isNaN(numeroFijo) || numeroFijo < 0 || numeroFijo > 45) {
                        numeroFijo = 0;
                    }
                    
                    rangos.push({
                        min: 0,
                        max: 45,
                        filtro: 'auto',
                        multiplo: null,
                        numeroFijo: numeroFijo
                    });
                } else {
                    // Guardar configuración de rango y filtros
                    let filtroActivo = 'auto';
                    filtroBtns.forEach(btn => {
                        if (parseInt(btn.dataset.index) === i && btn.classList.contains('active')) {
                            filtroActivo = btn.dataset.filtro;
                        }
                    });

                    let multiplo = null;
                    if (filtroActivo === 'multiplos') {
                        multiplo = parseInt(multiploInputs[i].value) || 3;
                    }

                    rangos.push({
                        min: parseInt(minInputs[i].value) || 0,
                        max: parseInt(maxInputs[i].value) || 45,
                        filtro: filtroActivo,
                        multiplo: multiplo,
                        numeroFijo: null
                    });
                }
            }

            return { rangos };
        };

        confirmBtn.addEventListener('click', () => {
            const filtros = obtenerFiltros();
            
            // Validar rangos
            let error = null;
            filtros.rangos.forEach((rango, index) => {
                if (rango.min < 0 || rango.min > 45) {
                    error = `El mínimo del Número ${index + 1} debe estar entre 0 y 45`;
                }
                if (rango.max < 0 || rango.max > 45) {
                    error = `El máximo del Número ${index + 1} debe estar entre 0 y 45`;
                }
                if (rango.min > rango.max) {
                    error = `En el Número ${index + 1}, el mínimo no puede ser mayor que el máximo`;
                }

                // Validar que el rango tenga suficientes números según el filtro
                if (!error && rango.filtro !== 'auto') {
                    const numerosDisponibles = [];
                    for (let i = rango.min; i <= rango.max; i++) {
                        if (rango.filtro === 'pares' && i % 2 === 0) {
                            numerosDisponibles.push(i);
                        } else if (rango.filtro === 'impares' && i % 2 !== 0) {
                            numerosDisponibles.push(i);
                        } else if (rango.filtro === 'multiplos' && rango.multiplo && i % rango.multiplo === 0) {
                            numerosDisponibles.push(i);
                        }
                    }

                    if (numerosDisponibles.length === 0) {
                        let tipoFiltro = '';
                        if (rango.filtro === 'pares') tipoFiltro = 'pares';
                        else if (rango.filtro === 'impares') tipoFiltro = 'impares';
                        else if (rango.filtro === 'multiplos') tipoFiltro = `múltiplos de ${rango.multiplo}`;
                        
                        error = `
                            <div class="text-left">
                                <p class="font-semibold mb-2">⚠️ Configuración inválida para Número ${index + 1}</p>
                                <p class="mb-2">El rango <span class="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">${rango.min} - ${rango.max}</span> 
                                con filtro <span class="font-semibold text-primary">"${tipoFiltro}"</span> no tiene números disponibles.</p>
                                <p class="text-sm text-slate-600 dark:text-slate-400 mt-2">
                                    <strong>Sugerencias:</strong><br>
                                    • Cambia el filtro a "Auto"<br>
                                    • Amplía el rango para incluir más números<br>
                                    ${rango.filtro === 'multiplos' ? `• Prueba con un múltiplo menor (ej: ${Math.max(2, rango.multiplo - 1)})<br>` : ''}
                                    • Verifica que el rango contenga números ${tipoFiltro}
                                </p>
                            </div>
                        `;
                    }
                }
            });

            if (error) {
                UIHelper.mostrarError(error);
                return;
            }

            onConfirm(filtros);
            close();
        });

        cancelBtn.addEventListener('click', close);
        closeBtn.addEventListener('click', close);

        // Event listeners para botones de filtro
        const filtroBtns = modal.querySelectorAll('.filtro-btn-advanced');
        filtroBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const index = btn.dataset.index;
                const filtro = btn.dataset.filtro;
                
                // Desactivar todos los botones de este grupo
                modal.querySelectorAll(`.filtro-btn-advanced[data-index="${index}"]`).forEach(b => {
                    b.classList.remove('active');
                });
                
                // Activar el botón clickeado
                btn.classList.add('active');
                
                // Mostrar/ocultar input de múltiplos
                const multiploContainer = modal.querySelector(`.multiplo-input-container[data-index="${index}"]`);
                if (filtro === 'multiplos') {
                    multiploContainer.classList.remove('hidden');
                } else {
                    multiploContainer.classList.add('hidden');
                }
                
                // Recalcular disponibles
                calcularDisponibles(index);
            });
        });

        // Event listeners para inputs de rango
        const rangoInputs = modal.querySelectorAll('.rango-min, .rango-max');
        rangoInputs.forEach(input => {
            input.addEventListener('input', () => {
                const index = input.dataset.index;
                calcularDisponibles(index);
            });
        });

        // Event listeners para inputs de múltiplos
        const multiploInputs = modal.querySelectorAll('.multiplo-input');
        multiploInputs.forEach(input => {
            input.addEventListener('input', () => {
                const index = input.dataset.index;
                calcularDisponibles(index);
            });
        });

        // Event listeners para botones de incremento/decremento
        const incrementBtns = modal.querySelectorAll('.increment-btn');
        const decrementBtns = modal.querySelectorAll('.decrement-btn');
        
        incrementBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.target;
                const index = btn.dataset.index;
                const input = modal.querySelector(`.${target}[data-index="${index}"]`);
                const max = parseInt(input.max);
                const current = parseInt(input.value) || 0;
                
                if (current < max) {
                    input.value = current + 1;
                    input.dispatchEvent(new Event('input'));
                }
            });
        });
        
        decrementBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.target;
                const index = btn.dataset.index;
                const input = modal.querySelector(`.${target}[data-index="${index}"]`);
                const min = parseInt(input.min);
                const current = parseInt(input.value) || 0;
                
                if (current > min) {
                    input.value = current - 1;
                    input.dispatchEvent(new Event('input'));
                }
            });
        });

        // Event listeners para toggle de número fijo
        const numeroFijoToggles = modal.querySelectorAll('.numero-fijo-toggle');
        numeroFijoToggles.forEach(toggle => {
            toggle.addEventListener('change', () => {
                const index = toggle.dataset.index;
                const numeroFijoContainer = modal.querySelector(`.numero-fijo-container[data-index="${index}"]`);
                const rangosFiltrosContainer = modal.querySelector(`.rangos-filtros-container[data-index="${index}"]`);
                const disponiblesIndicator = modal.querySelector(`.disponibles-indicator[data-index="${index}"]`);
                
                if (toggle.checked) {
                    // Mostrar número fijo, ocultar rangos/filtros
                    numeroFijoContainer.classList.remove('hidden');
                    rangosFiltrosContainer.classList.add('hidden');
                    disponiblesIndicator.classList.add('hidden');
                } else {
                    // Ocultar número fijo, mostrar rangos/filtros
                    numeroFijoContainer.classList.add('hidden');
                    rangosFiltrosContainer.classList.remove('hidden');
                    disponiblesIndicator.classList.remove('hidden');
                    calcularDisponibles(index);
                }
            });
        });

        // Event listeners para inputs de número fijo
        const numeroFijoInputs = modal.querySelectorAll('.numero-fijo-input');
        numeroFijoInputs.forEach(input => {
            input.addEventListener('input', () => {
                const index = input.dataset.index;
                calcularDisponibles(index);
            });
        });

        // Event listeners para botones de reset individual
        const resetNumeroBtns = modal.querySelectorAll('.reset-numero-btn');
        resetNumeroBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                
                // Resetear rango a 0-45
                const minInput = modal.querySelector(`.rango-min[data-index="${index}"]`);
                const maxInput = modal.querySelector(`.rango-max[data-index="${index}"]`);
                minInput.value = 0;
                maxInput.value = 45;
                
                // Resetear filtro a auto
                modal.querySelectorAll(`.filtro-btn-advanced[data-index="${index}"]`).forEach(b => {
                    if (b.dataset.filtro === 'auto') {
                        b.classList.add('active');
                    } else {
                        b.classList.remove('active');
                    }
                });
                
                // Ocultar input de múltiplos
                const multiploContainer = modal.querySelector(`.multiplo-input-container[data-index="${index}"]`);
                multiploContainer.classList.add('hidden');
                
                // Desactivar y ocultar número fijo
                const numeroFijoToggle = modal.querySelector(`.numero-fijo-toggle[data-index="${index}"]`);
                const numeroFijoContainer = modal.querySelector(`.numero-fijo-container[data-index="${index}"]`);
                const rangosFiltrosContainer = modal.querySelector(`.rangos-filtros-container[data-index="${index}"]`);
                const disponiblesIndicator = modal.querySelector(`.disponibles-indicator[data-index="${index}"]`);
                
                numeroFijoToggle.checked = false;
                numeroFijoContainer.classList.add('hidden');
                rangosFiltrosContainer.classList.remove('hidden');
                disponiblesIndicator.classList.remove('hidden');
                
                // Recalcular disponibles
                calcularDisponibles(index);
            });
        });

        // Presets
        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = btn.dataset.preset;
                const minInputs = modal.querySelectorAll('.rango-min');
                const maxInputs = modal.querySelectorAll('.rango-max');

                if (preset === 'reset') {
                    // Resetear todo a 0-45 con filtro auto
                    minInputs.forEach(input => input.value = 0);
                    maxInputs.forEach(input => input.value = 45);
                    
                    // Resetear filtros a auto
                    filtroBtns.forEach(btn => {
                        if (btn.dataset.filtro === 'auto') {
                            btn.classList.add('active');
                        } else {
                            btn.classList.remove('active');
                        }
                    });
                    
                    // Ocultar inputs de múltiplos
                    modal.querySelectorAll('.multiplo-input-container').forEach(container => {
                        container.classList.add('hidden');
                    });
                    
                    // Recalcular todos los disponibles
                    for (let i = 0; i < 6; i++) {
                        calcularDisponibles(i);
                    }
                } else if (preset === 'distribuido') {
                    // Distribuir en 6 rangos iguales
                    const rangos = [
                        [0, 7],
                        [8, 15],
                        [16, 23],
                        [24, 31],
                        [32, 38],
                        [39, 45]
                    ];
                    rangos.forEach((rango, index) => {
                        minInputs[index].value = rango[0];
                        maxInputs[index].value = rango[1];
                        calcularDisponibles(index);
                    });
                }
            });
        });

        // Cerrar al hacer clic fuera
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                close();
            }
        });

        // Cerrar con Escape
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                close();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
}