//Thanks to Riseno and Ethical for coordinates, testing and stuff.
const Command = require('command'),
		HARROWHOLD = 9950,
		MARKER = 81801,
		COORDS = [
		{x:-7364,y:-83180,z:1},
		{x:-8946,y:-84887,z:1},
		{x:-9309,y:-83946,z:1},
		{x:-6667,y:-85440,z:1},
		{x:-6411,y:-84057,z:1}];

module.exports = function hhmarker(dispatch) {
	const command = Command(dispatch)
	let enabled = true,
		uid = 999999999,
		markers = [];
	
	command.add('hhmarker', () => {
		if(enabled){
			enabled = false;
			command.message('HH-Marker cage module toggled off');
		}
		else if(!enabled){
			enabled = true;
			command.message('HH-Marker cage module toggled on');
		}
		else{
			command.message('Invalid input');
		}
	});
	
	dispatch.hook('S_LOAD_TOPO', 1, (event) => {
		if(event.zone == HARROWHOLD){
			for(let i in COORDS){
				SpawnThing(COORDS[i],MARKER);
			}
		}
	});
	
	function ClearSpawns(){
		if(markers){
			for(let i in markers){
				Despawn(markers[i]);
			}
			markers = [];
		}
	}
	
	function SpawnThing(position,item){
		dispatch.toClient('S_SPAWN_WORKOBJECT', 1, {
			uid : uid,
			item : item,
			amount : 1,
			x : position.x,
			y : position.y,
			z : position.z,
			unk1 : 0,
			unk2 : 2,
			unk3 : 0
		});
		markers.push(uid);
		uid--;
	}
	
	function Despawn(uid){
	dispatch.toClient('S_DESPAWN_WORKOBJECT', 1, {
			uid : uid,
			unk : 0
		});
	}

}
