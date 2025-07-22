import { html, LitElement, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';
import { appConfig } from '../../config/app-config.js';
import { getTranslation } from '../../config/i18n.js';
import { User } from '../../types.js';
import '../../components/app-toolbar.js';

@customElement('user-detail-page')
export class UserDetailPage extends LitElement {
  pageController = new PageController(this);
  
  @state() private user: User | null = null;
  @state() private loading = false;
  @state() private error: string | null = null;
  @state() private currentLanguage = 'es';
  @state() private userId: number | null = null;

  static styles = css`
    :host {
      display: block;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    
    .detail-title {
      font-size: 2rem;
      color: #2563eb;
      margin: 0 0 20px 0;
      text-align: center;
    }
    
    .user-card {
      background: white;
      border: 2px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      max-width: 600px;
      margin: 0 auto 20px;
    }
    
    .user-avatar {
      width: 80px;
      height: 80px;
      background: #2563eb;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 2rem;
      font-weight: bold;
      margin: 0 auto 20px;
    }
    
    .user-name {
      font-size: 1.5rem;
      font-weight: bold;
      text-align: center;
      margin: 0 0 10px 0;
      color: #333;
    }
    
    .user-username {
      color: #2563eb;
      font-weight: bold;
      text-align: center;
      margin: 0 0 20px 0;
    }
    
    .user-detail {
      margin: 10px 0;
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    
    .detail-label {
      font-weight: bold;
      color: #333;
      margin-right: 10px;
    }
    
    .detail-value {
      color: #666;
    }
    
    .back-button {
      padding: 10px 20px;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin: 20px auto;
      display: block;
    }
    
    .loading-container {
      text-align: center;
      padding: 40px;
    }
    
    .loading-spinner {
      width: 30px;
      height: 30px;
      border: 3px solid #ddd;
      border-top: 3px solid #2563eb;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 15px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  // Lifecycle hook se ejecuta al entrar en la página
  // Lifecycle hook con parámetros de ruta
  onPageEnter(params: { id?: string }) {
    // Extraer ID del usuario desde los parámetros de ruta
    if (params && params.id) {
      this.userId = parseInt(params.id, 10);
    }

    // Suscribirse a canales
    this.pageController.subscribe(appConfig.channels.language, (language: string) => {
      this.currentLanguage = language;
      this.requestUpdate();
    });

    this.pageController.subscribe(appConfig.channels.selectedUser, (user: User | null) => {
      if (user && this.userId && user.id === this.userId) {
        this.user = user;
        this.requestUpdate();
      }
    });

    this.pageController.subscribe(appConfig.channels.loading, (loading: boolean) => {
      this.loading = loading;
      this.requestUpdate();
    });

    this.pageController.subscribe(appConfig.channels.errors, (error: string | null) => {
      this.error = error;
      this.requestUpdate();
    });

    // Si no tenemos usuario, cargar desde API
    if (!this.user && this.userId) {
      this.loadUser();
    }
  }

  onPageLeave() { 
    // Limpiar suscripciones
    this.pageController.unsubscribe(appConfig.channels.language);
    this.pageController.unsubscribe(appConfig.channels.selectedUser);
    this.pageController.unsubscribe(appConfig.channels.loading);
    this.pageController.unsubscribe(appConfig.channels.errors);
  }

  private async loadUser() {
    if (!this.userId) return;

    try {
      this.pageController.publish(appConfig.channels.loading, true);
      this.pageController.publish(appConfig.channels.errors, null);

      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${this.userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const user: User = await response.json();
      this.user = user;
      
      // Publicar usuario en canal para compartir con otros componentes
      this.pageController.publish(appConfig.channels.selectedUser, user);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      this.pageController.publish(appConfig.channels.errors, errorMessage);
      
    } finally {
      this.pageController.publish(appConfig.channels.loading, false);
    }
  }

  private navigateBack() {
    this.pageController.navigate('users');
  }

  private handleBackClick() {
    this.pageController.navigate('users');
  }

  private handleLogoClick() {
    this.pageController.navigate('home');
  }

  render() {
    return html`
      <app-toolbar 
        @back-click="${this.handleBackClick}"
        @logo-click="${this.handleLogoClick}"
        ?showBackButton="${true}"
        currentPage="${getTranslation('users.detail', this.currentLanguage)}"
      ></app-toolbar>

      <div>
        <h1 class="detail-title">${getTranslation('users.detail', this.currentLanguage)}</h1>

        ${this.loading ? html`
          <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>${getTranslation('users.loading', this.currentLanguage)}</p>
          </div>
        ` : ''}

        ${this.error ? html`
          <div class="loading-container">
            <p>❌ ${this.error}</p>
            <button class="back-button" @click="${this.loadUser}">
              ${getTranslation('users.retry', this.currentLanguage)}
            </button>
          </div>
        ` : ''}

        ${!this.loading && !this.error && this.user ? html`
          <div class="user-card">
            <div class="user-avatar">${this.user.name.charAt(0).toUpperCase()}</div>
            <h2 class="user-name">${this.user.name}</h2>
            <p class="user-username">@${this.user.username}</p>
            
            <div class="user-detail">
              <span class="detail-label">📧 Email:</span>
              <span class="detail-value">${this.user.email}</span>
            </div>
            
            <div class="user-detail">
              <span class="detail-label">📱 Teléfono:</span>
              <span class="detail-value">${this.user.phone}</span>
            </div>
            
            <div class="user-detail">
              <span class="detail-label">🌐 Website:</span>
              <span class="detail-value">${this.user.website || 'Sin web'}</span>
            </div>
            
            <div class="user-detail">
              <span class="detail-label">🏢 Empresa:</span>
              <span class="detail-value">${this.user.company?.name || 'Sin empresa'}</span>
            </div>
            
            <div class="user-detail">
              <span class="detail-label">📍 Ciudad:</span>
              <span class="detail-value">${this.user.address?.city || 'Sin ciudad'}</span>
            </div>
            
            <div class="user-detail">
              <span class="detail-label">📮 Código postal:</span>
              <span class="detail-value">${this.user.address?.zipcode || 'Sin código'}</span>
            </div>
          </div>

          <button class="back-button" @click="${this.navigateBack}">
            ← Volver a usuarios
          </button>
        ` : ''}

        ${!this.loading && !this.error && !this.user ? html`
          <div class="loading-container">
            <p>Usuario no encontrado</p>
            <button class="back-button" @click="${this.navigateBack}">
              ← Volver a usuarios
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }
}
