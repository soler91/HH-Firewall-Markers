//Thanks to Riseno and Ethical for coordinates, testing and stuff.
const	{protocol} = require('tera-data-parser'),
		Command = require('command'),		
		HARROWHOLD = 9950,
		MARKER = 1,
		COORDS = [
        	{x:-7364,y:-83180,z:1},  // Front (head)
        	{x:-8946,y:-84887,z:1},  // Right-Back leg
		{x:-8686,y:-85301,z:1},  // Right-Back leg 2
        	{x:-8620,y:-83531,z:1},  // Right-Front leg
        	{x:-6667,y:-85440,z:1},  // Left-Back leg
		{x:-7403,y:-85814,z:1},  // Left-Back leg 2
        	{x:-6411,y:-84057,z:1}, // Left-Front leg
		{x:-6353,y:-84872,z:1}, // Left-Middle
		{x:-8985,y:-84054,z:1}]; // Right-Middle

// Temporal packet def until tera-data updates
if (!protocol.messages.has('S_SPAWN_BUILD_OBJECT')) {
  const packet = [
    ['ownerName', 'offset'],
    ['message', 'offset'],
    ['uid', 'uint64'],
    ['itemId', 'uint32'],
    ['x', 'float'],
    ['y', 'float'],
    ['z', 'float'],
    ['w', 'int16'],
    ['unk', 'uint16'],
    ['ownerName', 'string'],
    ['message', 'string']];
  packet.type = 'root';
  protocol.messages.set('S_SPAWN_BUILD_OBJECT', new Map().set(1, packet));
}
if (!protocol.messages.has('S_DESPAWN_BUILD_OBJECT')) {
  const packet = [
    ['uid', 'uint64'],
    ['unk', 'byte']];
  packet.type = 'root';
  protocol.messages.set('S_DESPAWN_BUILD_OBJECT', new Map().set(1, packet));
}

module.exports = function hhmarker(dispatch) {
	const command = Command(dispatch)
	let enabled = true,
		inDung = false,
		uid = 999999999,
		name = '',
		markers = [];
	
	command.add('hhmarker', () => {
		if(enabled){
			enabled = false;
			ClearSpawns()
			command.message('HH-Marker cage module toggled off');
		}
		else if(!enabled){
			enabled = true;
			SpawnMarkers()
			command.message('HH-Marker cage module toggled on');
		}
		else{
			command.message('Invalid input');
		}
	});
	
	dispatch.hook('S_LOGIN', 2, (event) => {
		name = event.name;
	});
	
	dispatch.hook('S_LOAD_TOPO', 1, (event) => {
		ClearSpawns();
		if(event.zone == HARROWHOLD){
			inDung = true;
		}
	});
	
	dispatch.hook('C_LOAD_TOPO_FIN', 1, (event) => {
		SpawnMarkers()
	});
	
	function SpawnMarkers(){
		if(inDung){
			for(let i in COORDS){
			SpawnThing(COORDS[i],MARKER);
			}
		}
	}
	
	function ClearSpawns(){
		if(markers){
			for(let i in markers){
				Despawn(markers[i]);
			}
			markers = [];
		}
	}
	
	function SpawnThing(position,item){
		dispatch.toClient('S_SPAWN_BUILD_OBJECT', 1, {
			uid : uid,
			itemId : item,
			x : position.x,
			y : position.y,
			z : position.z,
			w : Math.floor((Math.random() * -30000) + 1),
			unk : 0,
			ownerName : name,
			message : ''
		});
		markers.push(uid);
		uid--;
	}
	
	function Despawn(uid){
	dispatch.toClient('S_DESPAWN_BUILD_OBJECT', 1, {
			uid : uid,
			unk : 0
		});
	}

}
