export default async (body) => {
	if(body.coords){
		const coord = 00,040000;
		const lat = body.coords.lat;
		const long = body.coords.long;

		const north = lat + coord;
		const south = lat - coord;
		const west = long - coord;
		const east = long + coord;

		return { north: north, south: south, west: west, east: east }; 
	}
}