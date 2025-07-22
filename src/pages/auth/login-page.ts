import { html, LitElement, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';
import { authService } from '../../services/auth-service.js';

@customElement('login-page')
export class LoginPage extends LitElement {
  pageController = new PageController(this);

  @state() private username = '';
  @state() private password = '';
  @state() private loading = false;
  @state() private error: string | null = null;

  static styles = [
    css`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: Arial, sans-serif;
    }

    .login-container {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-width: 400px;
      margin: 1rem;
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .login-title {
      font-size: 2rem;
      color: #333;
      margin: 0 0 0.5rem 0;
    }

    .login-subtitle {
      color: #666;
      margin: 0;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e1e5e9;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
    }

    .login-button {
      width: 100%;
      padding: 0.75rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      margin-bottom: 1rem;
    }

    .login-button:hover:not(:disabled) {
      background: #5a6fd8;
    }

    .login-button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .error-message {
      background: #fee;
      color: #c53030;
      padding: 0.75rem;
      border-radius: 6px;
      margin-bottom: 1rem;
      border: 1px solid #feb2b2;
    }

    .demo-credentials {
      background: #f7fafc;
      padding: 1rem;
      border-radius: 6px;
      margin-top: 1rem;
      border: 1px solid #e2e8f0;
    }

    .demo-title {
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #2d3748;
    }

    .demo-item {
      margin: 0.25rem 0;
      font-size: 0.9rem;
      color: #4a5568;
    }

    .loading-spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid #ffffff;
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 1s ease-in-out infinite;
      margin-right: 0.5rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    `
  ];

  onPageEnter() {
    if (authService.isLoggedIn()) {
      this.pageController.navigate('home');
    }
  }

  onPageLeave() {
    // No hay suscripciones que limpiar
  }

  private async handleLogin(e: Event) {
    e.preventDefault();
    
    if (!this.username || !this.password) {
      this.error = 'Por favor completa todos los campos';
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const user = await authService.login(this.username, this.password);
      
      // Actualizar contexto del interceptor
      this.pageController.setInterceptorContext(authService.getAuthContext());
      
      this.pageController.navigate('home');
      
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Error de autenticación';
    } finally {
      this.loading = false;
    }
  }

  private handleInputChange(field: 'username' | 'password', value: string) {
    if (field === 'username') {
      this.username = value;
    } else {
      this.password = value;
    }

    if (this.error) {
      this.error = null;
    }
  }

  render() {
    return html`
      <div class="login-container">
        <div class="login-header">
          <h1 class="login-title">🔐 Login</h1>
          <p class="login-subtitle">Accede a la aplicación OpenCells</p>
        </div>

        <form @submit="${this.handleLogin}">
          <div class="form-group">
            <label class="form-label">Usuario:</label>
            <input
              type="text"
              class="form-input"
              .value="${this.username}"
              @input="${(e: InputEvent) => this.handleInputChange('username', (e.target as HTMLInputElement).value)}"
              placeholder="Ingresa tu usuario"
              ?disabled="${this.loading}"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Contraseña:</label>
            <input
              type="password"
              class="form-input"
              .value="${this.password}"
              @input="${(e: InputEvent) => this.handleInputChange('password', (e.target as HTMLInputElement).value)}"
              placeholder="Ingresa tu contraseña"
              ?disabled="${this.loading}"
            />
          </div>

          ${this.error ? html`
            <div class="error-message">
              ❌ ${this.error}
            </div>
          ` : ''}

          <button
            type="submit"
            class="login-button"
            ?disabled="${this.loading}"
          >
            ${this.loading ? html`
              <span class="loading-spinner"></span>
              Iniciando sesión...
            ` : 'Iniciar Sesión'}
          </button>
        </form>

        <div class="demo-credentials">
          <div class="demo-title">🧪 Credenciales de prueba:</div>
          <div class="demo-item"><strong>Admin:</strong> admin / admin</div>
          <div class="demo-item"><strong>Usuario:</strong> user / user</div>
        </div>
      </div>
    `;
  }
}
