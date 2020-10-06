import axios from 'axios';

class LocationService{
    constructor() {
        this.authToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNzQ5ZWM1ZTMwZTVjNmE2YjZhZWVhNCIsImlhdCI6MTYwMTkwMjM5MywiZXhwIjoxNjA0NDk0MzkzfQ.ecF5klw7I-vMgsR58QCLA5sVJW1I3nUo2jhZevTzon4`;
    }
    async getAllLocation() {
       const {data: {locations}} = await axios.get('https://bp-strapi.popcornv.com/all-locations/v0.1/');
       return locations[0];
    }

    async addSelectedLocation(locationId) {
        const url = `https://bp-strapi.popcornv.com/all-locations/v0.1/scratch`;
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


}

export default LocationService;