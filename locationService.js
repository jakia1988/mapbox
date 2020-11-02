import axios from 'axios';
import { isNil } from 'lodash';

class LocationService{
    constructor() {
        this.authToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmOWZjYWI3Y2NhNjE3N2JkYzBiN2U4NCIsImlhdCI6MTYwNDMwNzYzOSwiZXhwIjoxNjA2ODk5NjM5fQ.vk1R_Junm1KQ3s_mIw3dH3xnyfELt2UIxudqJ5F-ejk`;
    }
    async getAllLocation() {
        const url = `https://bp-strapi.popcornv.com/all-locations/v0.1/`;
        const headers = {
            "Authorization": `Bearer ${this.authToken}`,
            "Content-Type": "application/json"
        }
        const {data: {locations, scratched_locations}} = await axios({
            method: 'get',
            url,
            headers
        });
        return {
            locations,
            selectedLocation: !isNil(scratched_locations) ? scratched_locations.features : []
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