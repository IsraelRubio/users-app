import { LitElement } from 'lit';
import { PageController } from '@open-cells/page-controller';
export declare class LoginPage extends LitElement {
    pageController: PageController;
    private username;
    private password;
    private loading;
    private error;
    static styles: import("lit").CSSResult[];
    onPageEnter(): void;
    onPageLeave(): void;
    private handleLogin;
    private handleInputChange;
    render(): import("lit-html").TemplateResult<1>;
}
