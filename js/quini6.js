import Quini6APIService from './services/Quini6APIService.js';

const apiService = new Quini6APIService();

// Cargar último sorteo (scraping en tiempo real)
async function cargarUltimoSorteo() {
    const container = document.getElementById('ultimo-sorteo');
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
                <p class="text-red-500 font-semibold">Error al cargar último sorteo</p>
                <p class="text-slate-400 text-sm mt-1">${error.message}</p>
            </div>
        `;
    }
}

// Cargar historial
let paginaActual = 1;
const concursosPorPagina = 10;

async function cargarHistorial(pagina = 1) {
    const container = document.getElementById('historial');
    
    if (pagina === 1) {
        container.innerHTML = `
            <div class="flex items-center justify-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        `;
    }

    try {
        const response = await fetch(`${apiService.apiUrl}/api/quini6/historial`);
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            // Agrupar por concurso
            const porConcurso = {};
            data.data.forEach(item => {
                if (!porConcurso[item.concurso]) {
                    porConcurso[item.concurso] = {
                        concurso: item.concurso,
                        fecha: item.fecha,
                        sorteos: []
                    };
                }
                porConcurso[item.concurso].sorteos.push(item);
            });
            
            const concursos = Object.values(porConcurso)
                .sort((a, b) => parseInt(b.concurso) - parseInt(a.concurso)); // Orden descendente
            const totalPaginas = Math.ceil(concursos.length / concursosPorPagina);
            const inicio = (pagina - 1) * concursosPorPagina;
            const fin = inicio + concursosPorPagina;
            const concursosPagina = concursos.slice(inicio, fin);
            
            mostrarHistorial(concursosPagina, container, pagina, totalPaginas, concursos.length);
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
                    Fuente: notitimba.com | Actualizado: ${new Date(timestamp).toLocaleString('es-AR')}
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// Mostrar historial
function mostrarHistorial(concursos, container, paginaActual, totalPaginas, totalConcursos) {
    let html = '<div class="grid md:grid-cols-3 gap-4">';
    
    concursos.forEach(grupo => {
        html += `
            <div class="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
                <div class="text-center mb-3">
                    <div class="text-base font-bold text-slate-200">Concurso N° ${grupo.concurso}</div>
                    <div class="text-xs text-slate-500">${new Date(grupo.fecha).toLocaleDateString('es-AR')}</div>
                </div>
                <div class="space-y-2">
        `;

        grupo.sorteos.forEach(sorteo => {
            const nombreSorteo = apiService.formatearNombreSorteo(sorteo.sorteo);
            html += `
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-2">
                    <div class="font-semibold text-slate-200 mb-2 text-center text-xs">${nombreSorteo}</div>
                    <div class="flex gap-1 justify-center flex-wrap">
                        ${sorteo.numeros.map(num => `
                            <div class="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-lg">
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
    
    html += '</div>';
    
    // Agregar controles de paginación
    if (totalPaginas > 1) {
        html += `
            <div class="flex items-center justify-center gap-4 mt-6">
                <button 
                    id="btn-prev" 
                    class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    ${paginaActual === 1 ? 'disabled' : ''}
                >
                    <i class="fas fa-chevron-left mr-2"></i>Anterior
                </button>
                
                <div class="text-slate-400">
                    Página ${paginaActual} de ${totalPaginas} (${totalConcursos} concursos)
                </div>
                
                <button 
                    id="btn-next" 
                    class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    ${paginaActual === totalPaginas ? 'disabled' : ''}
                >
                    Siguiente<i class="fas fa-chevron-right ml-2"></i>
                </button>
            </div>
        `;
    }

    container.innerHTML = html;
    
    // Agregar event listeners para paginación
    if (totalPaginas > 1) {
        document.getElementById('btn-prev')?.addEventListener('click', () => {
            if (paginaActual > 1) {
                cargarHistorial(paginaActual - 1);
                paginaActual--;
            }
        });
        
        document.getElementById('btn-next')?.addEventListener('click', () => {
            if (paginaActual < totalPaginas) {
                cargarHistorial(paginaActual + 1);
                paginaActual++;
            }
        });
    }
}

// Event listeners
document.getElementById('btn-actualizar').addEventListener('click', cargarUltimoSorteo);

// Cargar datos al iniciar
cargarUltimoSorteo();
cargarHistorial();
