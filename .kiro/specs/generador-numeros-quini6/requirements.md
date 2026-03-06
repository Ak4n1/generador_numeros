# Requirements Document

## Introduction

Sistema generador de números inteligente para Quini 6 que utiliza algoritmos probabilísticos basados en datos históricos para generar combinaciones de números optimizadas. El sistema se integra con la aplicación existente de Quini 6 que ya cuenta con scraping, base de datos y frontend funcional.

## Glossary

- **Generador_Numeros**: Sistema que genera combinaciones de 6 números del 0-45 para Quini 6
- **Algoritmo_Frecuencia**: Algoritmo que analiza la frecuencia histórica de aparición de números
- **Algoritmo_Temporal**: Algoritmo que identifica patrones temporales en los sorteos
- **Algoritmo_Distribucion**: Algoritmo que analiza distribución de rangos, paridad y sumas
- **Algoritmo_Hibrido**: Algoritmo que combina múltiples estrategias probabilísticas
- **Datos_Historicos**: Base de datos con 66 sorteos históricos de 15 concursos completos
- **Sorteo_Quini6**: Cada sorteo individual (Tradicional, Segunda Vuelta, Revancha, Siempre Sale)
- **Frontend_Quini6**: Interfaz web existente en quini6.html
- **API_Quini6**: Endpoints existentes /api/quini6/ultimo y /api/quini6/historial

## Requirements

### Requirement 1: Integración con Frontend Existente

**User Story:** Como usuario, quiero acceder a los generadores de números desde la interfaz actual de Quini 6, para que pueda generar números sin cambiar de página.

#### Acceptance Criteria

1. THE Frontend_Quini6 SHALL mostrar una nueva sección "Generador de Números" en quini6.html
2. THE Frontend_Quini6 SHALL mantener las secciones existentes "Último Sorteo" e "Historial" sin modificaciones
3. THE Frontend_Quini6 SHALL mostrar múltiples botones de generación, uno por cada algoritmo disponible
4. WHEN el usuario hace clic en cualquier botón generador, THE Frontend_Quini6 SHALL mostrar los 6 números generados en formato visual consistente con el diseño existente

### Requirement 2: Algoritmo de Análisis de Frecuencia

**User Story:** Como usuario, quiero generar números basados en frecuencias históricas, para que pueda elegir entre números "calientes" (más frecuentes) o "fríos" (menos frecuentes).

#### Acceptance Criteria

1. THE Algoritmo_Frecuencia SHALL analizar la frecuencia de aparición de cada número (0-45) en los Datos_Historicos
2. THE Algoritmo_Frecuencia SHALL calcular estadísticas de frecuencia para cada tipo de Sorteo_Quini6 por separado
3. THE Algoritmo_Frecuencia SHALL generar combinaciones priorizando números con alta frecuencia histórica
4. THE Algoritmo_Frecuencia SHALL generar combinaciones priorizando números con baja frecuencia histórica
5. WHEN se solicita generación por frecuencia, THE Generador_Numeros SHALL retornar exactamente 6 números únicos del rango 0-45

### Requirement 3: Algoritmo de Patrones Temporales

**User Story:** Como usuario, quiero generar números basados en patrones temporales, para que pueda aprovechar tendencias recientes en los sorteos.

#### Acceptance Criteria

1. THE Algoritmo_Temporal SHALL analizar patrones de aparición de números en ventanas temporales (últimos 5, 10, 15 sorteos)
2. THE Algoritmo_Temporal SHALL identificar números con tendencia ascendente en frecuencia reciente
3. THE Algoritmo_Temporal SHALL identificar números con tendencia descendente en frecuencia reciente
4. THE Algoritmo_Temporal SHALL ponderar más los sorteos recientes que los antiguos en el cálculo
5. WHEN se solicita generación temporal, THE Generador_Numeros SHALL retornar exactamente 6 números únicos del rango 0-45

### Requirement 4: Algoritmo de Análisis de Distribución

**User Story:** Como usuario, quiero generar números basados en patrones de distribución, para que las combinaciones sigan distribuciones estadísticamente balanceadas.

#### Acceptance Criteria

1. THE Algoritmo_Distribucion SHALL analizar la distribución histórica de rangos numéricos (0-15, 16-30, 31-45)
2. THE Algoritmo_Distribucion SHALL analizar la distribución histórica de números pares e impares
3. THE Algoritmo_Distribucion SHALL analizar la distribución histórica de sumas totales de las combinaciones
4. THE Algoritmo_Distribucion SHALL generar combinaciones que respeten las distribuciones estadísticas históricas
5. WHEN se solicita generación por distribución, THE Generador_Numeros SHALL retornar exactamente 6 números únicos del rango 0-45 con distribución balanceada

