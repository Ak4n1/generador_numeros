# 🎰 Generador de Números - Lotería

Aplicación web moderna y modular para generar números de lotería con opciones personalizadas. Diseño profesional con Tailwind CSS.

## 🎯 Características

### Tipos de Lotería Soportados
- **6 Números (1-45)**: Para loterías tipo Quini 6, Loto, etc.
- **Quiniela Completa**: 20 posiciones con números de 4 cifras (0000-9999)
- **Quiniela 1 Cifra**: 10 números del 0 al 9
- **Quiniela 2 Cifras**: 10 números del 00 al 99
- **Quiniela 3 Cifras**: 15 números del 000 al 999
- **Quiniela 4 Cifras**: 20 números del 0000 al 9999

### Funcionalidades

#### ✨ Generación Personalizada
- Generación completamente aleatoria
- Agregar números fijos que se incluirán en la jugada
- Generar múltiples jugadas (1-50) con slider
- Rangos personalizados de números
- Filtros: Auto, Solo pares, Solo impares

#### 💾 Gestión de Números
- Guardar jugadas favoritas en localStorage
- Ver historial de números guardados
- Eliminar números guardados individualmente
- Limpiar todos los guardados
- Copiar números al portapapeles

#### 🎨 Interfaz
- Diseño moderno con Tailwind CSS
- Modo oscuro incluido
- Iconos Material Symbols
- Visualización clara de resultados:
  - Bolillas circulares para "6 Números"
  - Rectángulos con posiciones para Quiniela Completa
  - Tags para quinielas simples
- Notificaciones elegantes
- Responsive (móvil, tablet, desktop)

## 📁 Estructura del Proyecto

```
loteria-argentina/
├── index.html                  # Página principal con Tailwind CSS
├── js/
│   ├── main.js                # Controlador principal
│   ├── generadores/
│   │   ├── base.js           # Clase base para generadores
│   │   ├── quini6.js         # Generador 6 números
│   │   └── quiniela.js       # Generadores Quiniela
│   ├── utils/
│   │   ├── validaciones.js   # Validaciones con switch
│   │   └── helpers.js        # Helpers y localStorage
│   └── ui/
│       └── resultados.js     # Renderizado de UI con Tailwind
└── README.md
```

## 🚀 Uso

1. Abre `index.html` en tu navegador
2. Selecciona el tipo de lotería
3. (Opcional) Configura opciones:
   - Ajusta cantidad de jugadas con el slider
   - Agrega números fijos
   - Define rangos personalizados
   - Aplica filtros (Auto/Pares/Impares)
4. Haz clic en "GENERAR NÚMEROS"
5. Guarda tus jugadas favoritas con el botón ⭐
6. Copia números al portapapeles

## 🔧 Validaciones

Todas las validaciones se realizan con `switch` statements:
- Validación de números según tipo de lotería
- Validación de rangos personalizados
- Validación de cantidad de jugadas
- Validación de números fijos

## 💡 Ejemplos de Uso

### 6 Números con número fijo
1. Selecciona "6 Números (1-45)"
2. Agrega el número 17 como fijo
3. Genera: obtendrás 6 números incluyendo el 17

### Quiniela con rango
1. Selecciona "10 Números de 2 Cifras"
2. Activa "Rango personalizado"
3. Define rango: 10-50
4. Genera: todos los números estarán entre 10 y 50

### Múltiples jugadas
1. Mueve el slider a 10 jugadas
2. Genera: obtendrás 10 combinaciones diferentes

### Solo números pares
1. Selecciona cualquier tipo
2. Haz clic en el botón "Pares"
3. Genera: solo obtendrás números pares

## 🎨 Tecnologías

- **HTML5**: Estructura semántica
- **Tailwind CSS**: Framework CSS utility-first (vía CDN)
- **JavaScript ES6+**: Módulos, clases, async/await
- **Material Symbols**: Iconos de Google
- **LocalStorage**: Persistencia de datos

## 📱 Compatibilidad

- Chrome, Firefox, Safari, Edge (últimas versiones)
- Dispositivos móviles y tablets
- Requiere JavaScript habilitado
- Usa localStorage para persistencia

## 🎯 Características del Diseño

- Gradientes modernos (púrpura, índigo)
- Animaciones suaves
- Hover effects
- Modo oscuro por defecto
- Scrollbar personalizado
- Notificaciones toast
- Layout responsive con Flexbox y Grid

## 🔒 Privacidad

Todos los datos se guardan localmente en tu navegador. No se envía información a ningún servidor.

## 📝 Notas

- Los números son generados aleatoriamente
- No hay garantía de premios
- Juega responsablemente
- Diseño inspirado en aplicaciones modernas como Stripe y Linear
