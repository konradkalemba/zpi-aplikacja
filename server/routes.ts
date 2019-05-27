import { AdController, StreetController } from './controllers'

const adController = new AdController()
const streetController = new StreetController()

export default [
    {
        path: '/ads',
        method: 'get',
        handle: adController.index
    },
    {
        path: '/streets/',
        method: 'get',
        handle: streetController.index
    }
]