### Requirement 5: Algoritmos Híbridos

**User Story:** Como usuario, quiero generar números usando algoritmos híbridos, para que pueda combinar múltiples estrategias probabilísticas en una sola generación.

#### Acceptance Criteria

1. THE Algoritmo_Hibrido SHALL combinar métricas de frecuencia, patrones temporales y distribución
2. THE Algoritmo_Hibrido SHALL asignar pesos configurables a cada estrategia individual
3. THE Algoritmo_Hibrido SHALL generar combinaciones usando puntuación compuesta de todas las estrategias
4. THE Algoritmo_Hibrido SHALL ofrecer al menos 2 variantes con diferentes balances de estrategias
5. WHEN se solicita generación híbrida, THE Generador_Numeros SHALL retornar exactamente 6 números únicos del rango 0-45

### Requirement 6: API de Generación de Números

**User Story:** Como desarrollador, quiero endpoints API para la generación de números, para que el frontend pueda solicitar números generados por cualquier algoritmo.

#### Acceptance Criteria

1. THE API_Quini6 SHALL proporcionar endpoint /api/quini6/generar-numeros
2. WHEN se solicita generación con parámetro de algoritmo, THE API_Quini6 SHALL retornar combinación generada por el algoritmo especificado
3. THE API_Quini6 SHALL soportar parámetros: algoritmo (frecuencia-alta, frecuencia-baja, temporal-ascendente, temporal-descendente, distribucion, hibrido-1, hibrido-2)
4. THE API_Quini6 SHALL retornar respuesta JSON con estructura: {success: boolean, data: {numeros: number[], algoritmo: string, timestamp: string}}
5. IF el algoritmo especificado no existe, THEN THE API_Quini6 SHALL retornar error 400 con mensaje descriptivo

### Requirement 7: Acceso a Datos Históricos

**User Story:** Como sistema generador, quiero acceder eficientemente a los datos históricos, para que pueda realizar cálculos probabilísticos en tiempo real.

#### Acceptance Criteria

1. THE Generador_Numeros SHALL acceder a los Datos_Historicos a través del servicio Supabase existente
2. THE Generador_Numeros SHALL cachear estadísticas calculadas para mejorar rendimiento
3. WHEN se actualiza la base de datos con nuevos sorteos, THE Generador_Numeros SHALL invalidar cache de estadísticas
4. THE Generador_Numeros SHALL completar cualquier generación de números en menos de 2 segundos
5. THE Generador_Numeros SHALL manejar casos donde los Datos_Historicos estén temporalmente no disponibles

### Requirement 8: Interfaz de Usuario para Generación

**User Story:** Como usuario, quiero una interfaz clara para generar números, para que pueda entender qué algoritmo estoy usando y ver los resultados claramente.

#### Acceptance Criteria

1. THE Frontend_Quini6 SHALL mostrar botones claramente etiquetados para cada algoritmo disponible
2. THE Frontend_Quini6 SHALL mostrar descripción breve de cada algoritmo al hacer hover sobre el botón
3. WHEN se generan números, THE Frontend_Quini6 SHALL mostrar los números en el mismo formato visual que los sorteos históricos
4. THE Frontend_Quini6 SHALL mostrar el nombre del algoritmo usado y timestamp de generación
5. THE Frontend_Quini6 SHALL permitir generar nuevas combinaciones sin recargar la página

### Requirement 9: Validación de Números Generados

**User Story:** Como sistema, quiero validar que todos los números generados cumplan las reglas de Quini 6, para que nunca se generen combinaciones inválidas.

#### Acceptance Criteria

1. THE Generador_Numeros SHALL validar que cada combinación contenga exactamente 6 números únicos
2. THE Generador_Numeros SHALL validar que todos los números estén en el rango 0-45 inclusive
3. THE Generador_Numeros SHALL validar que no haya números duplicados en una combinación
4. IF una validación falla, THEN THE Generador_Numeros SHALL regenerar la combinación hasta obtener una válida
5. THE Generador_Numeros SHALL limitar intentos de regeneración a máximo 10 para evitar bucles infinitos

### Requirement 10: Logging y Monitoreo

**User Story:** Como administrador, quiero logs de las generaciones de números, para que pueda monitorear el uso y rendimiento del sistema.

#### Acceptance Criteria

1. THE Generador_Numeros SHALL registrar cada solicitud de generación con timestamp, algoritmo usado y números generados
2. THE Generador_Numeros SHALL registrar tiempo de procesamiento para cada generación
3. THE Generador_Numeros SHALL registrar errores de acceso a datos o fallos de generación
4. THE API_Quini6 SHALL registrar estadísticas de uso por algoritmo
5. THE Generador_Numeros SHALL mantener logs por máximo 30 días para gestión de espacio