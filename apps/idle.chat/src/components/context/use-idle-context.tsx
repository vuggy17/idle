import { useContext } from 'react';
import { IdleContext } from '.';

/**
 * follow https://ant.design/docs/react/customize-theme
 *
 * see {@linkcode ThemeConfig}
 */

// eslint-disable-next-line import/prefer-default-export
export const useIdleContext = () => useContext(IdleContext);
