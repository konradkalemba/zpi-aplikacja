import { Request, Response } from 'express'
import { Ad } from './../entities'
import { Size } from '../entities/Ad'
import { FindConditions, Not, Equal, Between, MoreThanOrEqual, LessThanOrEqual, In } from 'typeorm'

// const filters = ['size', 'roomsNumber', 'floor', 'priceMin', 'priceMax', 'areaMin', 'areaMax']

// type Filters = {
//     roomsNumber?: number,
//     floor?: number,
//     priceMin?: number,
//     priceMax?: number,
//     areaMin?: number,
//     areaMax?: number
// }

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
        const { query } = request
        const filters: FindConditions<Ad> = {}

        if (query.size) {
            if (query.size == Size.Room) {
                filters.roomsNumber = Equal(1)
            } else if (query.size === Size.Flat) {
                if (query.roomsNumber) {
                    if (query.roomsNumber.indexOf(',') === -1) {
                        filters.roomsNumber = Equal(parseInt(query.roomsNumber))
                    } else {
                        filters.roomsNumber = In(query.roomsNumber.split(',').map((num: string) => parseInt(num)))
                    }
                } else {
                    filters.roomsNumber = Not(1)
                }
            }
        }

        if (query.floor) {
            if (query.floor.indexOf(',') === -1) {
                filters.floor = Equal(query.floor)
            } else {
                filters.floor = In(query.floor.split(','))
            }
        }

        if (query.priceMin && query.priceMax) {
            filters.price = Between(parseFloat(query.priceMin), parseFloat(query.priceMax))
        } else if (query.priceMin) {
            filters.price = MoreThanOrEqual(parseFloat(query.priceMin))
        } else if (query.priceMax) {
            filters.price = LessThanOrEqual(parseFloat(query.priceMax))
        }

        if (query.areaMin && query.areaMax) {
            filters.area = Between(parseFloat(query.areaMin), parseFloat(query.areaMax))
        } else if (query.areaMin) {
            filters.area = MoreThanOrEqual(parseFloat(query.areaMin))
        } else if (query.areaMax) {
            filters.area = LessThanOrEqual(parseFloat(query.areaMax))
        }

        const ads = await Ad.find({ 
            where: {
                ...filters
            },
            relations: ['street', 'photos']
        })
        
        response.send(ads)
    }
}