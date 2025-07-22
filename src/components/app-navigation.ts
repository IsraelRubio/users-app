import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';
import { appConfig } from '../config/app-config.js';
import { authService } from '../services/auth-service.js';

@customElement('app-navigation')
export class AppNavigation extends LitElement {
  pageController = new PageController(this);
  
  @state() currentRoute = 'home';
  @state() currentLanguage = 'es';
  @state() isLoggedIn = false;
  @state() userRole = 'guest';

  static styles = css`
    nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      z-index: 1000;
      padding: 1rem 2rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-brand {
      font-size: 1.5rem;
      font-weight: 700;
      color: #667eea;
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .language-selector {
      padding: 0.5rem 1rem;
      background: rgba(102, 126, 234, 0.1);
      border: 1px solid #667eea;
      border-radius: 0.5rem;
      color: #667eea;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.875rem;
    }

    .language-selector:hover {
      background: #667eea;
      color: white;
    }

    .user-info {
      padding: 0.5rem 1rem;
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid #22c55e;
      border-radius: 0.5rem;
      color: #22c55e;
      font-weight: 500;
      font-size: 0.875rem;
    }

    .login-button,
    .logout-button {
      padding: 0.5rem 1rem;
      border: 1px solid #667eea;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.875rem;
      text-decoration: none;
    }

    .login-button {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
    }

    .login-button:hover {
      background: #667eea;
      color: white;
    }

    .logout-button {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border-color: #ef4444;
    }

    .logout-button:hover {
      background: #ef4444;
      color: white;
    }

    .nav-link {
      padding: 0.5rem 1rem;
      text-decoration: none;
      color: #374151;
      font-weight: 500;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
      position: relative;
    }

    .nav-link:hover {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
    }

    .nav-link.active {
      background: #667eea;
      color: white;
    }

    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 6px;
      height: 6px;
      background: #667eea;
      border-radius: 50%;
    }

    @media (max-width: 768px) {
      nav {
        padding: 0.75rem 1rem;
      }
      
      .nav-links {
        gap: 1rem;
      }
      
      .nav-link {
        padding: 0.4rem 0.8rem;
        font-size: 0.9rem;
      }
      
      .nav-brand {
        font-size: 1.3rem;
      }
    }

    @media (max-width: 480px) {
      .nav-container {
        flex-direction: column;
        gap: 1rem;
      }
      
      .nav-links {
        gap: 0.5rem;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.pageController.subscribe('route-changed', (route: string) => {
      this.currentRoute = route;
    });
    
    // Suscribirse al canal de idioma
    this.pageController.subscribe(appConfig.channels.language, (language: string) => {
      this.currentLanguage = language;
    });

    this.updateAuthState();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Limpiar suscripciones para evitar memory leaks
    this.pageController.unsubscribe('route-changed');
    this.pageController.unsubscribe(appConfig.channels.language);
  }

  private navigateTo(route: string) {
    this.pageController.navigate(route);
  }

  private changeLanguage() {
    const newLanguage = this.currentLanguage === 'es' ? 'en' : 'es';
    this.pageController.publish(appConfig.channels.language, newLanguage);
  }

  private updateAuthState() {
    this.isLoggedIn = authService.isLoggedIn();
    const user = authService.getCurrentUser();
    this.userRole = user?.role || 'guest';
  }

  private handleLogout() {
    authService.logout();
    // Actualizar contexto del interceptor
    this.pageController.setInterceptorContext(authService.getAuthContext());
    this.updateAuthState();
    // Redirigir a login
    this.pageController.navigate('login');
  }

  render() {
    return html`
      <nav>
        <div class="nav-container">
          <a href="#" class="nav-brand" @click="${() => this.navigateTo('home')}">
            🏠 Users App
          </a>
          <div class="nav-links">
            <a 
              href="#" 
              class="nav-link ${this.currentRoute === 'home' ? 'active' : ''}"
              @click="${(e: Event) => { e.preventDefault(); this.navigateTo('home'); }}"
            >
              🏠 Inicio
            </a>
            <a 
              href="#" 
              class="nav-link ${this.currentRoute === 'users' ? 'active' : ''}"
              @click="${(e: Event) => { e.preventDefault(); this.navigateTo('users'); }}"
            >
              👥 Usuarios
            </a>
            <a 
              href="#" 
              class="nav-link ${this.currentRoute === 'second' ? 'active' : ''}"
              @click="${(e: Event) => { e.preventDefault(); this.navigateTo('second'); }}"
            >
              ⚡ Demo OpenCells
            </a>
            <button class="language-selector" @click="${this.changeLanguage}">
              🌐 ${this.currentLanguage === 'es' ? 'ES' : 'EN'}
            </button>
            
            ${this.isLoggedIn ? html`
              <span class="user-info">
                👤 ${this.userRole} 
              </span>
              <button class="logout-button" @click="${this.handleLogout}">
                🚪 Salir
              </button>
            ` : html`
              <button class="login-button" @click="${() => this.navigateTo('login')}">
                🔐 Login
              </button>
            `}
          </div>
        </div>
      </nav>
    `;
  }
}
