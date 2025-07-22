import { LitElement } from 'lit';
import { PageController } from '@open-cells/page-controller';
export declare class AppToolbar extends LitElement {
    pageController: PageController;
    currentPage: string;
    showLanguageSelector: boolean;
    showBackButton: boolean;
    private currentLanguage;
    static styles: import("lit").CSSResult;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private changeLanguage;
    private handleBack;
    private handleLogoClick;
    render(): import("lit-html").TemplateResult<1>;
}
