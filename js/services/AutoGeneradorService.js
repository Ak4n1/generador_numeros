/**
 * Servicio para manejar la generación automática continua de números
 */
export class AutoGeneradorService {
    constructor() {
        this.isRunning = false;
        this.intervalId = null;
        this.onGenerate = null;
        this.delay = 500; // 1.5 segundos entre generaciones
    }

    /**
     * Inicia la generación automática
     */
    start(callback) {
        if (this.isRunning) return;

        this.isRunning = true;
        this.onGenerate = callback;

        // Generar inmediatamente
        this.onGenerate();

        // Continuar generando cada X segundos
        this.intervalId = setInterval(() => {
            if (this.isRunning && this.onGenerate) {
                this.onGenerate();
            }
        }, this.delay);
    }

    /**
     * Detiene la generación automática
     */
    stop() {
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    /**
     * Pausa la generación automática (mantiene el estado)
     */
    pause() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
    }

    /**
     * Reanuda la generación automática
     */
    resume(callback) {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.onGenerate = callback || this.onGenerate;

        this.intervalId = setInterval(() => {
            if (this.isRunning && this.onGenerate) {
                this.onGenerate();
            }
        }, this.delay);
    }

    /**
     * Verifica si está corriendo
     */
    getIsRunning() {
        return this.isRunning;
    }

    /**
     * Cambia la velocidad de generación
     */
    setDelay(milliseconds) {
        this.delay = milliseconds;
        
        // Si está corriendo, reiniciar con el nuevo delay
        if (this.isRunning && this.onGenerate) {
            this.stop();
            this.start(this.onGenerate);
        }
    }
}
