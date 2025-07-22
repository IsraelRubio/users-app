import { LitElement } from 'lit';
import { PageController } from '@open-cells/page-controller';
import { ElementController } from '@open-cells/element-controller';
/**
 * Página de usuarios con funcionalidades completas de OpenCells
 * Demuestra todas las características del framework:
 * - PageController y ElementController
 * - Gestión de estado mediante canales (pub/sub)
 * - Bounded properties con debounce
 * - Lifecycle hooks de página
 * - Integración con API externa
 * - Localización y traducciones
 * - Transiciones automáticas
 * - Toolbar reutilizable con CSS externo
 */
export declare class UsersPage extends LitElement {
    pageController: PageController;
    elementController: ElementController;
    private users;
    private currentLanguage;
    private loading;
    private error;
    private searchTerm;
    private filteredUsers;
    private maxUsers;
    private searchDebounceMs;
    private searchTimeout;
    static styles: import("lit").CSSResult[];
    onPageEnter(): void;
    onPageLeave(): void;
    private loadUsers;
    private handleSearch;
    private applyFilters;
    private viewUserDetail;
    private clearFilters;
    private reloadUsers;
    render(): import("lit-html").TemplateResult<1>;
}
