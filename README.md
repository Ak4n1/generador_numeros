# 🎲 Generador de Números de Lotería

Aplicación web para generar combinaciones aleatorias de números para diferentes tipos de loterías argentinas.

## 🌐 Demo en Vivo

**[https://ak4n1.github.io/generador_numeros/](https://ak4n1.github.io/generador_numeros/)**

## 📋 Descripción

Generador de números aleatorios diseñado para ayudar a los jugadores de lotería a crear combinaciones de números de forma rápida y personalizada. La aplicación ofrece múltiples opciones de configuración y filtros avanzados para adaptar la generación a las preferencias del usuario.

## ✨ Características Principales

### Tipos de Lotería Soportados
- **6 Números (0-45)**: Genera 6 números únicos del 0 al 45
- **Número de 1 Cifra**: Del 0 al 9
- **Número de 2 Cifras**: Del 00 al 99
- **Número de 3 Cifras**: Del 000 al 999
- **Número de 4 Cifras**: Del 0000 al 9999

### Configuración Básica
- **Cantidad de jugadas**: Genera de 1 a 50 combinaciones simultáneamente
- **Números fijos**: Agrega números específicos que siempre aparecerán en las combinaciones
- **Rango personalizado**: Define un rango específico de números (ej: solo del 10 al 30)
- **Filtros par/impar**: Genera solo números pares, impares, o ambos

### Filtros Avanzados (Solo para 6 Números)
- **Rangos individuales**: Define un rango diferente para cada uno de los 6 números
- **Filtros por posición**: Aplica filtros (Auto/Pares/Impares/Múltiplos) a cada número individualmente
- **Múltiplos personalizados**: Genera números que sean múltiplos de un valor específico (ej: múltiplos de 3, 5, 7, etc.)
- **Números fijos por posición**: Fija un número específico en cualquier posición
- **Presets rápidos**: 
  - "Resetear Todo": Vuelve todos los números a configuración por defecto (0-45)
  - "Distribuido": Divide automáticamente el rango en 6 segmentos iguales
- **Validación en tiempo real**: Muestra cuántos números están disponibles según la configuración actual

### Generación y Gestión
- **Generación manual**: Genera combinaciones con un clic
- **Generación automática**: Modo AUTO que genera combinaciones continuamente cada 1.5 segundos
- **Shuffle individual**: Mezcla aleatoriamente los números de una combinación específica
- **Auto-shuffle por item**: Activa mezcla automática continua para combinaciones individuales
- **Guardar favoritos**: Guarda las combinaciones que te gusten en localStorage
- **Copiar al portapapeles**: Copia rápidamente cualquier combinación generada

### Interfaz y Experiencia
- **Diseño moderno**: Interfaz oscura con acentos morados y animaciones suaves
- **Responsive**: Funciona perfectamente en móviles, tablets y escritorio
- **Modales personalizados**: Mensajes de error y confirmación con diseño consistente
- **Feedback visual**: Indicadores de estado, validaciones en tiempo real, y notificaciones toast
- **Confirmaciones inteligentes**: Solicita confirmación antes de cambiar configuración durante generación automática

## 🛠️ Tecnologías

- **HTML5**: Estructura semántica
- **Tailwind CSS**: Estilos y diseño responsive
- **JavaScript ES6+**: Lógica de la aplicación con módulos
- **Font Awesome**: Iconografía
- **LocalStorage**: Persistencia de datos

## 🏗️ Arquitectura

El proyecto sigue principios de **Clean Architecture** con separación clara de responsabilidades:

```
js/
├── controllers/     # Lógica de control y coordinación
├── services/        # Lógica de negocio y servicios
├── generadores/     # Algoritmos de generación de números
├── ui/             # Componentes de interfaz de usuario
└── utils/          # Utilidades y validaciones
```

## 🚀 Uso

1. Selecciona el tipo de lotería
2. Configura la cantidad de jugadas deseadas
3. (Opcional) Agrega números fijos
4. (Opcional) Activa rango personalizado
5. (Opcional) Aplica filtros par/impar
6. (Opcional) Para 6 números, usa filtros avanzados
7. Haz clic en "GENERAR" o activa el modo "AUTO"
8. Guarda tus combinaciones favoritas

## 📦 Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/Ak4n1/generador_numeros.git

# Navegar al directorio
cd generador_numeros

# Abrir index.html en tu navegador
# No requiere instalación de dependencias
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👤 Autor

**Ak4n1**
- Portfolio: [ak4n1.site](https://ak4n1.site)
- GitHub: [@Ak4n1](https://github.com/Ak4n1)

## ⚠️ Disclaimer

Esta aplicación es solo para fines de entretenimiento. Juega con responsabilidad. Los números generados son completamente aleatorios y no garantizan ningún resultado en loterías reales.

---

⭐ Si te gusta este proyecto, dale una estrella en GitHub!
