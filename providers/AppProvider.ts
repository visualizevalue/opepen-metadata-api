import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor (protected app: ApplicationContract) {
  }

  public register () {
    // Register your own bindings
  }

  public async boot () {
    // IoC container is ready
    const { default: MetadataParser } = await import('App/Services/Metadata/MetadataParser')
    this.app.container.singleton('MetadataParser', () => new MetadataParser())
  }

  public async ready () {
    // App is ready
    await this.app.container.use('MetadataParser').initialize()
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
