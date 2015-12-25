import * as hud from './mud-hud';

export default function murder(socket) {
	hud.appendToBotPane("Murdering...");
	socket.write('kill worker\r');
};