/**
 * Defines the format for an attribute within token metadata
 */
export type Attribute = {
  trait_type: string,
  value: string|number,
}

/**
 * Defines the format for contract metadata
 */
export type ContractMetadata = {
  name?: string,
  description?: string,
  imageURI?: string,
  royaltyBPS?: number,
  royaltyRecipient?: string,
}

/**
 * Defines the format for token metadata
 */
export type TokenMetadata = {
  name?: string,
  description?: string,
  image: string,
  image_dark?: string,
  animation_url?: string,
  embed_url?: string,
  download_url?: string,
  attributes?: Attribute[],
}

/**
 * Defines the format of our custom metadata provenance files
 */
export type MetadataProvenance = {
  version: number,
  contract: ContractMetadata,
  base: TokenMetadata,
  editions: {
    [key: string]: TokenMetadata,
  },
  tokens: {
    [key: string]: TokenMetadata|string,
  },
}
