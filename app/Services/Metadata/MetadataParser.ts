import Drive from '@ioc:Adonis/Core/Drive'
import template from './MetadataTemplate.json'
import { Attribute, MetadataProvenance, ContractMetadata, TokenMetadata } from './MetadataTypes'

/**
 * A class for parsing metadata and metadata provenance.
 */
export default class MetadataParser {
  metadata: MetadataProvenance

  /**
   * Initialize the MetadataParser with metadata from a JSON file or a default template
   *
   * @returns {Promise} A promise that resolves to an instance of MetadataParser
   */
  public async initialize (): Promise<MetadataParser> {
    let metadata: MetadataProvenance

    if (await Drive.exists('metadata.json')) {
      metadata = JSON.parse((await Drive.get('metadata.json')).toString())
    } else {
      metadata = template
    }

    this.metadata = metadata

    return this
  }

  /**
   * Get the contract metadata
   *
   * @returns {Promise} A promise that resolves to the contract metadata
   */
  public async contract (): Promise<ContractMetadata> {
    return this.metadata.contract
  }

  /**
   * Get the base token metadata
   *
   * @returns {Promise} A promise that resolves to the base metadata
   */
  public async base (): Promise<TokenMetadata> {
    return this.metadata.base
  }

  /**
   * Get the metadata for a specified tokenID
   *
   * @param {String|Number} id The ID of the token to provide metadata for
   * @returns {Promise} A promise that resolves to the metadata for the specified ID
   */
  public async forId (id: string|number): Promise<TokenMetadata> {
    const tokenDefinition = this.metadata.tokens[id]

    const isOneOfOne = typeof tokenDefinition === 'object'

    const definition = isOneOfOne
      ? tokenDefinition
      : typeof tokenDefinition === 'string'
        ? this.metadata.editions[tokenDefinition]
        : this.metadata.base

    const name = this.getAttribute('name', definition) as string

    return {
      name: isOneOfOne ? name : name + ` ${id}`,
      description: this.getAttribute('description', definition) as string,
      image: this.getAttribute('image', definition) as string,
      attributes: [
        ...this.getAttribute('attributes', definition) as Attribute[],
        {
          trait_type: 'Number',
          value: parseInt(`${id}`)
        }
      ],
    }
  }

  getAttribute (attribute: keyof TokenMetadata, bag: TokenMetadata) {
    if (bag[attribute]) return bag[attribute]

    return this.metadata.base[attribute]
  }

}
