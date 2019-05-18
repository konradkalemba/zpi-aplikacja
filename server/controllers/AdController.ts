import { Request, Response } from 'express'
import { Ad } from './../entities'

/**
 * Ad controller
 *
 * @export
 * @class AdController
 */
export default class AdController {
    /**
     *  
     *
     * @param {Request} request
     * @param {Response} response
     * @memberof AdController
     */
    async index (request: Request, response: Response) {
        const ads = await Ad.find({ relations: ['street', 'photos'] })
        
        response.send(ads)
    }
}