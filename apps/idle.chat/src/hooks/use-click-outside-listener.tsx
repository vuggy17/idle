import { useEffect, MouseEvent, MutableRefObject } from 'react';

/**
 * Hook that alerts clicks outside of the passed ref
 * @param ref element to watch
 * @param onClickOutside callback function called when click outside element
 */
export default function useClickOutsideListener(
  ref: MutableRefObject<HTMLElement | null>,
  onClickOutside: () => void,
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent<Document>) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside();
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside as any);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside as any);
    };
  }, [ref, onClickOutside]);
}
