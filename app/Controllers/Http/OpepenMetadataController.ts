import { validator, schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ResponseContract } from '@ioc:Adonis/Core/Response'
import MetadataParser from '@ioc:MetadataParser'
import Drive from '@ioc:Adonis/Core/Drive'

export default class OpepenMetadataController {

  /**
   * Get the contract metadata
   *
   * @returns {Promise} A promise that resolves to the contract metadata
   */
  public async contractMetadata () {
    return await MetadataParser.contract()
  }

  /**
   * Get the base edition image
   *
   * @param {Object} ctx The HTTP context
   * @param {Object} ctx.response The HTTP response
   * @returns {Promise} A promise that resolves to the base image
   */
  public async baseImage ({ response }: HttpContextContract) {
    const data = await MetadataParser.base()
    return this.resolveImage(data.image, response)
  }

  /**
   * Get the metadata for the specified ID
   *
   * @param {Object} ctx The HTTP context
   * @param {Object} ctx.params The HTTP request parameters
   * @param {Number} ctx.params.id The ID of the metadata to retrieve
   * @returns {Promise} A promise that resolves to the metadata for the specified ID
   */
  public async metadata ({ params }: HttpContextContract) {
    await this.validate(params)

    const data = await MetadataParser.forId(params.id)

    if (! data.image.startsWith('http') && ! data.image.startsWith('ipfs://')) {
      // FIXME: replace with correct URI
      data.image = `https://metadata-service.xyz/${params.id}/image.png`
    }

    return data
  }

  /**
   * Get the image for the specified ID
   *
   * @param {Object} ctx The HTTP context
   * @param {Object} ctx.params The HTTP request parameters
   * @param {Number} ctx.params.id The ID of the metadata to retrieve the image for
   * @param {Object} ctx.response The HTTP response
   * @returns {Promise} A promise that resolves to the image for the specified ID
   */
  public async image (ctx: HttpContextContract) {
    const { params, response } = ctx
    await this.validate(params)

    const data = await MetadataParser.forId(params.id)

    if (! data.image) {
      data.image = (await MetadataParser.base()).image
    }

    return this.resolveImage(data.image, response)
  }

  /**
   * Resolve the image URL and return the image
   *
   * @param {String} image The image URL to resolve
   * @param {Object} response The HTTP response
   * @returns {Promise} A promise that resolves to the image
   */
  private async resolveImage (image: string, response: ResponseContract) {
    if (image.startsWith('ipfs://')) {
      return response.redirect(`https://ipfs.io/ipfs/${image.replace('ipfs://', '')}`, false, 302)
    }

    if (image.startsWith('https://')) {
      return response.redirect(image, false, 302)
    }

    response.stream(await Drive.getStream(`images/${image}`))
  }

  /**
   * Validate the specified data against the validID schema
   *
   * @param {Object} data The data to validate
   * @throws {Error} Throws an error if the validation fails
   */
  private async validate (data) {
    const validID = schema.create({
      id: schema.number([
        rules.range(1, 16000),
      ]),
    })

    await validator.validate({
      schema: validID,
      data,
      messages: {
        range: `This token does not exist`
      }
    })
  }

}
