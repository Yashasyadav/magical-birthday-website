import { useAuthenticationContext } from '../context/AuthenticationContext';

export function useAuthentication() {
  const { state, submitAnswer } = useAuthenticationContext();
  
  return {
    ...state,
    submitAnswer
  };
}
