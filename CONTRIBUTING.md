# Guía de Contribución

¡Gracias por considerar contribuir al Mástil Interactivo de Guitarra! 🎸

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo Puedo Contribuir?](#cómo-puedo-contribuir)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Guía de Commits](#guía-de-commits)
- [Pull Requests](#pull-requests)

## 📜 Código de Conducta

Este proyecto sigue un código de conducta. Al participar, se espera que mantengas un ambiente respetuoso y constructivo.

### Principios Básicos

- Ser respetuoso con todos los colaboradores
- Aceptar críticas constructivas
- Enfocarse en lo mejor para la comunidad
- Mostrar empatía hacia otros miembros

## 🤝 ¿Cómo Puedo Contribuir?

### Reportar Bugs 🐛

Si encuentras un bug, por favor abre un issue con:

- **Título descriptivo**: Resume el problema en pocas palabras
- **Pasos para reproducir**: Lista exacta de pasos
- **Comportamiento esperado**: Qué debería pasar
- **Comportamiento actual**: Qué está pasando
- **Capturas de pantalla**: Si aplica
- **Entorno**: Navegador, SO, versión de Node.js

**Ejemplo:**
```markdown
**Bug**: Los intervalos no se muestran correctamente en la escala Locria

**Pasos para reproducir:**
1. Seleccionar nota tónica C
2. Seleccionar escala Locria
3. Observar el mástil

**Esperado**: Debería mostrar T, 2m, 3m, 4J, 5d, 6m, 7m
**Actual**: Muestra intervalos incorrectos

**Entorno**: Chrome 120, Windows 11, Node 18.17.0
```

### Sugerir Mejoras 💡

Las ideas son bienvenidas! Abre un issue con:

- **Descripción clara** de la mejora
- **Justificación**: Por qué sería útil
- **Ejemplos**: Cómo funcionaría
- **Alternativas**: Otras formas de implementarlo

### Contribuir con Código 👨‍💻

1. **Fork** el repositorio
2. **Crea una rama** desde `main`
3. **Implementa** tus cambios
4. **Escribe tests** si aplica
5. **Actualiza documentación**
6. **Envía un Pull Request**

## 🔧 Proceso de Desarrollo

### Configuración del Entorno

```bash
# 1. Fork y clonar
git clone https://github.com/TU-USUARIO/Eduardo-Andres-Castro-Garcia-.git
cd Eduardo-Andres-Castro-Garcia-

# 2. Instalar dependencias
npm install

# 3. Crear archivo de entorno
cp .env.example .env.local
# Edita .env.local con tus keys

# 4. Iniciar desarrollo
npm run dev
```

### Estructura de Ramas

- `main`: Rama principal, siempre estable
- `feature/nombre`: Nuevas características
- `fix/nombre`: Corrección de bugs
- `docs/nombre`: Mejoras de documentación
- `refactor/nombre`: Refactorización de código

### Ejemplo de Flujo de Trabajo

```bash
# Crear rama para nueva feature
git checkout -b feature/acordes-support

# Hacer cambios y commits
git add .
git commit -m "feat: add chord visualization support"

# Mantener actualizado con main
git fetch origin
git rebase origin/main

# Empujar cambios
git push origin feature/acordes-support

# Abrir Pull Request en GitHub
```

## 💻 Estándares de Código

### TypeScript

- **Usa tipos explícitos**: Evita `any`
- **Interfaces sobre types**: Para objetos complejos
- **Nombres descriptivos**: Variables y funciones claras
- **Constantes en UPPERCASE**: Para valores inmutables

```typescript
// ✅ Bueno
interface ChordPattern {
  name: string;
  intervals: number[];
  fingerPositions: FretPosition[];
}

const CHORD_TYPES: ChordPattern[] = [...];

// ❌ Malo
const x: any = [...];
type t = { n: string };
```

### React Components

- **Componentes funcionales**: Con hooks
- **Props con interface**: Tipado explícito
- **JSDoc**: Documenta componentes complejos
- **Destructuring**: En props

```typescript
// ✅ Bueno
interface FretboardProps {
  /** Nota raíz de la escala */
  rootNote: string;
  /** Escala seleccionada */
  selectedScale: ScaleName;
}

/**
 * Componente que renderiza el mástil de la guitarra
 * con los intervalos de la escala seleccionada
 */
export const Fretboard: React.FC<FretboardProps> = ({ 
  rootNote, 
  selectedScale 
}) => {
  // implementación
};

// ❌ Malo
export const Fretboard = (props: any) => {
  // sin documentación
};
```

### Estilos

- **Tailwind CSS**: Usa clases utilitarias
- **Clases semánticas**: Para componentes reutilizables
- **Responsive**: Mobile-first
- **Accesibilidad**: ARIA labels cuando sea necesario

```tsx
// ✅ Bueno
<button 
  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg 
             transition-colors focus:ring-2 focus:ring-blue-300"
  aria-label="Seleccionar escala"
>
  Seleccionar
</button>

// ❌ Malo
<button className="btn" style={{background: 'blue'}}>
  Click
</button>
```

## 📝 Guía de Commits

Usamos **Conventional Commits** para mensajes claros y consistentes.

### Formato

```
<tipo>(<ámbito>): <descripción corta>

[cuerpo opcional]

[footer opcional]
```

### Tipos de Commit

- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Formato, sin cambios de código
- `refactor`: Refactorización sin cambios funcionales
- `perf`: Mejoras de rendimiento
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento

### Ejemplos

```bash
# Nueva característica
feat(fretboard): add support for alternative tunings

# Corrección de bug
fix(scale-selector): resolve interval calculation error in Locrian mode

# Documentación
docs(readme): update installation instructions

# Refactorización
refactor(music-theory): simplify interval calculation logic

# Performance
perf(fretboard): optimize rendering with React.memo
```

### Reglas

- **Usa imperativo**: "add" no "added" o "adds"
- **Minúsculas**: Excepto nombres propios
- **Sin punto final**: En la descripción corta
- **Máximo 72 caracteres**: En la primera línea
- **Cuerpo descriptivo**: Si el cambio es complejo

## 🔀 Pull Requests

### Antes de Enviar

- [ ] El código compila sin errores: `npm run build`
- [ ] Los cambios están en una rama feature
- [ ] Commits siguen convenciones
- [ ] Documentación actualizada
- [ ] Tests pasan (si existen)
- [ ] No hay conflictos con `main`

### Template de PR

```markdown
## 📋 Descripción

Breve descripción de los cambios

## 🎯 Tipo de Cambio

- [ ] 🐛 Bug fix
- [ ] ✨ Nueva característica
- [ ] 📝 Documentación
- [ ] 🎨 Mejora de UI/UX
- [ ] ♻️ Refactorización

## 🧪 ¿Cómo Probar?

1. Paso 1
2. Paso 2
3. Resultado esperado

## 📸 Capturas de Pantalla

(Si aplica)

## ✅ Checklist

- [ ] Mi código sigue los estándares del proyecto
- [ ] He revisado mi propio código
- [ ] He comentado código complejo
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan warnings
- [ ] He agregado tests
```

### Proceso de Revisión

1. **Envías PR**: Con descripción clara
2. **Revisión automática**: Checks de CI/CD (si existen)
3. **Revisión manual**: Por mantenedores
4. **Discusión**: Posibles cambios solicitados
5. **Aprobación**: Merge a `main`

### Tips para PRs Exitosos

- **PRs pequeños**: Más fáciles de revisar
- **Un objetivo**: Un PR = un cambio lógico
- **Descripción clara**: Explica el "por qué"
- **Tests**: Si agregas funcionalidad
- **Screenshots**: Para cambios visuales

## 🎨 Áreas de Contribución

### Frontend 🖥️

- Nuevas escalas o modos
- Mejoras de UI/UX
- Optimizaciones de rendimiento
- Responsive design
- Accesibilidad

### Funcionalidades 🚀

- Soporte para acordes
- Afinaciones alternativas
- Exportar diagramas
- Modo de práctica
- Audio/sonidos

### Documentación 📚

- Mejorar README
- Tutoriales
- Ejemplos de uso
- Comentarios en código
- Guías de teoría musical

### Testing 🧪

- Tests unitarios
- Tests de integración
- Tests de accesibilidad
- Tests de rendimiento

## 🐛 Debugging Tips

### Problemas Comunes

**Error de tipos TypeScript:**
```bash
npm run build
# Revisar errores de tipos
```

**Dependencias desactualizadas:**
```bash
npm outdated
npm update
```

**Puerto ocupado:**
```bash
# Cambiar puerto en vite.config.ts
server: { port: 3001 }
```

## 📚 Recursos Útiles

- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Teoría Musical](https://es.wikipedia.org/wiki/Teor%C3%ADa_musical)

## 💬 Contacto

¿Preguntas? ¿Necesitas ayuda?

- Abre un **Issue** para discusiones técnicas
- Usa **Discussions** para preguntas generales
- Contacta a [@lalocura1025](https://github.com/lalocura1025)

## 🙏 Agradecimientos

Gracias por contribuir! Cada aporte, grande o pequeño, ayuda a mejorar este proyecto para toda la comunidad de músicos y desarrolladores.

---

**Recuerda**: No hay contribuciones pequeñas. Reportar un typo es tan valioso como implementar una nueva feature! 🎸✨
