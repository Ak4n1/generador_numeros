export class GeneradorBase {
    constructor(config = {}) {
        this.config = config; // Guardar config completo
        this.numerosFijos = config.numerosFijos || [];
        this.usarRango = config.usarRango || false;
        this.rangoMin = config.rangoMin || 0;
        this.rangoMax = config.rangoMax || 100;
        this.soloPares = config.soloPares || false;
        this.soloImpares = config.soloImpares || false;
        this.filtrosAvanzados = config.filtrosAvanzados || null;
    }

    generarNumeroAleatorio(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    esValido(numero) {
        if (this.soloPares && numero % 2 !== 0) return false;
        if (this.soloImpares && numero % 2 === 0) return false;
        return true;
    }

    mezclarArray(array) {
        const resultado = [...array];
        for (let i = resultado.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
        }
        return resultado;
    }

    formatearNumero(numero, cifras) {
        return numero.toString().padStart(cifras, '0');
    }

    obtenerFechaHora() {
        const ahora = new Date();
        return ahora.toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}
