import { useLoadingContext } from '../context/LoadingContext';

/**
 * useLoading hook
 * Exposes the loading state (progress, message, completion).
 * 
 * @returns {{
 *   progress: number,
 *   assetsLoaded: number,
 *   assetsTotal: number,
 *   currentMessage: string,
 *   isComplete: boolean
 * }}
 */
export function useLoading() {
  return useLoadingContext();
}
