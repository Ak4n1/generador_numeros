/**
 * Servicio para manejar el auto-shuffle de items individuales
 */
export class ItemAutoShuffleService {
    constructor() {
        this.activeShuffles = new Map(); // itemId -> intervalId
        this.delay = 1000; // 1 segundo entre shuffles
    }

    /**
     * Inicia el auto-shuffle para un item específico
     */
    start(itemId, onShuffle) {
        if (this.activeShuffles.has(itemId)) {
            return; // Ya está corriendo
        }

        const intervalId = setInterval(() => {
            onShuffle(itemId);
        }, this.delay);

        this.activeShuffles.set(itemId, intervalId);
    }

    /**
     * Detiene el auto-shuffle de un item
     */
    stop(itemId) {
        const intervalId = this.activeShuffles.get(itemId);
        if (intervalId) {
            clearInterval(intervalId);
            this.activeShuffles.delete(itemId);
        }
    }

    /**
     * Verifica si un item está en auto-shuffle
     */
    isRunning(itemId) {
        return this.activeShuffles.has(itemId);
    }

    /**
     * Detiene todos los auto-shuffles
     */
    stopAll() {
        this.activeShuffles.forEach((intervalId) => {
            clearInterval(intervalId);
        });
        this.activeShuffles.clear();
    }
}
