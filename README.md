# 🎸 Mástil Interactivo de Guitarra

> Aplicación interactiva desarrollada con React, TypeScript y Vite para visualizar escalas musicales en el mástil de una guitarra.

[![TypeScript](https://img.shields.io/badge/TypeScript-95.3%25-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2.0-61dafb)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646cff)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#)

## 📖 Descripción

Esta aplicación web permite a músicos, estudiantes y entusiastas de la guitarra explorar y visualizar diferentes escalas musicales directamente en el mástil de la guitarra. Desarrollada inicialmente con **Google Gemini AI Studio** y actualmente optimizada con **ChatGPT Codex**.

### ✨ Características Principales

- 🎵 **10 Escalas Musicales**: Jónico, Dórico, Frigio, Lidio, Mixolidio, Eólico, Locrio, Pentatónicas y Blues
- 🎨 **Codificación por Colores**: Cada intervalo tiene un color único para fácil identificación
- 🎹 **12 Notas Tónicas**: Selecciona cualquier nota como tónica (C, C#, D, etc.)
- 📱 **Diseño Responsivo**: Interfaz adaptable a diferentes tamaños de pantalla
- ⚡ **Rendimiento Optimizado**: Construido con Vite para carga ultrarrápida
- 🎯 **Interactividad**: Visualización en tiempo real al cambiar escalas y notas

## 🚀 Inicio Rápido

### Requisitos Previos

- **Node.js** (versión 16 o superior)
- **npm** o **yarn**
- Clave API de Gemini (para funcionalidades IA)

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/lalocura1025/Eduardo-Andres-Castro-Garcia-.git

# 2. Navegar al directorio
cd Eduardo-Andres-Castro-Garcia-

# 3. Instalar dependencias
npm install

# 4. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local y agrega tu GEMINI_API_KEY

# 5. Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Compila para producción
npm run preview  # Vista previa de la compilación
```

## 🏗️ Estructura del Proyecto

```
├── components/           # Componentes React
│   ├── Fretboard.tsx    # Mástil de guitarra principal
│   ├── Legend.tsx       # Leyenda de intervalos
│   ├── RootNoteSelector.tsx  # Selector de nota tónica
│   └── ScaleSelector.tsx     # Selector de escalas
├── services/            # Lógica de negocio
│   └── musicTheory.ts   # Cálculos de teoría musical
├── constants.ts         # Constantes y definiciones de escalas
├── App.tsx             # Componente principal
├── index.tsx           # Punto de entrada
├── index.html          # HTML base
└── package.json        # Dependencias y scripts
```

## 🎼 Escalas Disponibles

### Modos Griegos
- **Jónico (Mayor)**: T, 2M, 3M, 4J, 5J, 6M, 7M
- **Dórico**: T, 2M, 3m, 4J, 5J, 6M, 7m
- **Frigio**: T, 2m, 3m, 4J, 5J, 6m, 7m
- **Lidio**: T, 2M, 3M, 4A, 5J, 6M, 7M
- **Mixolidio**: T, 2M, 3M, 4J, 5J, 6M, 7m
- **Eólico (Menor)**: T, 2M, 3m, 4J, 5J, 6m, 7m
- **Locrio**: T, 2m, 3m, 4J, 5d, 6m, 7m

### Escalas Pentatónicas
- **Pentatónica Menor**: T, 3m, 4J, 5J, 7m
- **Pentatónica Mayor**: T, 2M, 3M, 5J, 6M

### Blues
- **Blues**: T, 3m, 4J, 4A/5d, 5J, 7m

## 🎨 Código de Colores de Intervalos

- 🔴 **Tónica (T)**: Rojo
- 🟡 **Segundas (2m/2M)**: Amarillo
- 🟢 **Terceras (3m/3M)**: Verde
- 🔵 **Cuartas y Quintas**: Cyan/Azul
- 🟣 **Sextas y Séptimas**: Índigo/Púrpura

## 💻 Tecnologías Utilizadas

### Core
- **React 19.2.0**: Biblioteca UI
- **TypeScript 5.8.2**: Tipado estático
- **Vite 6.2.0**: Build tool y dev server

### Estilos
- **Tailwind CSS**: Framework CSS utility-first

### Herramientas de Desarrollo
- **@vitejs/plugin-react**: Plugin de Vite para React
- **@types/node**: Tipos de Node.js para TypeScript

## 🤖 Desarrollo Asistido por IA

Este proyecto ha sido desarrollado con la asistencia de:

- **Google Gemini AI Studio**: Generación inicial del proyecto
- **ChatGPT Codex**: Depuración y optimización continua
- **Comet (Perplexity)**: Documentación y mejoras estructurales

## 📚 Uso de la Aplicación

1. **Selecciona una Nota Tónica**: Elige la nota raíz de tu escala (C, D, E, etc.)
2. **Elige una Escala**: Selecciona el modo o escala que deseas visualizar
3. **Explora el Mástil**: Los puntos de colores muestran dónde tocar cada intervalo
4. **Aprende los Intervalos**: Usa la leyenda para entender cada grado de la escala

## 🔗 Enlaces Útiles

- [Ver aplicación en AI Studio](https://ai.studio/apps/drive/1M1aPrYZ1VZALUUA63pKBJrCHZSpipq2P)
- [Documentación de React](https://reactjs.org/)
- [Documentación de TypeScript](https://www.typescriptlang.org/)
- [Teoría Musical](https://es.wikipedia.org/wiki/Teor%C3%ADa_musical)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

Para más detalles, consulta [CONTRIBUTING.md](CONTRIBUTING.md)

## 📝 Roadmap

- [ ] Agregar acordes además de escalas
- [ ] Soporte para afinaciones alternativas
- [ ] Modo de práctica con ejercicios
- [ ] Exportar diagramas como imágenes
- [ ] Soporte para otros instrumentos (bajo, ukelele)
- [ ] Modo oscuro/claro toggle
- [ ] Sonidos al hacer clic en las notas

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👤 Autor

**Eduardo Andrés Castro García**
- GitHub: [@lalocura1025](https://github.com/lalocura1025)

## 🙏 Agradecimientos

- Google Gemini AI Studio por el template inicial
- ChatGPT Codex por las optimizaciones
- Comunidad de desarrolladores de React y TypeScript
- Músicos y educadores musicales que inspiraron este proyecto

---

⭐ Si este proyecto te ha sido útil, considera darle una estrella en GitHub!
