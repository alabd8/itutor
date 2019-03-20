import { HUN, KM } from '../constants';

export default async (body) => {
	if(body.coords){

		const lat = body.coords.lat * HUN;
		const long = body.coords.long * HUN;

		const north = (( lat + KM ) / HUN );
		const south = (( lat - KM ) / HUN );
		const west = (( long - KM ) / HUN );
		const east = (( long + KM ) / HUN );

		return { north, south, west, east }; 
	}
}