export default async (body) => {
	if(body.coords){
		const coord = "00,040000";
		const lat = body.coords.lat;
		const long = body.coords.long;
		console.log(JSON.parse(coord));

		const north = lat + JSON.parse(coord);
		const south = lat - JSON.parse(coord);
		const west = long - JSON.parse(coord);
		const east = long + JSON.parse(coord);

		console.log(`
			north: ${north}
			south: ${south}
			west: ${west}
			east: ${east}
		`);
		return { north: north, south: south, west: west, east: east }; 
	}
}