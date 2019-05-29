import { config as loadDotEnvVariables } from 'dotenv'

// Load enviroment variables from `.env` file
loadDotEnvVariables()

import { connect as databaseConnect } from './database'
import { Street } from './entities'
import request from 'request'
import { IsNull } from 'typeorm'

const { GOOGLE_GEOCODING_API_KEY } = process.env

databaseConnect().then(async () => {
    const streets = await Street.find({ 
        where: {
            cityId: 986283,
            lat: IsNull(),
            long: IsNull()
        }
    })

    for (const street of streets) {
        request(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(`${street.name},Wrocław`)}&key=${GOOGLE_GEOCODING_API_KEY}`,  async (error, response, body) => {
            body = JSON.parse(body)
            
            if (body.results) {
                if (body.results.length) {
                    const { geometry } = body.results[0]

                    street.lat = geometry.location.lat
                    street.long = geometry.location.lng
                    street.save()
                }
            }
        })
    }
}).catch(error => console.error(error))