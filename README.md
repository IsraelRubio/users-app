# 🚀 Users App - Primeros pasos con OpenCells

¡Hola! 👋 

Este proyecto es mi primera toma de contacto con **OpenCells**, la librería de componentes web del BBVA. La verdad es que he estado trasteando con ella y me ha parecido muy interesante para romper mano y entender cómo funciona este ecosistema.

## 🤔 ¿Qué es esto?

Es una aplicación sencilla de gestión de usuarios hecha con **LitElement** y **OpenCells**. Nada del otro mundo, pero me ha servido para aprender los conceptos básicos del framework y ver cómo se integran todas las piezas.

## 🛠️ Lo que he implementado

- **Autenticación básica** (muy básica, pero funciona)
- **Navegación entre páginas** con el router de OpenCells
- **Gestión de estado** usando el sistema de canales pub/sub
- **Consumo de API externa** (JSONPlaceholder para los usuarios)
- **Búsqueda y filtrado** de usuarios en tiempo real
- **Internacionalización** básica (español/inglés)
- **Responsive design** que no está mal del todo

## 🔧 Tecnologías usadas

- **LitElement** - Para los componentes web
- **OpenCells** - El framework de BBVA para aplicaciones web
- **TypeScript** - Porque nos gusta el tipado
- **Vite** - Para el desarrollo y build
- **JSONPlaceholder** - API fake para los datos

## 🚀 Cómo ejecutarlo

```bash
# Instalar dependencias
npm install

# Arrancar en modo desarrollo
npm run dev

# Compilar para producción
npm run build
```

## 📚 Lo que he aprendido

### PageController y ElementController
Estos controladores de OpenCells están muy bien pensados. El `PageController` maneja el ciclo de vida de las páginas y la navegación, mientras que el `ElementController` se encarga de la gestión de estado y los canales de comunicación.

### Sistema de canales (pub/sub)
El sistema de comunicación por canales me ha gustado mucho. Es limpio y permite desacoplar componentes de manera elegante:

```typescript
// Publicar datos
this.pageController.publish('users', userData);

// Suscribirse a cambios
this.pageController.subscribe('users', (users) => {
  this.users = users;
});
```

### Hooks de ciclo de vida
Los métodos `onPageEnter()` y `onPageLeave()` son muy útiles para inicializar y limpiar recursos:

```typescript
onPageEnter() {
  // Verificar autenticación
  if (!authService.isLoggedIn()) {
    this.pageController.navigate('login');
    return;
  }
  
  // Suscribirse a canales
  this.pageController.subscribe('users', this.handleUsers);
}

onPageLeave() {
  // Limpiar suscripciones
  this.pageController.unsubscribe('users');
}
```

## 🙈 Lo que sé que se puede mejorar

Soy consciente de que esto es solo el principio y hay muchísimas cosas que se pueden pulir:

- **Autenticación real** con JWT y guards adecuados
- **Gestión de errores** más robusta
- **Testing** (sí, lo sé... 😅)
- **Optimización del bundle** 
- **Mejor arquitectura** de componentes
- **Accesibilidad** mejorada
- **Estados de carga** más elegantes
- **Validación de formularios** 
- **Manejo de rutas protegidas** más sofisticado

## 🎯 Conclusiones

Para ser la primera vez que toco OpenCells, la experiencia ha sido bastante positiva. El framework tiene conceptos interesantes y una arquitectura bien pensada. 

Obviamente, vengo de otros frameworks como Angular, así que algunos conceptos me han resultado familiares, pero otros como el sistema de canales o los controladores de OpenCells me han aportado una perspectiva diferente.

La curva de aprendizaje no ha sido demasiado empinada, aunque reconozco que aún me queda mucho por explorar y entender en profundidad.

## 📝 Estructura del proyecto

```
src/
├── components/          # Componentes principales
│   ├── app-index.ts    # Componente raíz
│   └── app-navigation.ts # Navegación
├── pages/              # Páginas de la aplicación
│   ├── auth/           # Login
│   ├── home/           # Página de inicio
│   └── users/          # Gestión de usuarios
├── services/           # Servicios (auth, API)
├── config/             # Configuración e i18n
└── router/             # Configuración de rutas
```

## 🤝 Contribuir

Si tienes experiencia con OpenCells y ves cosas que se pueden mejorar (que seguro que sí), ¡cualquier feedback será bienvenido! Estamos aquí para aprender.

## 📄 Licencia

MIT - Úsalo como quieras, bajo tu responsabilidad 😄

---

