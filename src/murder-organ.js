export default function murder(socket) {
	console.log("Murdering...");
	socket.write('kill worker\r');
};