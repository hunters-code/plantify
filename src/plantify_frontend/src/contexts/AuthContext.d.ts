// Type declarations for AuthContext
export interface AuthState {
  isAuthenticated: boolean;
  principal: any;
  isLoading: boolean;
  userInfo: any;
  isRegistered: boolean;
}

export interface AuthContextType extends AuthState {
  signIn: () => Promise<any>;
  signOut: () => Promise<void>;
  refreshUserInfo: () => Promise<void>;
  getActor: () => any;
  getAgent: () => any;
  initializeBackendActor: () => Promise<boolean>;
  isBackendDeclarationsAvailable: () => boolean;
  setBackendDeclarations: (idlFactory: any) => void;
}

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element;
export function useAuth(): AuthContextType;
