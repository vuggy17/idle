import { ThemeConfig, theme } from 'antd';
import { Modify } from 'utils/typing';

export function readThemeConfig(config: SerializableThemeConfig): ThemeConfig {
  const algorithmMapping = {
    default: theme.defaultAlgorithm,
    dark: theme.darkAlgorithm,
    compact: theme.compactAlgorithm,
  };

  const algorithm = algorithmMapping[config.algorithm ?? 'default'];

  return {
    ...config,
    algorithm,
  };
}
export type SerializableThemeConfig = Modify<
  ThemeConfig,
  {
    algorithm?: 'dark' | 'default' | 'compact';
  }
>;
