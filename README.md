# Opepen Metadata Service

The Opepen Edition is a collection of 16.000 tokens on Ethereum mainnet. 
They are revealed in 200 sets of 80 tokens.
Their token metadata points to a deployment of this metadata api service.
Once all sets are revealed, metadata will move to a more permanent storage solution.

The Opepen project consists of three code repositories:

1. This Metadata Service powering the reveals
2. [An API + database powering the site](https://github.com/visualizevalue-dev/opepen-api)
3. [A web application powering the opepen.art site](https://github.com/visualizevalue-dev/opepen-app)

## Metadata Renderer

At the heart of this repo is a simple [`metadata.json`](app/Services/Metadata/metadata.json) config file and a [`MetadataParser`](app/Services/Metadata/MetadataParser.ts) service.

Forks and pull requests are welcome!
