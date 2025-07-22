import { html, LitElement, css } from 'lit';
import { PageController } from '@open-cells/page-controller';
import { customElement, state } from 'lit/decorators.js';
import { appConfig } from '../../config/app-config.js';
import { getTranslation } from '../../config/i18n.js';

@customElement('second-page')
export class SecondPage extends LitElement {
  pageController = new PageController(this);
  
  @state() private currentLanguage = 'es';
  @state() private demoOutput = 'Esperando interacción...';
  @state() private channelMessages = 0;
  @state() private pageViews = 1;
  @state() private lastAction = 'Página cargada';

  // PageTransitions
  static styles = [
    css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
    }

    .container {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      animation: slideInFromRight 0.6s ease-out;
      min-height: 100vh;
      padding: 2rem 1rem;
      color: white;
      text-align: center;
    }

    .title {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .subtitle {
      font-size: 1.2rem;
      margin-bottom: 3rem;
      opacity: 0.9;
    }

    .content {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      color: #1f2937;
      border-radius: 1rem;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      max-width: 900px;
      margin-left: auto;
      margin-right: auto;
    }

    .content h2 {
      color: #374151;
      margin-bottom: 2rem;
      font-size: 1.8rem;
    }

    .features {
      text-align: left;
      margin-bottom: 2rem;
    }

    .feature {
      margin-bottom: 1.5rem;
      padding: 1.5rem;
      background: #fef3c7;
      border-radius: 0.75rem;
      border-left: 4px solid #f59e0b;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .feature:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(245, 158, 11, 0.2);
    }

    .feature-title {
      font-weight: 600;
      color: #92400e;
      margin-bottom: 0.75rem;
      font-size: 1.1rem;
    }

    .feature-description {
      color: #a16207;
      line-height: 1.6;
    }

    .feature-description strong {
      color: #92400e;
      font-weight: 600;
    }

    .actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 1rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      font-size: 0.9rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: #fffbeb;
      color: #92400e;
      border: 2px solid #f59e0b;
    }

    .btn-secondary:hover {
      background: #fef3c7;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(245, 158, 11, 0.2);
    }

    .demo-info {
      background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
      padding: 1.5rem;
      border-radius: 0.75rem;
      margin-bottom: 2rem;
      border-left: 4px solid #3b82f6;
    }

    .demo-info p {
      margin: 0.5rem 0;
      color: #1e40af;
    }

    .state-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .state-item {
      background: white;
      padding: 1rem;
      border-radius: 0.5rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .state-label {
      display: block;
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 0.5rem;
    }

    .state-value {
      display: block;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
    }

    .demo-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }

    .demo-output-text {
      font-family: 'Monaco', 'Menlo', monospace;
      background: #f3f4f6;
      padding: 0.5rem;
      border-radius: 0.25rem;
      color: #059669;
      font-weight: 600;
    }

    .language-demo {
      text-align: center;
      padding: 1rem;
    }

    .current-lang {
      font-size: 1.25rem;
      font-weight: 600;
      color: #059669;
    }

    .language-note {
      font-size: 0.875rem;
      color: #6b7280;
      font-style: italic;
      margin: 1rem 0;
    }

    .explanation {
      background: #f0f9ff;
      padding: 1rem;
      border-radius: 0.5rem;
      border-left: 3px solid #0ea5e9;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .state-note {
      display: block;
      font-size: 0.75rem;
      color: #9ca3af;
      margin-top: 0.25rem;
      line-height: 1.3;
    }

    .experiment-container {
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 0.75rem;
      border: 1px solid #e2e8f0;
    }

    .experiment-output {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: white;
      border-radius: 0.5rem;
      border: 1px solid #d1d5db;
    }

    .language-status {
      text-align: center;
      margin: 1rem 0;
      padding: 1rem;
      background: white;
      border-radius: 0.5rem;
      border: 1px solid #d1d5db;
    }

    .btn small {
      display: block;
      font-size: 0.75rem;
      font-weight: 400;
      margin-top: 0.25rem;
      opacity: 0.8;
    }

    .demo-info ul {
      margin: 1rem 0;
      padding-left: 1.5rem;
    }

    .demo-info li {
      margin: 0.5rem 0;
      line-height: 1.5;
    }

    @keyframes slideInFromRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      
      .title {
        font-size: 2rem;
      }
      
      .content {
        padding: 1.5rem;
      }
      
      .actions {
        flex-direction: column;
      }
      
      .btn {
        width: 100%;
        justify-content: center;
      }
      
