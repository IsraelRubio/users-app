import { html, LitElement, css } from 'lit';
import { PageController } from '@open-cells/page-controller';
import { customElement, state } from 'lit/decorators.js';
import { appConfig } from '../../config/app-config.js';
import { getTranslation } from '../../config/i18n.js';
import { authService } from '../../services/auth-service.js';
import '../../components/app-toolbar.js';

@customElement('home-page')
export class HomePage extends LitElement {
  // PageController para navegación y gestión de canales
  pageController = new PageController(this);
  
  // Estado reactivo usando decorador @state de Lit
  @state() private currentLanguage = 'es';
  @state() private appTitle = '';

  // Estilos combinando los de PageTransitions oficial
  static styles = [
    css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      background: #f8fafc;
      min-height: 100vh;
    }

    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 2rem;
      text-align: center;
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .hero-subtitle {
      font-size: 1.3rem;
      opacity: 0.9;
      margin-bottom: 2rem;
    }

    .nav-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .nav-button {
      padding: 1rem 2rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      font-size: 1rem;
    }

    .nav-button {
      background: white;
      color: #667eea;
    }

    .nav-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
    }

    .nav-button.secondary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid white;
    }

    .nav-button.secondary:hover {
      background: white;
      color: #667eea;
    }

    .features-section {
      padding: 4rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .features-title {
      text-align: center;
      font-size: 2.5rem;
      color: #1f2937;
      margin-bottom: 3rem;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .feature-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      cursor: pointer;
      border: 2px solid transparent;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
      border-color: #667eea;
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
    }

    .feature-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .feature-description {
      color: #6b7280;
      line-height: 1.6;
    }

    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #2563eb;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem;
      }
      
      .features-section {
        padding: 2rem 1rem;
      }
      
      .features-grid {
        grid-template-columns: 1fr;
      }
      
      .nav-buttons {
        flex-direction: column;
        align-items: center;
      }
      
      .nav-button {
        width: 100%;
        max-width: 300px;
      }
    }
    `
  ];

  // Se ejecuta cuando la página se activa
  onPageEnter() {
    console.log('🚀 OpenCells: Entrando en página de inicio');
    
    // Verificar autenticación antes de cargar la página
    if (!authService.isLoggedIn()) {
      console.log('🔒 Usuario no autenticado, redirigiendo a login');
      this.pageController.navigate('login');
      return;
    }
    
    // Suscribirse al canal de idioma
    this.pageController.subscribe(appConfig.channels.language, (language: string) => {
      this.currentLanguage = language;
      this.updateAppTitle();
      this.requestUpdate(); // Forzar re-render de Lit
    });

    // Publicar idioma inicial en el canal
    this.pageController.publish(appConfig.channels.language, this.currentLanguage);
    this.updateAppTitle();
  }

  // Limpieza cuando se sale de la página
  onPageLeave() {
    // Desuscribirse del canal para evitar memory leaks
    this.pageController.unsubscribe(appConfig.channels.language);
  }

  private updateAppTitle() {
    this.appTitle = getTranslation('app.title', this.currentLanguage);
  }

  // Navegación usando PageController
  private navigateToUsers() {
    // OpenCells maneja las transiciones automáticamente según la configuración
    this.pageController.navigate('users');
  }

  private navigateToSecond() {
    this.pageController.navigate('second');
  }

  // Cambio de idioma
  private changeLanguage() {
    this.currentLanguage = this.currentLanguage === 'es' ? 'en' : 'es';
    this.pageController.publish(appConfig.channels.language, this.currentLanguage);
    this.updateAppTitle();
    this.showNotification(`Idioma cambiado a: ${this.currentLanguage === 'es' ? 'Español' : 'English'}`);
  }

  private showNotification(message: string) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #2563eb;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 1000;
      font-family: Arial, sans-serif;
      font-weight: 600;
      max-width: 300px;
      animation: slideIn 0.3s ease-out;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
    
    if (!document.querySelector('#notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  private handleLogoClick() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.showNotification('¡Ya estás en la página de inicio!');
  }

  render() {
    return html`
      <app-toolbar 
        @logo-click="${this.handleLogoClick}"
        ?showBackButton="${false}"
        ?showLanguageSelector="${true}"
        currentPage="${getTranslation('navigation.home', this.currentLanguage)}"
      ></app-toolbar>

      <div class="home-page">
        <div class="hero-section">
          <h1 class="hero-title">${this.appTitle || 'OpenCells App'}</h1>
          <p class="hero-subtitle">Framework avanzado de Web Components</p>
          
          <div class="nav-buttons">
            <button class="nav-button" @click="${this.navigateToUsers}">
              👥 Usuarios
            </button>
            <button class="nav-button secondary" @click="${this.navigateToSecond}">
              📄 Segunda Página
            </button>
          </div>
        </div>

        <div class="features-section">
          <h2 class="features-title">Explora la Aplicación</h2>
          <div class="features-grid">
            <div class="feature-card" @click="${this.navigateToUsers}">
              <div class="feature-icon"> 👥</div>
              <h3 class="feature-title">Lista de Usuarios</h3>
              <p class="feature-description">
                Navega por una lista completa de usuarios con búsqueda y scroll. Clic en un usuario para ver detalles.
              </p>
            </div>
            
            <div class="feature-card" @click="${this.navigateToSecond}">
              <div class="feature-icon">⚡</div>
              <h3 class="feature-title">Demo OpenCells</h3>
              <p class="feature-description">
                Página interactiva que demuestra las funcionalidades avanzadas del framework OpenCells.
              </p>
            </div>
            
            <div class="feature-card" @click="${this.changeLanguage}">
              <div class="feature-icon">🌐</div>
              <h3 class="feature-title">Cambiar Idioma</h3>
              <p class="feature-description">
                Cambia entre Español e Inglés. Actualmente: <strong>${this.currentLanguage === 'es' ? 'Español' : 'English'}</strong>
              </p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">👤</div>
              <h3 class="feature-title">OpenCells SPA</h3>
              <p class="feature-description">
                Single Page Application construida con OpenCells, LitElement y navegación por rutas.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
