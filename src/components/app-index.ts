import { startApp } from '@open-cells/core';
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ElementController } from '@open-cells/element-controller';
import { routes } from '../router/routes.js';
import './app-navigation.js';

// Importar todas las páginas
import '../pages/home/home-page.js';
import '../pages/auth/login-page.js';
import '../pages/users/users-page.js';
import '../pages/second/second-page.js';

// Configurar OpenCells sin interceptor (volvemos al enfoque manual)
startApp({
  routes,
  mainNode: 'app-content'
});

@customElement('app-index')
export class AppIndex extends LitElement {
  elementController = new ElementController(this);

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100vh;
    }
    
    main {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      padding-top: 100px;
    }
    
    ::slotted(*) {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      visibility: hidden;
    }
    
    ::slotted([state="active"]) {
      visibility: visible;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    
    console.log('✅ App inicializada con autenticación manual en páginas');
  }

  render() {
    return html`
      <app-navigation></app-navigation>
      <main role="main">
        <slot></slot>
      </main>
    `;
  }
}
