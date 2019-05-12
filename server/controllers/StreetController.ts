import { Request, Response } from 'express'
import { Street } from './../entities'

/**
 * Street controller
 *
 * @export
 * @class StreetController
 */
export default class StreetController {
    /**
     *  
     *
     * @param {Request} request
     * @param {Response} response
     * @memberof StreetController
     */
    async index (request: Request, response: Response) {
        let streets = await Street.find()

        response.send(streets)
    }
}