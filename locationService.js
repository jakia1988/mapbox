import axios from 'axios';

class LocationService{
    async getAllLocation() {
       const {data: {locations}} = await axios.get('https://bp-strapi.popcornv.com/all-locations/v0.1/');
       console.log(locations)
       return locations[0];
    }


}

export default LocationService;