      .feature {
        padding: 1rem;
      }
    }
    `
  ];

  onPageEnter() {
    // Suscripción a un canal
    this.pageController.subscribe(appConfig.channels.language, (language: string) => {
      this.currentLanguage = language;
      this.requestUpdate();
    });

    // Publicar un mensaje en un canal
    this.pageController.publish('ch-second-page-data', {
      message: 'Página segunda cargada',
      timestamp: new Date().toISOString()
    });
  }

  onPageLeave() {
    // Limpieza 
    this.pageController.unsubscribe(appConfig.channels.language);
  }

  // Navegación
  private goHome() {
    this.pageController.navigate('home');
  }

  private goToUsers() {
    this.pageController.navigate('users');
  }

  // Cambio de idioma
  private changeLanguage(language: string) {
    this.pageController.publish(appConfig.channels.language, language);
  }

  private runChannelDemo = () => {
    this.channelMessages++;
    this.lastAction = `Canal publicado (${new Date().toLocaleTimeString()})`;
    this.demoOutput = `Canal usado ${this.channelMessages} veces`;
    
    // Canal personalizado
    this.pageController.publish('demo-channel', {
      action: 'demo-run',
      timestamp: Date.now(),
      count: this.channelMessages
    });
  }

  private runStateDemo = () => {
    this.pageViews++;
    this.lastAction = `Estado actualizado (${new Date().toLocaleTimeString()})`;
    this.demoOutput = `Página vista ${this.pageViews} veces - Estado reactivo funcionando!`;
  }

  render() {
    return html`
      <div class="container">
        <h1 class="title">🚀 Demo OpenCells Avanzado</h1>
        <p class="subtitle">
          Laboratorio interactivo de funcionalidades del framework
        </p>

        <div class="content">
          <div class="demo-info">
            <h2>🎯 ¿Qué estamos demostrando aquí?</h2>
            <p><strong>Esta página es un laboratorio interactivo</strong> donde puedes experimentar con las características más potentes de OpenCells:</p>
            <ul>
              <li><strong>Estado Reactivo:</strong> Los contadores y valores se actualizan automáticamente</li>
              <li><strong>Canales Pub/Sub:</strong> Comunicación global entre todas las páginas</li>
              <li><strong>Gestión de Idioma:</strong> Cambios sincronizados en toda la aplicación</li>
              <li><strong>Lifecycle Hooks:</strong> Control preciso del ciclo de vida de componentes</li>
            </ul>
          </div>
          
          <div class="features">
            <div class="feature">
              <div class="feature-title">📊 Monitor de Estado en Tiempo Real</div>
              <div class="feature-description">
                <p class="explanation">Observa cómo el estado se mantiene sincronizado y reactivo:</p>
                <div class="state-grid">
                  <div class="state-item">
                    <span class="state-label">Vistas de página:</span>
                    <span class="state-value">${this.pageViews}</span>
                    <small class="state-note">Se incrementa cada vez que entras a esta página</small>
                  </div>
                  <div class="state-item">
                    <span class="state-label">Última acción:</span>
                    <span class="state-value">${this.lastAction}</span>
                    <small class="state-note">Registro de la última interacción realizada</small>
                  </div>
                  <div class="state-item">
                    <span class="state-label">Mensajes de canal:</span>
                    <span class="state-value">${this.channelMessages}</span>
                    <small class="state-note">Número de mensajes publicados en canales</small>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="feature">
              <div class="feature-title">🎮 Laboratorio de Experimentos</div>
              <div class="feature-description">
                <p class="explanation">Haz clic en los botones para ver OpenCells en acción:</p>
                <div class="experiment-container">
                  <div class="experiment-output">
                    <strong>Resultado del experimento:</strong>
                    <div class="demo-output-text">${this.demoOutput}</div>
                  </div>
                  <div class="demo-actions">
                    <button class="btn btn-secondary" @click="${this.runChannelDemo}">
                      📡 Experimento: Canal Pub/Sub
                      <small>Publica datos en un canal global</small>
                    </button>
                    <button class="btn btn-secondary" @click="${this.runStateDemo}">
                      🔄 Experimento: Estado Reactivo
                      <small>Modifica el estado y observa los cambios</small>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="feature">
              <div class="feature-title">🌐 Control Global de Idioma</div>
              <div class="feature-description">
                <div class="language-demo">
                  <p class="explanation">
                    <strong>Prueba la sincronización global:</strong> Cuando cambies el idioma aquí, 
                    se actualizará automáticamente en todas las páginas gracias a los canales OpenCells.
                  </p>
                  <div class="language-status">
                    <span class="current-lang">${this.currentLanguage === 'es' ? '🇪🇸 Español' : '🇺🇸 English'}</span>
                    <small class="language-note">Idioma actual sincronizado globalmente</small>
                  </div>
                  <button 
                    class="btn btn-primary"
                    @click="${() => this.changeLanguage(this.currentLanguage === 'es' ? 'en' : 'es')}"
                  >
                    🔄 Cambiar a ${this.currentLanguage === 'es' ? '🇺🇸 English' : '🇪🇸 Español'}
                    <small>Observa cómo se actualiza la navegación superior</small>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
            <div class="feature">
              <div class="feature-title">Estado de la Aplicación</div>
              <div class="feature-description">
                Vistas de página: <strong>${this.pageViews}</strong><br>
                Última acción: <strong>${this.lastAction}</strong><br>
                Mensajes de canal: <strong>${this.channelMessages}</strong>
              </div>
            </div>
            
            <div class="feature">
              <div class="feature-title">🎮 Demo de Funcionalidades</div>
              <div class="feature-description">
                <p>Salida del demo: <strong>${this.demoOutput}</strong></p>
                <div class="actions">
                  <button class="btn btn-secondary" @click="${this.runChannelDemo}">
                    📡 Publicar en Canal
                  </button>
                  <button class="btn btn-secondary" @click="${this.runStateDemo}">
                    🔄 Cambiar Estado
                  </button>
                </div>
              </div>
            </div>
            
            <div class="feature">
              <div class="feature-title">🌐 Control de Idioma</div>
              <div class="feature-description">
                Idioma actual: <strong>${this.currentLanguage}</strong>
                <br>
                <button 
                  class="btn btn-secondary"
                  @click="${() => this.changeLanguage(this.currentLanguage === 'es' ? 'en' : 'es')}"
                >
                  Cambiar a ${this.currentLanguage === 'es' ? 'English' : 'Español'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="actions">
          <button class="btn btn-secondary" @click="${this.goHome}">
            🏠 ${getTranslation('navigation.home', this.currentLanguage)}
          </button>
          <button class="btn btn-primary" @click="${this.goToUsers}">
            👥 Ver Ejemplo Avanzado (Usuarios)
          </button>
        </div>
      </div>
    `;
  }
}
