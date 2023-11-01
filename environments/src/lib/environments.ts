export class ConfigProvider {
  // Method to get a config value
  static get projectId() {
    return process.env['APP_PROJECT_ID'];
  }
  static get apiKey() {
    return process.env['APP_API_KEY'];
  }
}
