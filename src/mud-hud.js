import blessed from 'blessed';

export let telnetRawOutputPane = null;
export let botOutputPane = null;

export function init() {
	let screen = blessed.screen({
		smartCSR: true,
		useBCE  : true
	});

	telnetRawOutputPane = createTelnetPane();
	botOutputPane = createBotPane();

	screen.title = `Welcome to Mud Bot`;
	screen.key(['escape', 'C-c'], function(ch, key) {
		return process.exit(0);
	});

	screen.append(telnetRawOutputPane);
	screen.append(botOutputPane);

	process.stdin.setEncoding('utf8');
	process.stdin.on('data', appendToTelnetPane);

	setInterval(() => {
		screen.render();
	}, 100);
}

export function appendToTelnetPane(msg) {
	telnetRawOutputPane.content += msg;
	if( telnetRawOutputPane.getLines() > 8 ) {
		console.log("deleting one");
		telnetRawOutputPane.deleteLine(0);
	}
	telnetRawOutputPane.scrollTo(telnetRawOutputPane.getScrollHeight());
}

export function appendToBotPane(msg) {
	botOutputPane.pushLine(msg);
	botOutputPane.scrollTo(botOutputPane.getScrollHeight());
}

function createBotPane() {
	return blessed.box({
		scrollable  : true,
		alwaysScroll: true,
		top         : '0',
		left        : '50%',
		width       : '50%',
		height      : '100%',
		tags        : true,
		border      : {
			type: 'bg'
		},
		style       : {
			fg    : 'white',
			bg    : 'red',
			border: {
				fg: '#f0f0f0'
			}
		}
	});
}

function createTelnetPane() {
	return blessed.box({
		scrollable  : true,
		alwaysScroll: true,
		top         : '0',
		left        : '0',
		width       : '50%',
		height      : '100%',
		tags        : true,
		border      : {
			type: 'bg'
		},
		style       : {
			fg    : 'white',
			bg    : 'blue',
			border: {
				fg: '#f0f0f0'
			}
		}
	});
}