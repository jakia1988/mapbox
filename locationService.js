import axios from 'axios';
class LocationService{
    constructor() {
        this.authToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZjcwY2I0Y2VmMzI3NWQ4MDM2YWVkOSIsImlhdCI6MTYxMTgzODE1MSwiZXhwIjoxNjE0NDMwMTUxfQ.5WgAIt43zo7ooFP_qFb6CS5OtyMk3mVP2bXRJ6TLP2Q`;
    }
    async getAllLocation(isYouActiveTab) {
        const url = isYouActiveTab ? `https://bp-strapi.popcornv.com/all-locations/v0.1/` : 'https://bp-strapi.popcornv.com/all-locations/v0.1/visited-by-bruised-passport';
        const headers = {
            "Authorization": `Bearer ${this.authToken}`,
            "Content-Type": "application/json"
        }
        const isHeader = isYouActiveTab ? headers : {}
        const response  =  await axios({
            method: 'get',
            url,
            isHeader
        });
        return {
            'locations' : isYouActiveTab ? response.data.locations : response.data.all_locations,
            'selectedLocation':  isYouActiveTab ? response.data.scratched_locations.features : response.data.all_locations
        }
    }

    async addSelectedLocation(locationId) {
        const url = `https://bp-strapi.popcornv.com/all-locations/v0.1/scratch`;
        const data = {"locations": [locationId]}
        const headers = {
            "Authorization": `Bearer ${this.authToken}`,
            "Content-Type": "application/json"
        }
        const result = await axios({
            method: 'post',
            url,
            data,
            headers
        });

    }

    async removeSelectedLocation(locationId) {
        const url = `https://bp-strapi.popcornv.com/all-locations/v0.1/remove-scratch`;
        const data = {"locations": [locationId]}
        const headers = {
            "Authorization": `Bearer ${this.authToken}`,
            "Content-Type": "application/json"
        }
        await axios({
            method: 'post',
            url,
            data,
            headers
        });
    }

    async scratchedOnlyTheselocations(locations) {
        const url = `https://bp-strapi.popcornv.com/all-locations/v0.1/scratch-only-these`;
        const data = {"locations": locations} // locations expecting array
        const headers = {
            "Authorization": `Bearer ${this.authToken}`,
            "Content-Type": "application/json"
        }
        await axios({
            method: 'post',
            url,
            data,
            headers
        });
    }



}

export default LocationService;