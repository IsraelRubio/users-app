import { LitElement } from 'lit';
import { PageController } from '@open-cells/page-controller';
export declare class SecondPage extends LitElement {
    pageController: PageController;
    private currentLanguage;
    private demoOutput;
    private channelMessages;
    private pageViews;
    private lastAction;
    static styles: import("lit").CSSResult[];
    onPageEnter(): void;
    onPageLeave(): void;
    private goHome;
    private goToUsers;
    private changeLanguage;
    private runChannelDemo;
    private runStateDemo;
    render(): import("lit-html").TemplateResult<1>;
}
