import { html, LitElement, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';
import { ElementController } from '@open-cells/element-controller';
import { appConfig } from '../../config/app-config.js';
import { getTranslation } from '../../config/i18n.js';
import { User } from '../../types.js';
import { authService } from '../../services/auth-service.js';

/**
 * Página de usuarios con funcionalidades completas de OpenCells
 * Demuestra todas las características del framework:
 * - PageController y ElementController
 * - Gestión de estado mediante canales (pub/sub)
 * - Bounded properties con debounce
 * - Lifecycle hooks de página
 * - Integración con API externa
 * - Localización y traducciones
 * - Transiciones automáticas
 * - Toolbar reutilizable con CSS externo
 */
@customElement('users-page')
export class UsersPage extends LitElement {
  pageController = new PageController(this);
  elementController = new ElementController(this);

  // Estado del componente
  @state() private users: User[] = [];
  @state() private currentLanguage: string = 'es';
  @state() private loading: boolean = false;
  @state() private error: string | null = null;

  // Estado reactivo del componente
  @state() private searchTerm = '';
  @state() private filteredUsers: User[] = [];

  // Variables de properties
  private maxUsers = appConfig.boundedProperties.maxUsers;
  private searchDebounceMs = appConfig.boundedProperties.searchDebounce;
  private searchTimeout: number | undefined = undefined;

  // Estilos combinando los de PageTransitions
  static styles = [
    css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      background: #f8fafc;
      min-height: 100vh;
      padding: 2rem;
    }

    .page-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 2.5rem;
      color: #1f2937;
      margin-bottom: 0.5rem;
      margin-top: 4rem;
    }

    .search-container {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .search-controls {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 1rem;
      align-items: end;
    }

    .search-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .search-label {
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
    }

    .search-input {
      padding: 0.75rem;
      border: 2px solid #d1d5db;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .search-button, .clear-button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .search-button {
      background: #3b82f6;
      color: white;
    }

    .search-button:hover {
      background: #2563eb;
    }

    .clear-button {
      background: #6b7280;
      color: white;
    }

    .clear-button:hover {
      background: #4b5563;
    }

    /* Grid de usuarios con scroll */
    .users-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
      max-height: 60vh;
      overflow-y: auto;
      padding: 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      background: white;
    }

    .user-card {
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.3s ease;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .user-card:hover {
      border-color: #3b82f6;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
    }

    .user-avatar {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }

    .user-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .user-username {
      color: #3b82f6;
      font-weight: 500;
      margin-bottom: 0.75rem;
    }

    .user-email {
      color: #6b7280;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .loading-container {
      text-align: center;
      padding: 3rem;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e2e8f0;
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-container {
      text-align: center;
      padding: 2rem;
      background: #fef2f2;
      border: 1px solid #fca5a5;
      border-radius: 8px;
      margin-top: 1rem;
    }

    .error-message {
      color: #dc2626;
      font-weight: 500;
    }

    .users-count {
      color: #6b7280;
      font-size: 0.875rem;
      margin-top: 1rem;
      text-align: center;
    }

    @media (max-width: 768px) {
      :host {
        padding: 1rem;
      }
      
      .search-controls {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .users-grid {
        grid-template-columns: 1fr;
        max-height: 50vh;
      }
      
      .page-title {
        font-size: 2rem;
      }
    }
    `
  ];



  // se ejecuta al entrar en la página
  onPageEnter() {
    console.log('🚀 OpenCells: Entrando en página de usuarios');
    
    // Verificar autenticación antes de cargar la página
    if (!authService.isLoggedIn()) {
      console.log('🔒 Usuario no autenticado, redirigiendo a login');
      this.pageController.navigate('login');
      return;
    }
    
    this.pageController.subscribe(appConfig.channels.users, (users: User[]) => {
      this.users = users || [];
      this.applyFilters();
    });
    
    this.pageController.subscribe(appConfig.channels.language, (language: string) => {
      this.currentLanguage = language || 'es';
    });
    
    this.pageController.subscribe(appConfig.channels.loading, (loading: boolean) => {
      this.loading = loading || false;
    });
    
    this.pageController.subscribe(appConfig.channels.errors, (error: string | null) => {
      this.error = error;
    });
    
    this.loadUsers();
  }

  // Se ejecuta al salir de la página
  onPageLeave() {
    
    this.pageController.unsubscribe(appConfig.channels.users);
    this.pageController.unsubscribe(appConfig.channels.language);
    this.pageController.unsubscribe(appConfig.channels.loading);
    this.pageController.unsubscribe(appConfig.channels.errors);
    
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  private async loadUsers() {
    try {
      this.loading = true;
      this.error = null;
      this.pageController.publish(appConfig.channels.loading, true);
      this.pageController.publish(appConfig.channels.errors, null);

      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const users: User[] = await response.json();
      
      const limitedUsers = users.slice(0, this.maxUsers);
      
      this.users = limitedUsers;
      this.pageController.publish(appConfig.channels.users, limitedUsers);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

      this.error = errorMessage;
      this.pageController.publish(appConfig.channels.errors, errorMessage);
      
    } finally {
      this.loading = false;
      this.pageController.publish(appConfig.channels.loading, false);
    }
  }

  private handleSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = window.setTimeout(() => {
      this.applyFilters();
    }, this.searchDebounceMs);
  }

  private applyFilters() {
    if (!this.users || !Array.isArray(this.users)) {
      this.filteredUsers = [];
      return;
    }

    if (!this.searchTerm) {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(user =>
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.requestUpdate();
  }

  // Navegación a detalle
  private viewUserDetail(userId: number) {
    if (!this.users || !Array.isArray(this.users)) {
      return;
    }
    
    const selectedUser = this.users.find(u => u.id === userId);
    if (selectedUser) {
      this.pageController.publish(appConfig.channels.selectedUser, selectedUser);
    
      // TODO: Implementar página de detalle del usuario
      alert(`Usuario seleccionado: ${selectedUser.name}\nEmail: ${selectedUser.email}\nTeléfono: ${selectedUser.phone}`);
    }
  }

  private clearFilters() {
    this.searchTerm = '';
    this.applyFilters();
    
    const searchInput = this.shadowRoot?.querySelector('#search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }
  }

  private reloadUsers() {
    this.loadUsers();
  }

  render() {
    const currentUsers = this.filteredUsers.length > 0 ? this.filteredUsers : this.users;
    
    return html`
 

      <div class="users-page">
        <div class="page-header">
          <h1 class="page-title">${getTranslation('users.title', this.currentLanguage)}</h1>
        </div>
        
        <div class="search-section">
          <h3>${getTranslation('users.search', this.currentLanguage)}</h3>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <input
              id="search-input"
              type="text"
              class="search-input"
              placeholder="${getTranslation('users.searchPlaceholder', this.currentLanguage)}"
              @input="${this.handleSearch}"
            />
            <button class="action-button" @click="${this.clearFilters}">
              ${getTranslation('users.clear', this.currentLanguage)}
            </button>
            <button class="action-button" @click="${this.reloadUsers}">
              ${getTranslation('users.reload', this.currentLanguage)}
            </button>
          </div>
        </div>

        ${this.loading ? html`
          <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>${getTranslation('users.loading', this.currentLanguage)}</p>
          </div>
        ` : ''}

        ${this.error ? html`
          <div class="loading-container">
            <p>❌ ${this.error}</p>
            <button class="action-button" @click="${this.reloadUsers}">
              ${getTranslation('users.retry', this.currentLanguage)}
            </button>
          </div>
        ` : ''}

        ${!this.loading && !this.error && currentUsers.length === 0 ? html`
          <div class="loading-container">
            <p>${getTranslation('users.empty', this.currentLanguage)}</p>
          </div>
        ` : ''}

        ${!this.loading && !this.error && currentUsers.length > 0 ? html`
          <div class="users-grid">
            ${currentUsers.map(user => html`
              <div class="user-card" @click="${() => this.viewUserDetail(user.id)}">
                <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
                <h3 class="user-name">${user.name}</h3>
                <p class="user-username">@${user.username}</p>
                <div class="user-detail">📧 ${user.email}</div>
                <div class="user-detail">📱 ${user.phone}</div>
                <div class="user-detail">${user.company?.name || 'Sin empresa'}</div>
                <div class="user-detail">${user.website || 'Sin web'}</div>
              </div>
            `)}
          </div>
        ` : ''}
      </div>
    `;
  }
}
