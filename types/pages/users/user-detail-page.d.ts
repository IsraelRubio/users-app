import { LitElement } from 'lit';
import { PageController } from '@open-cells/page-controller';
import '../../components/app-toolbar.js';
export declare class UserDetailPage extends LitElement {
    pageController: PageController;
    private user;
    private loading;
    private error;
    private currentLanguage;
    private userId;
    static styles: import("lit").CSSResult;
    onPageEnter(params: {
        id?: string;
    }): void;
    onPageLeave(): void;
    private loadUser;
    private navigateBack;
    private handleBackClick;
    private handleLogoClick;
    render(): import("lit-html").TemplateResult<1>;
}
