import { html, LitElement, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';
import { appConfig } from '../config/app-config.js';
import { getTranslation } from '../config/i18n.js';

@customElement('app-toolbar')
export class AppToolbar extends LitElement {
  // PageController para acceso a canales
  pageController = new PageController(this);
  
  // Propiedades públicas del componente
  @property({ type: String }) currentPage = '';
  @property({ type: Boolean }) showLanguageSelector = true;
  @property({ type: Boolean }) showBackButton = false;
  
  // Estado interno reactivo
  @state() private currentLanguage = 'es';

  static styles = css`
    :host {
      display: block;
      background: white;
      border-bottom: 1px solid #ddd;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      color: #2563eb;
      cursor: pointer;
    }

    .page-title {
      font-size: 1.2rem;
      font-weight: bold;
      color: #333;
    }

    .back-button {
      padding: 8px 15px;
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 5px;
      color: #333;
      text-decoration: none;
      cursor: pointer;
    }

    .back-button:hover {
      background: #e5e5e5;
    }

    .language-selector {
      display: flex;
      border: 1px solid #ddd;
      border-radius: 5px;
      overflow: hidden;
    }

    .lang-button {
      padding: 8px 15px;
      border: none;
      background: white;
      color: #666;
      cursor: pointer;
    }

    .lang-button:hover {
      background: #f5f5f5;
    }

    .lang-button.active {
      background: #2563eb;
      color: white;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    
    // Suscribirse al canal de idioma
    this.pageController.subscribe(appConfig.channels.language, (language: string) => {
      this.currentLanguage = language;
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Limpiar suscripción
    this.pageController.unsubscribe(appConfig.channels.language);
  }

  // Cambiar idioma usando canales
  private changeLanguage(language: 'es' | 'en') {
    this.pageController.publish(appConfig.channels.language, language);
  }

  // Navegación
  private handleBack() {
    this.dispatchEvent(new CustomEvent('back-click', {
      bubbles: true,
      composed: true
    }));
  }

  private handleLogoClick() {
    this.dispatchEvent(new CustomEvent('logo-click', {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="toolbar">
        <div class="toolbar-left">
          <div class="logo" @click="${this.handleLogoClick}">
            🚀 OpenCells
          </div>
          
          ${this.showBackButton ? html`
            <button class="back-button" @click="${this.handleBack}">
              ← ${getTranslation('navigation.back', this.currentLanguage)}
            </button>
          ` : ''}
          
          ${this.currentPage ? html`
            <div class="page-title">${this.currentPage}</div>
          ` : ''}
        </div>

        <div class="toolbar-right">
          ${this.showLanguageSelector ? html`
            <div class="language-selector">
              <button
                class="lang-button ${this.currentLanguage === 'es' ? 'active' : ''}"
                @click="${() => this.changeLanguage('es')}"
                title="Español"
              >
                🇪🇸 ES
              </button>
              <button
                class="lang-button ${this.currentLanguage === 'en' ? 'active' : ''}"
                @click="${() => this.changeLanguage('en')}"
                title="English"
              >
                🇺🇸 EN
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}
