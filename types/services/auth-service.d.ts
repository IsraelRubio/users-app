/**
 * Servicio de autenticación simple para demostrar Router Interceptor
 * En una aplicación real, esto se conectaría a un backend
 */
export interface UserAuth {
    id: number;
    username: string;
    role: 'admin' | 'user' | 'guest';
    isLoggedIn: boolean;
}
export declare class AuthService {
    private static instance;
    private currentUser;
    private constructor();
    static getInstance(): AuthService;
    login(username: string, password: string): Promise<UserAuth>;
    logout(): void;
    getCurrentUser(): UserAuth | null;
    isLoggedIn(): boolean;
    hasRole(role: string): boolean;
    getAuthContext(): {
        isLoggedIn: boolean;
        user: UserAuth | null;
        role: "admin" | "user" | "guest";
    };
}
export declare const authService: AuthService;
