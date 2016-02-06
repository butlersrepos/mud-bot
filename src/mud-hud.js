import blessed from 'blessed';

export let telnetRawOutputPanel = null;
export let botOutputPanel = null;

export function init() {
	let screen = blessed.screen({
		smartCSR: true,
		useBCE  : true
	});

	telnetRawOutputPanel = createTelnetPanel();
	botOutputPanel = createBotPanel();
	let botStatePanel = createBotStatePanel();

	screen.title = `Welcome to Mud Bot`;
	screen.key(['escape', 'C-c'], function (ch, key) {
		return process.exit(0);
	});

	screen.append(telnetRawOutputPanel);
	screen.append(botOutputPanel);
	screen.append(botStatePanel);

	process.stdin.setEncoding('utf8');
	process.stdin.on('data', appendToTelnetPanel);

	setInterval(() => {
		screen.render();
	}, 100);
}

export function appendToTelnetPanel(msg) {
	telnetRawOutputPanel.content += msg;
	if (telnetRawOutputPanel.getLines() > 8) {
		console.log("deleting one");
		telnetRawOutputPanel.deleteLine(0);
	}
	telnetRawOutputPanel.scrollTo(telnetRawOutputPanel.getScrollHeight());
}

export function appendToBotPanel(msg) {
	botOutputPanel.pushLine(msg);
	botOutputPanel.scrollTo(botOutputPanel.getScrollHeight());
}

function createBotStatePanel() {
	return blessed.box({
		top   : '50%',
		left  : '50%',
		width : '50%',
		height: '50%',
		style : {
			fg    : 'white',
			bg    : 'green',
			border: {
				fg: '#f0f0f0'
			}
		}
	});
}

function createBotPanel() {
	return blessed.box({
		scrollable  : true,
		alwaysScroll: true,
		top         : '0',
		left        : '50%',
		width       : '50%',
		height      : '50%',
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

function createTelnetPanel() {
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
