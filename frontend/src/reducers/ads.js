const ads = (state = [], action) => {
    switch (action.type) {
        case 'SET_ADS':
            return [
                ...action.ads
            ]
        default:
            return state
    }
}

export default ads