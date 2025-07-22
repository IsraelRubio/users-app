export const translations = {
  es: {
    app: {
      title: 'Gestión de Usuarios',
      description: 'Aplicación de ejemplo con OpenCells'
    },
    home: {
      subtitle: 'Framework avanzado de Web Components',
      description: 'Explora las características avanzadas de OpenCells como canales, controladores, bounded properties y más.'
    },
    navigation: {
      home: 'Inicio',
      users: 'Usuarios', 
      second: 'Segunda Página',
      back: 'Volver',
      language: 'Idioma'
    },
    users: {
      title: 'Lista de Usuarios',
      subtitle: 'Explora la lista completa de usuarios disponibles',
      loading: 'Cargando usuarios...',
      error: 'Error al cargar usuarios',
      retry: 'Reintentar',
      search: 'Buscar usuarios',
      searchPlaceholder: 'Buscar por nombre, email o usuario...',
      noResults: 'No se encontraron usuarios',
      empty: 'No hay usuarios disponibles',
      viewDetail: 'Ver detalle',
      total: 'Total',
      filtered: 'Filtrados',
      clear: 'Limpiar',
      reload: 'Recargar',
      detail: 'Detalle del Usuario'
    },
    userDetail: {
      title: 'Detalle de Usuario',
      loading: 'Cargando usuario...',
      error: 'Error al cargar usuario',
      personalInfo: 'Información Personal',
      contactInfo: 'Información de Contacto',
      address: 'Dirección',
      company: 'Empresa'
    },
    actions: {
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      close: 'Cerrar'
    }
  },
  en: {
    app: {
      title: 'User Management',
      description: 'Sample application with OpenCells'
    },
    home: {
      subtitle: 'Advanced Web Components Framework',
      description: 'Explore OpenCells advanced features like channels, controllers, bounded properties and more.'
    },
    navigation: {
      home: 'Home',
      users: 'Users',
      second: 'Second Page',
      back: 'Back', 
      language: 'Language'
    },
    users: {
      title: 'Users List',
      subtitle: 'Explore the complete list of available users',
      loading: 'Loading users...',
      error: 'Error loading users',
      retry: 'Retry',
      search: 'Search users',
      searchPlaceholder: 'Search by name, email or username...',
      noResults: 'No users found',
      empty: 'No users available',
      viewDetail: 'View detail',
      total: 'Total',
      filtered: 'Filtered',
      clear: 'Clear',
      reload: 'Reload',
      detail: 'User Detail'
    },
    userDetail: {
      title: 'User Detail',
      loading: 'Loading user...',
      error: 'Error loading user',
      personalInfo: 'Personal Information',
      contactInfo: 'Contact Information', 
      address: 'Address',
      company: 'Company'
    },
    actions: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close'
    }
  }
};

// Función para obtener traducciones
export function getTranslation(key: string, language = 'es'): string {
  const keys = key.split('.');
  let result: any = translations[language as keyof typeof translations];
  
  for (const k of keys) {
    result = result?.[k];
  }
  
  return result || key;
}
