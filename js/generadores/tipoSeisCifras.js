import { GeneradorBase } from './base.js';

export class GeneradorTipoSeisCifras extends GeneradorBase {
    constructor(config = {}) {
        super(config);
        this.min = 0;
        this.max = 45;
        this.cantidadNumeros = 6;
    }

    generar() {
        const numeros = [];
        
        // Si hay filtros avanzados, usar rangos individuales por posición
        if (this.filtrosAvanzados && this.filtrosAvanzados.rangos) {
            const { rangos } = this.filtrosAvanzados;
            
            // Generar un número para cada posición según su rango
            for (let i = 0; i < 6; i++) {
                const rango = rangos[i];
                
                // Si hay número fijo configurado, usarlo directamente
                if (rango.numeroFijo !== null && rango.numeroFijo !== undefined) {
                    numeros.push(rango.numeroFijo);
                    continue;
                }
                
                let numero;
                let intentos = 0;
                const maxIntentos = 1000;
                
                // Generar número único dentro del rango de esta posición
                do {
                    numero = this.generarNumeroAleatorio(rango.min, rango.max);
                    intentos++;
                } while (numeros.includes(numero) && intentos < maxIntentos);
                
                // Validar con filtros par/impar del rango individual
                const cumpleFiltroRango = rango.filtro === 'auto' || 
                    (rango.filtro === 'pares' && numero % 2 === 0) ||
                    (rango.filtro === 'impares' && numero % 2 !== 0) ||
                    (rango.filtro === 'multiplos' && rango.multiplo && numero % rango.multiplo === 0);
                
                // También validar con filtros globales
                const cumpleFiltroGlobal = this.esValido(numero);
                
                if (cumpleFiltroRango && cumpleFiltroGlobal) {
                    numeros.push(numero);
                } else {
                    // Si no es válido, buscar uno válido en el rango
                    let encontrado = false;
                    for (let j = rango.min; j <= rango.max && !encontrado; j++) {
                        const cumpleRango = rango.filtro === 'auto' || 
                            (rango.filtro === 'pares' && j % 2 === 0) ||
                            (rango.filtro === 'impares' && j % 2 !== 0) ||
                            (rango.filtro === 'multiplos' && rango.multiplo && j % rango.multiplo === 0);
                        
                        if (cumpleRango && this.esValido(j) && !numeros.includes(j)) {
                            numeros.push(j);
                            encontrado = true;
                        }
                    }
                    
                    // Si no se encontró ninguno válido, agregar el número de todas formas
                    if (!encontrado && numeros.length < 6) {
                        numeros.push(numero);
                    }
                }
            }
            
        } else {
            // Lógica original sin filtros avanzados
            const numerosSet = new Set();
            
            // Agregar números fijos primero
            this.numerosFijos.forEach(num => {
                if (num >= this.min && num <= this.max) {
                    numerosSet.add(num);
                }
            });

            // Determinar rango efectivo
            let rangoMin = this.usarRango ? Math.max(this.rangoMin, this.min) : this.min;
            let rangoMax = this.usarRango ? Math.min(this.rangoMax, this.max) : this.max;

            // Generar números aleatorios hasta completar 6
            let intentos = 0;
            const maxIntentos = 1000;

            while (numerosSet.size < this.cantidadNumeros && intentos < maxIntentos) {
                const numero = this.generarNumeroAleatorio(rangoMin, rangoMax);
                
                if (this.esValido(numero)) {
                    numerosSet.add(numero);
                }
                
                intentos++;
            }

            // Convertir a array y ordenar
            numeros.push(...Array.from(numerosSet));
        }

        return {
            tipo: '6 Números (0-45)',
            numeros: numeros,
            fecha: this.obtenerFechaHora(),
            descripcion: `6 números del ${this.min} al ${this.max}`
        };
    }

    generarMultiples(cantidad) {
        const jugadas = [];
        for (let i = 0; i < cantidad; i++) {
            jugadas.push(this.generar());
        }
        return jugadas;
    }
}
