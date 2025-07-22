import { LitElement } from 'lit';
import { ElementController } from '@open-cells/element-controller';
import './app-navigation.js';
import '../pages/home/home-page.js';
import '../pages/auth/login-page.js';
import '../pages/users/users-page.js';
import '../pages/second/second-page.js';
export declare class AppIndex extends LitElement {
    elementController: ElementController;
    static styles: import("lit").CSSResult;
    connectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
}
