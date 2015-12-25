import blessed from 'blessed';

let screen = blessed.screen({
	smartCSR: true,
	useBCE  : true
});

export let telnetRawOutputPane = createTelnetPane();
export let botOutputPane = createBotPane();

export function init() {
	screen.title = `Welcome to Mud Bot`;
	screen.key(['escape', 'C-c'], function(ch, key) {
		return process.exit(0);
	});

	screen.append(telnetRawOutputPane);
	screen.append(botOutputPane);

	process.stdin.setEncoding('utf8');
	process.stdin.on('data', appendToTelnetPane);

	let i = 0;
	setInterval(() => {
		appendToTelnetPane("New Line incoming! " + ++i);
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
			},
			hover : {
				bg: 'green'
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
			},
			hover : {
				bg: 'green'
			}
		}
	});
}