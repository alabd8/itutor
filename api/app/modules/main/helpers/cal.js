import { HUN, KM } from '../constants';

export default async (params) => {
	if(params.coords){

		const lat = params.coords.lat * HUN;
		const long = params.coords.long * HUN;

		const north = (( lat + KM ) / HUN );
		const south = (( lat - KM ) / HUN );
		const west = (( long - KM ) / HUN );
		const east = (( long + KM ) / HUN );

		return { north, south, west, east }; 
	}
}