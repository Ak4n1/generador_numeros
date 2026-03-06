import { GeneradorBase } from './base.js';

export class GeneradorTipoMultipleCifras extends GeneradorBase {
    constructor(config = {}) {
        super(config);
        this.cifras = config.cifras || 4;
        this.cantidadNumeros = config.cantidadNumeros || 20;
    }

    generar() {
        const min = 0;
        const max = Math.pow(10, this.cifras) - 1;
        const numeros = new Set();

        // Agregar números fijos primero
        this.numerosFijos.forEach(num => {
            if (num >= min && num <= max) {
                numeros.add(num);
            }
        });

        // Determinar rango efectivo
        let rangoMin = this.usarRango ? Math.max(this.rangoMin, min) : min;
        let rangoMax = this.usarRango ? Math.min(this.rangoMax, max) : max;

        // Generar números aleatorios
        let intentos = 0;
        const maxIntentos = 10000;

        while (numeros.size < this.cantidadNumeros && intentos < maxIntentos) {
            const numero = this.generarNumeroAleatorio(rangoMin, rangoMax);
            
            if (this.esValido(numero)) {
                numeros.add(numero);
            }
            
            intentos++;
        }

        // Convertir a array y formatear
        const resultado = Array.from(numeros).map(num => 
            this.formatearNumero(num, this.cifras)
        );

        return {
            tipo: `Quiniela ${this.cifras} Cifra${this.cifras > 1 ? 's' : ''}`,
            numeros: resultado,
            fecha: this.obtenerFechaHora(),
            descripcion: `${this.cantidadNumeros} números de ${this.cifras} cifra${this.cifras > 1 ? 's' : ''}`
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

export class GeneradorQuinielaCompleta extends GeneradorBase {
    constructor(config = {}) {
        super(config);
    }

    generar() {
        const numeros = [];
        const min = 0;
        const max = 9999;

        // Generar 20 números de 4 cifras
        for (let posicion = 1; posicion <= 20; posicion++) {
            let numero;
            
            // Si hay números fijos y esta es una posición aleatoria para insertarlos
            if (this.numerosFijos.length > 0 && Math.random() < 0.3 && this.numerosFijos.length > 0) {
                const indiceAleatorio = Math.floor(Math.random() * this.numerosFijos.length);
                numero = this.numerosFijos[indiceAleatorio];
                
                // Validar que esté en rango
                if (numero < min || numero > max) {
                    numero = this.generarNumeroAleatorio(min, max);
                }
            } else {
                // Determinar rango efectivo
                let rangoMin = this.usarRango ? Math.max(this.rangoMin, min) : min;
                let rangoMax = this.usarRango ? Math.min(this.rangoMax, max) : max;

                let intentos = 0;
                do {
                    numero = this.generarNumeroAleatorio(rangoMin, rangoMax);
                    intentos++;
                } while (!this.esValido(numero) && intentos < 100);
            }

            numeros.push({
                posicion,
                numero: this.formatearNumero(numero, 4)
            });
        }

        return {
            tipo: 'Quiniela Completa',
            numeros: numeros,
            fecha: this.obtenerFechaHora(),
            descripcion: '20 posiciones con números de 4 cifras'
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
