export class Validador {
    static validarNumero(numero, tipo) {
        switch (tipo) {
            case '6-numeros':
                return this.validarQuini6(numero);
            
            case 'quiniela-1':
                return this.validarQuiniela(numero, 1);
            
            case 'quiniela-2':
                return this.validarQuiniela(numero, 2);
            
            case 'quiniela-3':
                return this.validarQuiniela(numero, 3);
            
            case 'quiniela-4':
                return this.validarQuiniela(numero, 4);
            
            default:
                return { valido: false, mensaje: 'Tipo de lotería no válido' };
        }
    }

    static validarQuini6(numero) {
        const num = parseInt(numero);
        
        if (isNaN(num)) {
            return { valido: false, mensaje: 'Debe ser un número válido' };
        }
        
        if (num < 0 || num > 45) {
            return { valido: false, mensaje: 'El número debe estar entre 0 y 45' };
        }
        
        return { valido: true, numero: num };
    }

    static validarQuiniela(numero, cifras) {
        const num = parseInt(numero);
        const max = Math.pow(10, cifras) - 1;
        
        if (isNaN(num)) {
            return { valido: false, mensaje: 'Debe ser un número válido' };
        }
        
        if (num < 0 || num > max) {
            return { valido: false, mensaje: `El número debe estar entre 0 y ${max}` };
        }
        
        return { valido: true, numero: num };
    }

    static validarRango(min, max, tipo) {
        const minNum = parseInt(min);
        const maxNum = parseInt(max);

        if (isNaN(minNum) || isNaN(maxNum)) {
            return { valido: false, mensaje: 'Los valores de rango deben ser números válidos.' };
        }

        if (minNum >= maxNum) {
            return { valido: false, mensaje: 'El valor mínimo debe ser menor que el máximo.' };
        }

        const cantidadEnRango = maxNum - minNum + 1;

        switch (tipo) {
            case '6-numeros':
                if (minNum < 0 || maxNum > 45) {
                    return { valido: false, mensaje: 'El rango debe estar entre 0 y 45 para este tipo de lotería.' };
                }
                // Validar que haya al menos 6 números en el rango
                if (cantidadEnRango < 6) {
                    return { 
                        valido: false, 
                        mensaje: `<strong>Rango insuficiente</strong><br><br>
                                 Tu rango actual es de <strong>${minNum}</strong> a <strong>${maxNum}</strong>, 
                                 lo que solo incluye <strong>${cantidadEnRango} número${cantidadEnRango !== 1 ? 's' : ''}</strong>.<br><br>
                                 Para generar una combinación de <strong>6 números</strong>, 
                                 necesitas un rango con al menos <strong>6 números diferentes</strong>.<br><br>
                                 <em>Sugerencia: Amplía el rango a al menos 6 números (por ejemplo: 0-5, 0-10, etc.)</em>` 
                    };
                }
                break;
            
            case 'quiniela-1':
                if (minNum < 0 || maxNum > 9) {
                    return { valido: false, mensaje: 'El rango debe estar entre 0 y 9 para números de 1 cifra.' };
                }
                break;
            
            case 'quiniela-2':
                if (minNum < 0 || maxNum > 99) {
                    return { valido: false, mensaje: 'El rango debe estar entre 0 y 99 para números de 2 cifras.' };
                }
                break;
            
            case 'quiniela-3':
                if (minNum < 0 || maxNum > 999) {
                    return { valido: false, mensaje: 'El rango debe estar entre 0 y 999 para números de 3 cifras.' };
                }
                break;
            
            case 'quiniela-4':
                if (minNum < 0 || maxNum > 9999) {
                    return { valido: false, mensaje: 'El rango debe estar entre 0 y 9999 para números de 4 cifras.' };
                }
                break;
            
            default:
                return { valido: false, mensaje: 'Tipo de lotería no válido.' };
        }

        return { valido: true, min: minNum, max: maxNum };
    }

    static validarRangoConFiltros(min, max, tipo, soloPares, soloImpares) {
        const validacionBasica = this.validarRango(min, max, tipo);
        if (!validacionBasica.valido) {
            return validacionBasica;
        }

        const minNum = validacionBasica.min;
        const maxNum = validacionBasica.max;

        // Si hay filtro de pares o impares, validar que haya suficientes números
        if (tipo === '6-numeros' && (soloPares || soloImpares)) {
            let numerosDisponibles = [];
            
            for (let i = minNum; i <= maxNum; i++) {
                if (soloPares && i % 2 === 0) numerosDisponibles.push(i);
                if (soloImpares && i % 2 !== 0) numerosDisponibles.push(i);
            }

            const cantidad = numerosDisponibles.length;

            if (cantidad < 6) {
                const filtroTexto = soloPares ? 'pares' : 'impares';
                const ejemplos = numerosDisponibles.length > 0 
                    ? `Los números ${filtroTexto} en este rango son: <strong>${numerosDisponibles.join(', ')}</strong>` 
                    : `No hay números ${filtroTexto} en este rango.`;
                
                return { 
                    valido: false, 
                    mensaje: `<strong>Filtro incompatible con el rango</strong><br><br>
                             Has configurado:<br>
                             • Rango: <strong>${minNum} - ${maxNum}</strong><br>
                             • Filtro: <strong>Solo ${filtroTexto}</strong><br><br>
                             ${ejemplos}<br><br>
                             Para generar <strong>6 números ${filtroTexto}</strong>, 
                             necesitas un rango que contenga al menos 6 números ${filtroTexto}.<br><br>
                             <em>Sugerencias:</em><br>
                             • Amplía el rango (por ejemplo: ${soloPares ? '0-10' : '1-11'} tiene 6 números ${filtroTexto})<br>
                             • Cambia el filtro a "Auto" para usar todos los números del rango` 
                };
            }
        }

        return validacionBasica;
    }

    static validarCantidadJugadas(cantidad) {
        const num = parseInt(cantidad);
        
        if (isNaN(num)) {
            return { valido: false, mensaje: 'Debe ser un número válido' };
        }
        
        if (num < 1 || num > 50) {
            return { valido: false, mensaje: 'La cantidad debe estar entre 1 y 50' };
        }
        
        return { valido: true, cantidad: num };
    }
}
