import { useAuth as useAuthContext } from '../contexts/AuthContext';

export function useAuth() {
  return useAuthContext();
}

export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  
  return {
    isAuthenticated,
    isLoading,
    requiresAuth: !isAuthenticated && !isLoading,
  };
}

export function useUserInfo() {
  const { userInfo, principal, isAuthenticated } = useAuth();
  
  return {
    userInfo,
    principal,
    isAuthenticated,
    principalString: principal?.toString(),
  };
}

export function useBackend() {
  const { getActor, getAgent, initializeBackendActor, isBackendDeclarationsAvailable } = useAuth();
  
  return {
    actor: getActor(),
    agent: getAgent(),
    initializeBackendActor,
    isBackendAvailable: getActor() !== null,
    isBackendDeclarationsAvailable: isBackendDeclarationsAvailable(),
  };
}
