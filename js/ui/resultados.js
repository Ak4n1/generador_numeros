export class ResultadosUI {
    constructor(containerId) {
        console.log('🔧 [DEBUG] Inicializando ResultadosUI con containerId:', containerId);
        this.container = document.getElementById(containerId);
        
        if (!this.container) {
            console.error('❌ [DEBUG] Contenedor de resultados NO encontrado:', containerId);
            return;
        }
        
        console.log('✅ [DEBUG] Contenedor de resultados encontrado:', this.container);
        this.autoShuffleStates = new Map(); // Guardar estado de auto-shuffle por index
        
        // Mostrar estado inicial vacío
        this.mostrarVacio();
    }

    renderizar(jugadas) {
        console.log('🎨 [DEBUG] Renderizando jugadas:', jugadas);
        
        if (!this.container) {
            console.error('❌ [DEBUG] No se puede renderizar - contenedor no existe');
            return;
        }
        
        if (!jugadas || jugadas.length === 0) {
            console.log('📝 [DEBUG] No hay jugadas, mostrando vacío');
            this.mostrarVacio();
            return;
        }

        console.log('🎯 [DEBUG] Renderizando', jugadas.length, 'jugadas');
        console.log('🔍 [DEBUG] Contenedor antes de limpiar:', this.container.innerHTML);
        
        this.container.innerHTML = '';
        console.log('🔍 [DEBUG] Contenedor después de limpiar:', this.container.innerHTML);
        
        jugadas.forEach((jugada, index) => {
            console.log('🎯 [DEBUG] Creando card para jugada', index, ':', jugada);
            const card = this.crearCard(jugada, index);
            console.log('🔍 [DEBUG] Card creada:', card);
            console.log('🔍 [DEBUG] Card HTML:', card.outerHTML);
            this.container.appendChild(card);
            console.log('🔍 [DEBUG] Card agregada al contenedor');
        });
        
        console.log('🔍 [DEBUG] Contenedor final:', this.container.innerHTML);
        console.log('🔍 [DEBUG] Contenedor visible?', this.container.offsetHeight > 0);
        console.log('🔍 [DEBUG] Contenedor display:', getComputedStyle(this.container).display);
        console.log('🔍 [DEBUG] Contenedor visibility:', getComputedStyle(this.container).visibility);
        console.log('🔍 [DEBUG] Contenedor padre:', this.container.parentElement);
        console.log('🔍 [DEBUG] Contenedor padre visible?', this.container.parentElement?.offsetHeight > 0);
        console.log('🔍 [DEBUG] Contenedor padre display:', this.container.parentElement ? getComputedStyle(this.container.parentElement).display : 'N/A');
        console.log('🔍 [DEBUG] Contenedor padre clases:', this.container.parentElement?.className);
        console.log('🔍 [DEBUG] Abuelo del contenedor:', this.container.parentElement?.parentElement);
        console.log('🔍 [DEBUG] Abuelo visible?', this.container.parentElement?.parentElement?.offsetHeight > 0);
        console.log('🔍 [DEBUG] Abuelo display:', this.container.parentElement?.parentElement ? getComputedStyle(this.container.parentElement.parentElement).display : 'N/A');
        console.log('✅ [DEBUG] Renderizado completado');
    }

    crearCard(jugada, index) {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.dataset.index = index;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'result-content';
        
        const badge = document.createElement('span');
        badge.className = 'result-badge';
        badge.textContent = `${jugada.tipo} • ${jugada.fecha}`;
        
        const numerosDisplay = document.createElement('div');
        numerosDisplay.className = 'result-numbers';
        numerosDisplay.dataset.numeros = 'container';
        
        this.renderizarNumeros(numerosDisplay, jugada);
        
        contentDiv.appendChild(badge);
        contentDiv.appendChild(numerosDisplay);
        
        const actions = document.createElement('div');
        actions.className = 'result-actions';
        
        // Botón Shuffle
        const btnShuffle = document.createElement('button');
        btnShuffle.className = 'btn-shuffle';
        btnShuffle.innerHTML = '<i class="fas fa-random"></i>';
        btnShuffle.title = 'Mezclar números';
        btnShuffle.onclick = () => this.onShuffle(index);
        
        // Botón Auto-Shuffle
        const btnAutoShuffle = document.createElement('button');
        const isAutoActive = this.autoShuffleStates.get(index);
        btnAutoShuffle.className = `btn-auto-shuffle ${isAutoActive ? 'auto-shuffle-active' : ''}`;
        btnAutoShuffle.innerHTML = `<i class="fas fa-${isAutoActive ? 'stop' : 'play'}"></i>`;
        btnAutoShuffle.title = isAutoActive ? 'Detener mezcla automática' : 'Mezcla automática';
        btnAutoShuffle.onclick = () => this.onToggleAutoShuffle(index, btnAutoShuffle);
        
        // Botón Guardar
        const btnGuardar = document.createElement('button');
        btnGuardar.className = 'btn-save';
        btnGuardar.innerHTML = '<i class="fas fa-star"></i> Guardar';
        btnGuardar.onclick = () => this.onGuardar(jugada, index);
        
        // Botón Copiar
        const btnCopiar = document.createElement('button');
        btnCopiar.className = 'btn-copy';
        btnCopiar.innerHTML = '<i class="fas fa-copy"></i>';
        btnCopiar.title = 'Copiar números';
        btnCopiar.onclick = () => this.copiarNumeros(jugada);
        
        actions.appendChild(btnShuffle);
        actions.appendChild(btnAutoShuffle);
        actions.appendChild(btnGuardar);
        actions.appendChild(btnCopiar);
        
        card.appendChild(contentDiv);
        card.appendChild(actions);
        
        return card;
    }

    renderizarNumeros(container, jugada) {
        container.innerHTML = '';
        
        if (jugada.tipo.includes('6 Números') || jugada.tipo === '6-numeros') {
            // Mostrar como bolillas
            jugada.numeros.forEach(num => {
                const ball = document.createElement('div');
                ball.className = 'number-ball';
                ball.textContent = num;
                container.appendChild(ball);
            });
        } else {
            // Quiniela simple
            jugada.numeros.forEach(num => {
                const numeroDiv = document.createElement('div');
                numeroDiv.className = 'numero-quiniela';
                numeroDiv.textContent = num;
                container.appendChild(numeroDiv);
            });
        }
    }

    copiarNumeros(jugada) {
        let texto = '';
        if (jugada.tipo === 'Quiniela Completa') {
            texto = jugada.numeros.map(item => `Pos ${item.posicion}: ${item.numero}`).join(', ');
        } else {
            texto = jugada.numeros.join(', ');
        }
        
        navigator.clipboard.writeText(texto).then(() => {
            this.mostrarNotificacion('Números copiados al portapapeles');
        }).catch(() => {
            this.mostrarNotificacion('Error al copiar', 'error');
        });
    }

    mostrarNotificacion(mensaje, tipo = 'success') {
        const notif = document.createElement('div');
        notif.className = `fixed top-20 right-6 px-6 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 ${
            tipo === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white font-medium`;
        notif.innerHTML = `
            <i class="fas fa-${tipo === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${mensaje}
        `;
        
        document.body.appendChild(notif);
        
        setTimeout(() => {
            notif.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 2000);
    }

    mostrarVacio() {
        console.log('📋 [DEBUG] Mostrando estado vacío');
        
        if (!this.container) {
            console.error('❌ [DEBUG] No se puede mostrar vacío - contenedor no existe');
            return;
        }
        
        this.container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-dice empty-icon"></i>
                <p>Genera números para ver los resultados aquí</p>
            </div>
        `;
        
        console.log('✅ [DEBUG] Estado vacío mostrado');
    }

    onGuardar(jugada, index) {
        // Este método será sobrescrito desde main.js
    }

    onShuffle(index) {
        // Este método será sobrescrito desde main.js
    }

    onToggleAutoShuffle(index, button) {
        // Este método será sobrescrito desde main.js
    }

    updateAutoShuffleButton(index, isActive) {
        const card = this.container.querySelector(`[data-index="${index}"]`);
        if (!card) return;

        const btn = card.querySelectorAll('button')[1]; // Segundo botón es auto-shuffle
        if (btn) {
            btn.className = `px-3 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${
                isActive 
                    ? 'bg-red-500/80 text-white hover:bg-red-600/80' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary'
            }`;
            btn.innerHTML = `<i class="fas fa-${isActive ? 'stop' : 'play'}"></i>`;
            btn.title = isActive ? 'Detener mezcla automática' : 'Mezcla automática';
        }

        this.autoShuffleStates.set(index, isActive);
    }

    limpiar() {
        this.container.innerHTML = '';
        this.autoShuffleStates.clear();
        this.mostrarVacio();
    }
}

export class GuardadosUI {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    renderizar(guardados) {
        if (!guardados || guardados.length === 0) {
            this.mostrarVacio();
            return;
        }

        this.container.innerHTML = '';
        
        guardados.forEach(jugada => {
            const card = this.crearCard(jugada);
            this.container.appendChild(card);
        });
    }

    crearCard(jugada) {
        const card = document.createElement('div');
        card.className = 'guardado-card';
        
        const header = document.createElement('div');
        header.className = 'guardado-header';
        
        const headerText = document.createElement('div');
        headerText.className = 'guardado-header-text';
        
        const tipo = document.createElement('span');
        tipo.className = 'guardado-tipo';
        tipo.textContent = `${jugada.tipo} • ${jugada.fecha}`;
        
        headerText.appendChild(tipo);
        
        const actions = document.createElement('div');
        actions.className = 'guardado-actions';
        
        const btnCopiar = document.createElement('button');
        btnCopiar.className = 'guardado-btn-copy';
        btnCopiar.innerHTML = '<i class="fas fa-copy"></i>';
        btnCopiar.title = 'Copiar números';
        btnCopiar.onclick = (e) => {
            e.stopPropagation();
            this.copiarNumeros(jugada);
        };
        
        const btnEliminar = document.createElement('button');
        btnEliminar.className = 'guardado-btn-delete';
        btnEliminar.innerHTML = '<i class="fas fa-trash"></i>';
        btnEliminar.title = 'Eliminar';
        btnEliminar.onclick = (e) => {
            e.stopPropagation();
            this.onEliminar(jugada.id);
        };
        
        actions.appendChild(btnCopiar);
        actions.appendChild(btnEliminar);
        
        header.appendChild(headerText);
        header.appendChild(actions);
        
        const numerosDiv = document.createElement('div');
        numerosDiv.className = 'guardado-numeros';
        
        if (jugada.tipo.includes('6 Números') || jugada.tipo === '6-numeros') {
            // Mostrar como mini bolillas
            jugada.numeros.forEach(num => {
                const ball = document.createElement('div');
                ball.className = 'guardado-ball';
                ball.textContent = num;
                numerosDiv.appendChild(ball);
            });
        } else {
            // Mostrar como texto compacto
            const span = document.createElement('span');
            span.className = 'guardado-text';
            span.textContent = jugada.numeros.join(', ');
            numerosDiv.appendChild(span);
        }
        
        card.appendChild(header);
        card.appendChild(numerosDiv);
        
        return card;
    }

    copiarNumeros(jugada) {
        let texto = jugada.numeros.join(', ');
        
        navigator.clipboard.writeText(texto).then(() => {
            this.mostrarNotificacion('Números copiados al portapapeles');
        }).catch(() => {
            this.mostrarNotificacion('Error al copiar', 'error');
        });
    }

    mostrarNotificacion(mensaje, tipo = 'success') {
        const notif = document.createElement('div');
        notif.className = `fixed top-20 right-6 px-6 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 ${
            tipo === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white font-medium`;
        notif.innerHTML = `
            <i class="fas fa-${tipo === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${mensaje}
        `;
        
        document.body.appendChild(notif);
        
        setTimeout(() => {
            notif.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 2000);
    }

    mostrarVacio() {
        this.container.innerHTML = `
            <div class="empty-state">
                <i class="far fa-star empty-icon"></i>
                <p>No hay números guardados todavía</p>
            </div>
        `;
    }

    onEliminar(id) {
        // Este método será sobrescrito desde main.js
    }
}
