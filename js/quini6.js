import Quini6APIService from './services/Quini6APIService.js';

const apiService = new Quini6APIService();

// Cargar resultados de hoy (último sorteo de la base de datos)
async function cargarResultadosHoy() {
    const container = document.getElementById('resultados-hoy');
    container.innerHTML = `
        <div class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
    `;

    try {
        const response = await fetch(`${apiService.apiUrl}/api/quini6/ultimo`);
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            mostrarResultados(data.data, container, data.timestamp);
        } else {
            container.innerHTML = `
                <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                    <i class="fas fa-inbox text-slate-500 text-3xl mb-2"></i>
                    <p class="text-slate-400">No hay resultados disponibles</p>
                </div>
            `;
        }
    } catch (error) {
        container.innerHTML = `
            <div class="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                <i class="fas fa-exclamation-circle text-red-500 text-3xl mb-2"></i>
                <p class="text-red-500 font-semibold">Error al cargar resultados</p>
                <p class="text-slate-400 text-sm mt-1">${error.message}</p>
            </div>
        `;
    }
}

// Cargar historial
async function cargarHistorial() {
    const container = document.getElementById('historial');
    container.innerHTML = `
        <div class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
    `;

    try {
        const response = await fetch(`${apiService.apiUrl}/api/quini6/historial?limite=20`);
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            mostrarHistorial(data.data, container);
        } else {
            container.innerHTML = `
                <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                    <i class="fas fa-inbox text-slate-500 text-3xl mb-2"></i>
                    <p class="text-slate-400">No hay datos en el historial aún</p>
                </div>
            `;
        }
    } catch (error) {
        container.innerHTML = `
            <div class="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                <i class="fas fa-exclamation-circle text-red-500 text-3xl mb-2"></i>
                <p class="text-red-500 font-semibold">Error al cargar historial</p>
                <p class="text-slate-400 text-sm mt-1">${error.message}</p>
            </div>
        `;
    }
}

// Mostrar resultados
function mostrarResultados(resultados, container, timestamp) {
    if (!resultados || resultados.length === 0) {
        container.innerHTML = `
            <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                <p class="text-slate-400">No hay resultados disponibles</p>
            </div>
        `;
        return;
    }

    const fecha = resultados[0].fecha;
    const concurso = resultados[0].concurso;

    let html = `
        <div class="bg-slate-900/50 border border-primary/20 rounded-xl p-6 mb-4">
            <div class="text-center mb-4">
                <div class="text-lg text-slate-300">Sorteo del ${fecha}</div>
                <div class="text-sm text-slate-500">Concurso N° ${concurso}</div>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
    `;

    resultados.forEach(resultado => {
        const nombreSorteo = apiService.formatearNombreSorteo(resultado.sorteo);
        html += `
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div class="font-semibold text-slate-200 mb-3 text-center">${nombreSorteo}</div>
                <div class="flex gap-2 justify-center flex-wrap">
                    ${resultado.numeros.map(num => `
                        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg">
                            ${num.toString().padStart(2, '0')}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });

    html += `
            </div>
            <div class="text-center mt-4 pt-4 border-t border-slate-700">
                <div class="text-xs text-slate-500">
                    Fuente: Base de datos histórica | Actualizado: ${new Date(timestamp).toLocaleString('es-AR')}
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// Mostrar historial
function mostrarHistorial(datos, container) {
    // Agrupar por concurso
    const porConcurso = {};
    datos.forEach(item => {
        if (!porConcurso[item.concurso]) {
            porConcurso[item.concurso] = {
                concurso: item.concurso,
                fecha: item.fecha,
                sorteos: []
            };
        }
        porConcurso[item.concurso].sorteos.push(item);
    });

    let html = '';
    Object.values(porConcurso).forEach(grupo => {
        html += `
            <div class="bg-slate-900/50 border border-slate-700 rounded-xl p-6 mb-4">
                <div class="text-center mb-4">
                    <div class="text-lg text-slate-300">Concurso N° ${grupo.concurso}</div>
                    <div class="text-sm text-slate-500">${new Date(grupo.fecha).toLocaleDateString('es-AR')}</div>
                </div>
                <div class="grid md:grid-cols-2 gap-4">
        `;

        grupo.sorteos.forEach(sorteo => {
            const nombreSorteo = apiService.formatearNombreSorteo(sorteo.sorteo);
            html += `
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <div class="font-semibold text-slate-200 mb-3 text-center text-sm">${nombreSorteo}</div>
                    <div class="flex gap-2 justify-center flex-wrap">
                        ${sorteo.numeros.map(num => `
                            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                                ${num.toString().padStart(2, '0')}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Event listeners
document.getElementById('btn-actualizar').addEventListener('click', cargarResultadosHoy);

// Cargar datos al iniciar
cargarResultadosHoy();
cargarHistorial();
