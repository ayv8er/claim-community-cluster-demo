import { useState, useCallback, useEffect } from 'react';
import { checkNameAvailability } from '../lib/api/clusters';
import useDebounce from './useDebounce';

export function useCommunityNameAvailability(delay = 500) {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [desiredName, setDesiredName] = useState("");
  
  const debouncedDesiredName = useDebounce(desiredName, delay);

  const checkAvailability = useCallback(async (name: string) => {
    if (!name) {
      setIsAvailable(null);
      return;
    }

    setIsChecking(true);
    
    try {
      const data = await checkNameAvailability(name);
      setIsAvailable(data.isAvailable);
    } catch (error) {
      console.error('Error checking name availability:', error);
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    checkAvailability(debouncedDesiredName);
  }, [debouncedDesiredName, checkAvailability]);

  return {
    desiredName,
    setDesiredName,
    isAvailable,
    isChecking
  };
}