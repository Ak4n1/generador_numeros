# Algoritmos Inteligentes para Generación de Números - Quini 6

## Contexto
Sistema de generación de números para la lotería argentina Quini 6 (6 números del 0 al 45) basado en análisis estadístico de datos históricos reales. Los algoritmos implementan técnicas probabilísticas clásicas para identificar patrones en sorteos pasados.

## Base de Datos
- **Fuente**: Sorteos históricos del Quini 6 (64+ sorteos)
- **Estructura**: Cada sorteo contiene 6 números únicos del 0 al 45
- **Actualización**: Automática vía scraping de sitios oficiales

## Algoritmos Implementados

### 1. Frecuencia Alta (Números Calientes)
**Base Teórica**: Ley de los Grandes Números (Bernoulli, 1713)

**Qué hace**: Identifica números que aparecen con mayor frecuencia en el historial
**Cómo lo hace**:
```
Para cada número n (0-45):
  frecuencia(n) = apariciones(n) / total_sorteos
  
Selección ponderada:
  peso(n) = frecuencia(n) + 0.001
  probabilidad_selección(n) = peso(n) / suma_total_pesos
```

**Para qué**: Asume que números "calientes" tienen mayor probabilidad de salir

### 2. Frecuencia Baja (Números Fríos)
**Base Teórica**: Teoría de Probabilidades (Laplace, 1812)

**Qué hace**: Selecciona números que aparecen con menor frecuencia
**Cómo lo hace**:
```
peso_invertido(n) = 1 / (frecuencia(n) + 0.001)
```

**Para qué**: Teoría de "compensación" - números que han salido poco "deben" salir más

### 3. Temporal Ascendente
**Base Teórica**: Análisis de Series Temporales (Yule, 1927)

**Qué hace**: Identifica números con tendencia ascendente reciente
**Cómo lo hace**:
```
frecuencia_reciente(n) = apariciones_últimos_15_sorteos(n) / 15
frecuencia_histórica(n) = apariciones_totales(n) / total_sorteos
tendencia(n) = frecuencia_reciente(n) - frecuencia_histórica(n)

Filtro: solo números con tendencia(n) > 0
Ordenamiento: por tendencia descendente
```

**Para qué**: Captura números que están "subiendo" en frecuencia

### 4. Temporal Descendente
**Qué hace**: Identifica números con tendencia descendente reciente
**Cómo lo hace**:
```
Filtro: solo números con tendencia(n) < 0
Selección ponderada invertida por valor absoluto de tendencia
```

**Para qué**: Números que están "bajando" pero podrían "rebotar"

### 5. Distribución Balanceada
**Base Teórica**: Distribución Normal (Gauss, 1809)

**Qué hace**: Respeta las proporciones históricas por rangos numéricos
**Cómo lo hace**:
```
Rangos:
  - Bajo: 0-15
  - Medio: 16-30  
  - Alto: 31-45

Para cada rango r:
  proporción_histórica(r) = números_rango(r) / total_números_históricos
  objetivo(r) = round(proporción_histórica(r) * 6)

Ajuste para suma exacta = 6:
  if suma_objetivos ≠ 6:
    ajustar_rango_con_mayor_proporción(diferencia)
```

**Para qué**: Mantiene balance estadístico similar al histórico

### 6. Híbrido Equilibrado
**Base Teórica**: Combinación de Técnicas Estadísticas Clásicas

**Qué hace**: Combina resultados de múltiples algoritmos
**Cómo lo hace**:
```
numeros_freq = frecuencia_alta()
numeros_temp = temporal_ascendente()  
numeros_dist = distribución_balanceada()

pool = unique(numeros_freq ∪ numeros_temp ∪ numeros_dist)
selección = random_shuffle(pool).slice(0, 6)
```

**Para qué**: Diversifica estrategias para reducir sesgo de un solo método

### 7. Híbrido Agresivo
**Base Teórica**: Análisis Multivariado (Hotelling, 1933)

**Qué hace**: Prioriza tendencias recientes con pesos específicos
**Cómo lo hace**:
```
Composición ponderada:
  - 50% temporal ascendente (3 números)
  - 30% frecuencia alta (2 números)  
  - 20% distribución (1 número)

pool = temporal[0:3] + frecuencia[0:2] + distribución[0:1]
completar_con_aleatorios_si_necesario()
```

**Para qué**: Enfoque agresivo en patrones recientes

## Selección Ponderada (Método Común)
```
Para candidatos C con propiedad P:
  pesos = [P(c) + 0.001 for c in C]  // Evita división por 0
  total_peso = sum(pesos)
  
  random_value = random() * total_peso
  acumulado = 0
  
  for i, peso in enumerate(pesos):
    acumulado += peso
    if random_value <= acumulado and not usado(C[i]):
      seleccionar(C[i])
      break
```

## Limitaciones Reconocidas
1. **Falacia del Jugador**: Los sorteos son independientes
2. **Sesgo de Confirmación**: Patrones pueden ser coincidencias
3. **Muestra Limitada**: 64 sorteos es estadísticamente pequeño
4. **Aleatoriedad Real**: Las loterías usan generadores verdaderamente aleatorios

## Objetivo del Sistema
No predecir números ganadores (imposible), sino:
- Proporcionar selecciones "inteligentes" basadas en datos reales
- Ofrecer alternativas al azar puro
- Satisfacer la psicología del jugador que busca "estrategia"
- Demostrar aplicación de técnicas estadísticas clásicas

## Implementación Técnica
- **Frontend**: JavaScript puro, cálculos en navegador
- **Datos**: API REST con historial actualizado automáticamente
- **Caché**: 5 minutos para estadísticas calculadas
- **Validación**: Siempre 6 números únicos del 0-45

---

**Nota**: Este sistema es para entretenimiento y demostración educativa. Las loterías son juegos de azar puro donde cada sorteo es independiente y equiprobable.