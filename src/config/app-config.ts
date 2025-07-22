export const appConfig = {
  apiUrl: 'https://jsonplaceholder.typicode.com',
  
  // Configuración de idiomas
  i18n: {
    defaultLanguage: 'es',
    supportedLanguages: ['es', 'en'],
    fallbackLanguage: 'es'
  },
  
  // Configuración de transiciones 
  transitions: {
    enabled: true,
    duration: 300,
    type: 'slide' // tipo de transición
  },
  
  // Configuración de canales para estado global
  channels: {
    // Canales para la gestión de estado usando pub/sub
    users: 'ch-users',           // Canal para lista de usuarios
    selectedUser: 'ch-user',     // Canal para usuario seleccionado
    language: 'ch-language',     // Canal para idioma actual
    loading: 'ch-loading',       // Canal para estados de carga
    errors: 'ch-errors'          // Canal para errores
  },
  
  // Configuración de propiedades
  boundedProperties: {
    maxUsers: 50,
    searchDebounce: 300,
    cacheTimeout: 5 * 60 * 1000
  }
};
