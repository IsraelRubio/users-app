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

export class AuthService {
  private static instance: AuthService;
  private currentUser: UserAuth | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Simular login
  login(username: string, password: string): Promise<UserAuth> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulación de diferentes usuarios
        if (username === 'admin' && password === 'admin') {
          this.currentUser = {
            id: 1,
            username: 'admin',
            role: 'admin',
            isLoggedIn: true
          };
          resolve(this.currentUser);
        } else if (username === 'user' && password === 'user') {
          this.currentUser = {
            id: 2,
            username: 'user',
            role: 'user',
            isLoggedIn: true
          };
          resolve(this.currentUser);
        } else {
          reject(new Error('Credenciales inválidas'));
        }
      }, 1000); 
    });
  }

  logout(): void {
    this.currentUser = null;
  }

  getCurrentUser(): UserAuth | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null && this.currentUser.isLoggedIn;
  }

  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  // Para el contexto del interceptor
  getAuthContext() {
    return {
      isLoggedIn: this.isLoggedIn(),
      user: this.currentUser,
      role: this.currentUser?.role || 'guest'
    };
  }
}

export const authService = AuthService.getInstance();
