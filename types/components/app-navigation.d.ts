import { LitElement } from 'lit';
import { PageController } from '@open-cells/page-controller';
export declare class AppNavigation extends LitElement {
    pageController: PageController;
    currentRoute: string;
    currentLanguage: string;
    isLoggedIn: boolean;
    userRole: string;
    static styles: import("lit").CSSResult;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private navigateTo;
    private changeLanguage;
    private updateAuthState;
    private handleLogout;
    render(): import("lit-html").TemplateResult<1>;
}
