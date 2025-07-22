import { LitElement } from 'lit';
import { PageController } from '@open-cells/page-controller';
import '../../components/app-toolbar.js';
export declare class HomePage extends LitElement {
    pageController: PageController;
    private currentLanguage;
    private appTitle;
    static styles: import("lit").CSSResult[];
    onPageEnter(): void;
    onPageLeave(): void;
    private updateAppTitle;
    private navigateToUsers;
    private navigateToSecond;
    private changeLanguage;
    private showNotification;
    private handleLogoClick;
    render(): import("lit-html").TemplateResult<1>;
}
