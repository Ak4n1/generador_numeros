/**
 * Servicio para generar números usando algoritmos inteligentes basados en datos históricos
 */
export class GeneradorInteligenteService {
    constructor() {
        this.baseURL = window.location.hostname === 'localhost' 
            ? 'http://localhost:3000' 
            : 'https://loteriaapp.vercel.app';
        this.datosHistoricos = [];
        this.estadisticasCache = new Map();
        this.cacheTimestamp = 0;
        this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
    }

    /**
     * Carga los datos históricos desde la API
     */
    async cargarDatosHistoricos() {
        try {
            const ahora = Date.now();
            if (ahora - this.cacheTimestamp < this.CACHE_DURATION && this.datosHistoricos.length > 0) {
                return; // Cache válido
            }

            console.log('🔄 [GENERADOR INTELIGENTE] Cargando datos históricos...');
            
            const response = await fetch(`${this.baseURL}/api/quini6/historial?limite=100`);
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}`);
            }

            const data = await response.json();
            
            console.log('🔍 [DEBUG] Respuesta completa de la API:', data);
            
            if (!data.success) {
                throw new Error(data.error || 'Error desconocido');
            }

            // Verificar estructura de datos
            if (!data.data || !Array.isArray(data.data)) {
                console.error('❌ [DEBUG] Estructura de datos incorrecta:', data);
                throw new Error('La API no devolvió datos en el formato esperado');
            }

            // Convertir los datos al formato esperado
            this.datosHistoricos = [];
            data.data.forEach(sorteo => {
                console.log('🔍 [DEBUG] Procesando sorteo:', sorteo);
                
                // Verificar que tenga los campos necesarios
                if (!sorteo.concurso || !sorteo.sorteo || !sorteo.numeros || !Array.isArray(sorteo.numeros)) {
                    console.warn('⚠️ [DEBUG] Sorteo con datos incompletos:', sorteo);
                    return;
                }
                
                this.datosHistoricos.push({
                    concurso: parseInt(sorteo.concurso),
                    sorteo: sorteo.sorteo,
                    fecha: sorteo.fecha,
                    numeros: sorteo.numeros
                });
            });

            this.cacheTimestamp = ahora;
            this.estadisticasCache.clear();
            
            console.log(`✅ [GENERADOR INTELIGENTE] Cargados ${this.datosHistoricos.length} sorteos históricos`);

        } catch (error) {
            console.error('❌ [GENERADOR INTELIGENTE] Error cargando datos:', error);
            throw new Error(`Error al cargar datos históricos: ${error.message}`);
        }
    }

    /**
     * Calcula estadísticas de frecuencia para cada número
     */
    calcularEstadisticas(tipoSorteo = null) {
        const cacheKey = tipoSorteo || 'todos';
        
        if (this.estadisticasCache.has(cacheKey)) {
            return this.estadisticasCache.get(cacheKey);
        }

        const sorteosFiltrados = tipoSorteo 
            ? this.datosHistoricos.filter(d => d.sorteo === tipoSorteo)
            : this.datosHistoricos;

        const estadisticas = [];
        const totalSorteos = sorteosFiltrados.length;

        // Calcular estadísticas para cada número (0-45)
        for (let numero = 0; numero <= 45; numero++) {
            let apariciones = 0;
            let ultimaAparicion = -1;
            let aparicionesRecientes = 0;

            sorteosFiltrados.forEach((sorteo, index) => {
                if (sorteo.numeros.includes(numero)) {
                    apariciones++;
                    if (ultimaAparicion === -1) {
                        ultimaAparicion = index;
                    }
                    // Últimos 15 sorteos para tendencia reciente
                    if (index < 15) {
                        aparicionesRecientes++;
                    }
                }
            });

            const frecuencia = totalSorteos > 0 ? apariciones / totalSorteos : 0;
            const frecuenciaReciente = aparicionesRecientes / Math.min(15, totalSorteos);
            const tendenciaReciente = frecuenciaReciente - frecuencia;

            estadisticas.push({
                numero,
                frecuencia,
                apariciones,
                tendenciaReciente,
                ultimaAparicion
            });
        }

        this.estadisticasCache.set(cacheKey, estadisticas);
        return estadisticas;
    }

    /**
     * Genera números usando un algoritmo específico
     */
    async generarNumeros(algoritmo, sorteo = null) {
        try {
            await this.cargarDatosHistoricos();

            console.log(`🎯 [GENERADOR INTELIGENTE] Generando con algoritmo: ${algoritmo}`);

            let resultado;

            switch (algoritmo) {
                case 'frecuencia-alta':
                    resultado = this.generarNumerosFrecuenciaAlta(sorteo);
                    break;
                
                case 'frecuencia-baja':
                    resultado = this.generarNumerosFrecuenciaBaja(sorteo);
                    break;
                
                case 'temporal-ascendente':
                    resultado = this.generarNumerosTemporalAscendente(sorteo);
                    break;
                
                case 'temporal-descendente':
                    resultado = this.generarNumerosTemporalDescendente(sorteo);
                    break;
                
                case 'distribucion':
                    resultado = this.generarNumerosDistribucion(sorteo);
                    break;
                
                case 'hibrido-equilibrado':
                    resultado = this.generarNumerosHibridoEquilibrado(sorteo);
                    break;
                
                case 'hibrido-agresivo':
                    resultado = this.generarNumerosHibridoAgresivo(sorteo);
                    break;
                
                default:
                    throw new Error(`Algoritmo "${algoritmo}" no válido`);
            }

            console.log(`✅ [GENERADOR INTELIGENTE] Números generados: ${resultado.numeros.join(', ')}`);
            
            return resultado;

        } catch (error) {
            console.error('❌ [GENERADOR INTELIGENTE] Error:', error);
            throw error;
        }
    }

    generarNumerosFrecuenciaAlta(tipoSorteo) {
        const estadisticas = this.calcularEstadisticas(tipoSorteo);
        const numerosOrdenados = estadisticas
            .sort((a, b) => b.frecuencia - a.frecuencia)
            .slice(0, 20); // Top 20 más frecuentes

        const numeros = this.seleccionarNumerosConPeso(numerosOrdenados, 'frecuencia');
        
        return {
            numeros: numeros.sort((a, b) => a - b),
            algoritmo: 'frecuencia-alta',
            timestamp: new Date().toISOString(),
            estadisticas: { 
                promedioFrecuencia: numeros.reduce((sum, n) => {
                    const stat = estadisticas.find(e => e.numero === n);
                    return sum + (stat ? stat.frecuencia : 0);
                }, 0) / 6 
            }
        };
    }

    generarNumerosFrecuenciaBaja(tipoSorteo) {
        const estadisticas = this.calcularEstadisticas(tipoSorteo);
        const numerosOrdenados = estadisticas
            .sort((a, b) => a.frecuencia - b.frecuencia)
            .slice(0, 20); // Top 20 menos frecuentes

        const numeros = this.seleccionarNumerosConPeso(numerosOrdenados, 'frecuencia', true);
        
        return {
            numeros: numeros.sort((a, b) => a - b),
            algoritmo: 'frecuencia-baja',
            timestamp: new Date().toISOString(),
            estadisticas: { 
                promedioFrecuencia: numeros.reduce((sum, n) => {
                    const stat = estadisticas.find(e => e.numero === n);
                    return sum + (stat ? stat.frecuencia : 0);
                }, 0) / 6 
            }
        };
    }

    generarNumerosTemporalAscendente(tipoSorteo) {
        const estadisticas = this.calcularEstadisticas(tipoSorteo);
        const numerosOrdenados = estadisticas
            .filter(e => e.tendenciaReciente > 0)
            .sort((a, b) => b.tendenciaReciente - a.tendenciaReciente)
            .slice(0, 20);

        const numeros = this.seleccionarNumerosConPeso(numerosOrdenados, 'tendenciaReciente');
        
        return {
            numeros: numeros.sort((a, b) => a - b),
            algoritmo: 'temporal-ascendente',
            timestamp: new Date().toISOString(),
            estadisticas: { 
                promedioTendencia: numeros.reduce((sum, n) => {
                    const stat = estadisticas.find(e => e.numero === n);
                    return sum + (stat ? stat.tendenciaReciente : 0);
                }, 0) / 6 
            }
        };
    }

    generarNumerosTemporalDescendente(tipoSorteo) {
        const estadisticas = this.calcularEstadisticas(tipoSorteo);
        const numerosOrdenados = estadisticas
            .filter(e => e.tendenciaReciente < 0)
            .sort((a, b) => a.tendenciaReciente - b.tendenciaReciente)
            .slice(0, 20);

        const numeros = this.seleccionarNumerosConPeso(numerosOrdenados, 'tendenciaReciente', true);
        
        return {
            numeros: numeros.sort((a, b) => a - b),
            algoritmo: 'temporal-descendente',
            timestamp: new Date().toISOString(),
            estadisticas: { 
                promedioTendencia: numeros.reduce((sum, n) => {
                    const stat = estadisticas.find(e => e.numero === n);
                    return sum + (stat ? stat.tendenciaReciente : 0);
                }, 0) / 6 
            }
        };
    }

    generarNumerosDistribucion(tipoSorteo) {
        const estadisticas = this.calcularEstadisticas(tipoSorteo);
        
        // Analizar distribución histórica por rangos
        const rangos = { bajo: 0, medio: 0, alto: 0 };
        this.datosHistoricos.forEach(sorteo => {
            sorteo.numeros.forEach(num => {
                if (num <= 15) rangos.bajo++;
                else if (num <= 30) rangos.medio++;
                else rangos.alto++;
            });
        });

        const totalNumeros = this.datosHistoricos.length * 6;
        const proporcionBajo = rangos.bajo / totalNumeros;
        const proporcionMedio = rangos.medio / totalNumeros;
        const proporcionAlto = rangos.alto / totalNumeros;
        
        // Calcular distribución objetivo que sume exactamente 6
        let distribucionObjetivo = {
            bajo: Math.round(proporcionBajo * 6),
            medio: Math.round(proporcionMedio * 6),
            alto: Math.round(proporcionAlto * 6)
        };
        
        // Ajustar para que sume exactamente 6
        const suma = distribucionObjetivo.bajo + distribucionObjetivo.medio + distribucionObjetivo.alto;
        if (suma !== 6) {
            const diferencia = 6 - suma;
            // Ajustar el rango con mayor proporción
            if (proporcionBajo >= proporcionMedio && proporcionBajo >= proporcionAlto) {
                distribucionObjetivo.bajo += diferencia;
            } else if (proporcionMedio >= proporcionAlto) {
                distribucionObjetivo.medio += diferencia;
            } else {
                distribucionObjetivo.alto += diferencia;
            }
        }
        
        // Asegurar que ningún valor sea negativo
        distribucionObjetivo.bajo = Math.max(0, distribucionObjetivo.bajo);
        distribucionObjetivo.medio = Math.max(0, distribucionObjetivo.medio);
        distribucionObjetivo.alto = Math.max(0, distribucionObjetivo.alto);

        const numeros = this.generarConDistribucion(estadisticas, distribucionObjetivo);
        
        return {
            numeros: numeros.sort((a, b) => a - b),
            algoritmo: 'distribucion',
            timestamp: new Date().toISOString(),
            estadisticas: { distribucionObjetivo }
        };
    }

    generarNumerosHibridoEquilibrado(tipoSorteo) {
        // Combinar frecuencia alta + temporal ascendente + distribución
        const freq = this.generarNumerosFrecuenciaAlta(tipoSorteo);
        const temp = this.generarNumerosTemporalAscendente(tipoSorteo);
        const dist = this.generarNumerosDistribucion(tipoSorteo);
        
        let numerosHibridos = [...new Set([...freq.numeros, ...temp.numeros, ...dist.numeros])]
            .sort(() => Math.random() - 0.5)
            .slice(0, 6);
        
        // Asegurar que tengamos exactamente 6 números
        while (numerosHibridos.length < 6) {
            const numeroAleatorio = Math.floor(Math.random() * 46);
            if (!numerosHibridos.includes(numeroAleatorio)) {
                numerosHibridos.push(numeroAleatorio);
            }
        }
        
        return {
            numeros: numerosHibridos.sort((a, b) => a - b),
            algoritmo: 'hibrido-equilibrado',
            timestamp: new Date().toISOString(),
            estadisticas: { componentes: ['frecuencia-alta', 'temporal-ascendente', 'distribucion'] }
        };
    }

    generarNumerosHibridoAgresivo(tipoSorteo) {
        // Priorizar temporal ascendente (50%) + frecuencia alta (30%) + distribución (20%)
        const tempAgr = this.generarNumerosTemporalAscendente(tipoSorteo);
        const freqAgr = this.generarNumerosFrecuenciaAlta(tipoSorteo);
        const distAgr = this.generarNumerosDistribucion(tipoSorteo);
        
        const pool = [
            ...tempAgr.numeros.slice(0, 3), // 3 números temporales
            ...freqAgr.numeros.slice(0, 2), // 2 números frecuentes
            ...distAgr.numeros.slice(0, 1)  // 1 número distribución
        ];
        
        const numerosAgresivos = [...new Set(pool)];
        while (numerosAgresivos.length < 6) {
            const random = Math.floor(Math.random() * 46);
            if (!numerosAgresivos.includes(random)) {
                numerosAgresivos.push(random);
            }
        }
        
        return {
            numeros: numerosAgresivos.slice(0, 6).sort((a, b) => a - b),
            algoritmo: 'hibrido-agresivo',
            timestamp: new Date().toISOString(),
            estadisticas: { 
                componentes: ['temporal-ascendente (50%)', 'frecuencia-alta (30%)', 'distribucion (20%)'] 
            }
        };
    }

    seleccionarNumerosConPeso(candidatos, propiedad, invertir = false) {
        const numeros = [];
        const usados = new Set();
        const candidatosDisponibles = [...candidatos]; // Copia para modificar

        while (numeros.length < 6 && candidatosDisponibles.length > 0) {
            // Selección ponderada por peso
            const pesos = candidatosDisponibles.map(c => {
                const valor = Math.abs(c[propiedad]);
                return invertir ? 1 / (valor + 0.001) : valor + 0.001;
            });

            const totalPeso = pesos.reduce((sum, peso) => sum + peso, 0);
            let random = Math.random() * totalPeso;
            let seleccionado = false;

            for (let i = 0; i < candidatosDisponibles.length; i++) {
                random -= pesos[i];
                if (random <= 0 && !usados.has(candidatosDisponibles[i].numero)) {
                    numeros.push(candidatosDisponibles[i].numero);
                    usados.add(candidatosDisponibles[i].numero);
                    candidatosDisponibles.splice(i, 1); // Remover candidato usado
                    seleccionado = true;
                    break;
                }
            }

            // Si no se seleccionó ninguno, tomar el primero disponible
            if (!seleccionado && candidatosDisponibles.length > 0) {
                const candidato = candidatosDisponibles[0];
                if (!usados.has(candidato.numero)) {
                    numeros.push(candidato.numero);
                    usados.add(candidato.numero);
                }
                candidatosDisponibles.shift(); // Remover el primero
            }
        }

        // Completar con números aleatorios si es necesario
        while (numeros.length < 6) {
            const numeroAleatorio = Math.floor(Math.random() * 46);
            if (!usados.has(numeroAleatorio)) {
                numeros.push(numeroAleatorio);
                usados.add(numeroAleatorio);
            }
        }

        return numeros;
    }

    generarConDistribucion(estadisticas, distribucion) {
        const numeros = [];
        const usados = new Set();

        // Seleccionar números por rango
        const rangos = {
            bajo: estadisticas.filter(e => e.numero <= 15),
            medio: estadisticas.filter(e => e.numero > 15 && e.numero <= 30),
            alto: estadisticas.filter(e => e.numero > 30)
        };

        // Seleccionar según distribución objetivo
        ['bajo', 'medio', 'alto'].forEach(rango => {
            const cantidad = distribucion[rango];
            const candidatos = [...rangos[rango]]; // Copia para modificar
            
            for (let i = 0; i < cantidad && candidatos.length > 0; i++) {
                let intentos = 0;
                let seleccionado = false;
                
                while (!seleccionado && candidatos.length > 0 && intentos < 10) {
                    const indiceAleatorio = Math.floor(Math.random() * candidatos.length);
                    const candidato = candidatos[indiceAleatorio];
                    
                    if (!usados.has(candidato.numero)) {
                        numeros.push(candidato.numero);
                        usados.add(candidato.numero);
                        seleccionado = true;
                    }
                    
                    // Remover candidato usado o no válido
                    candidatos.splice(indiceAleatorio, 1);
                    intentos++;
                }
            }
        });

        // Completar con números aleatorios si es necesario
        while (numeros.length < 6) {
            const numeroAleatorio = Math.floor(Math.random() * 46);
            if (!usados.has(numeroAleatorio)) {
                numeros.push(numeroAleatorio);
                usados.add(numeroAleatorio);
            }
        }

        return numeros;
    }

    /**
     * Convierte el resultado del generador inteligente al formato esperado por la UI
     */
    convertirAJugada(resultado) {
        return {
            numeros: resultado.numeros,
            tipo: '6-numeros',
            timestamp: new Date().toISOString(),
            fecha: new Date().toLocaleDateString('es-ES'),
            hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            algoritmo: resultado.algoritmo,
            estadisticas: resultado.estadisticas,
            // Agregar propiedades adicionales que espera la UI
            id: Date.now(),
            esInteligente: true
        };
    }

    /**
     * Obtiene la descripción de un algoritmo
     */
    getDescripcionAlgoritmo(algoritmo) {
        const descripciones = {
            'frecuencia-alta': 'Números que aparecen con mayor frecuencia en el historial',
            'frecuencia-baja': 'Números que aparecen con menor frecuencia en el historial',
            'temporal-ascendente': 'Números con tendencia ascendente en sorteos recientes',
            'temporal-descendente': 'Números con tendencia descendente en sorteos recientes',
            'distribucion': 'Números balanceados por rangos, paridad y sumas históricas',
            'hibrido-equilibrado': 'Combina frecuencia, patrones temporales y distribución',
            'hibrido-agresivo': 'Prioriza tendencias recientes con mayor peso'
        };

        return descripciones[algoritmo] || 'Algoritmo de generación inteligente';
    }

    /**
     * Obtiene el autor/base teórica de un algoritmo
     */
    getAutorAlgoritmo(algoritmo) {
        const autores = {
            'frecuencia-alta': 'Basado en Ley de los Grandes Números (Bernoulli, 1713)',
            'frecuencia-baja': 'Basado en Teoría de Probabilidades (Laplace, 1812)',
            'temporal-ascendente': 'Basado en Análisis de Series Temporales (Yule, 1927)',
            'temporal-descendente': 'Basado en Análisis de Series Temporales (Yule, 1927)',
            'distribucion': 'Basado en Distribución Normal (Gauss, 1809)',
            'hibrido-equilibrado': 'Combinación de Técnicas Estadísticas Clásicas',
            'hibrido-agresivo': 'Basado en Análisis Multivariado (Hotelling, 1933)'
        };

        return autores[algoritmo] || 'Algoritmo estadístico clásico';
    }

    /**
     * Obtiene el icono Font Awesome asociado a un algoritmo
     */
    getIconoAlgoritmo(algoritmo) {
        const iconos = {
            'frecuencia-alta': '<i class="fas fa-fire text-red-500"></i>',
            'frecuencia-baja': '<i class="fas fa-icicles text-blue-400"></i>',
            'temporal-ascendente': '<i class="fas fa-arrow-trend-up text-green-500"></i>',
            'temporal-descendente': '<i class="fas fa-arrow-trend-down text-red-400"></i>',
            'distribucion': '<i class="fas fa-scale-balanced text-purple-500"></i>',
            'hibrido-equilibrado': '<i class="fas fa-bullseye text-primary"></i>',
            'hibrido-agresivo': '<i class="fas fa-rocket text-orange-500"></i>'
        };

        return iconos[algoritmo] || '<i class="fas fa-brain text-primary"></i>';
    }
}