"use strict";

const Window = require("./Window");
const { app } = require("electron");

const main = async () => {
	const padding = 16;
	const main = new Window({
			width: 1280,
			height: 720
		});
	const tools = new Window({
			parent: main,
			width: 100,
			height: 300,
			left: padding,
			top: padding
		});
	const history = new Window({
			parent: main,
			width: 100,
			height: 300,
			right: padding,
			top: padding
		});
	const layers = new Window({
			parent: main,
			width: 100,
			height: 300,
			right: padding,
			bottom: padding
		});
	const colors = new Window({
			parent: main,
			width: 100,
			height: 300,
			left: padding,
			bottom: padding
		});

	const windows = [
		main,
		tools,
		history,
		layers,
		colors
	];

	main.once("close", app.quit);
	for (const window of windows)
		await window.load();
};

const handleError = error => {
	console.error("\u001b[31;1m"
		+ error.stack
			.split(/\n\s*/)
			.slice(0, -3)
			.join("\n  ")
			.replace(/\bat\b/g, "\u001b[30;1mat\u001b[0m")
		+ "\n");
	process.exit(1);
};

process
	.on("uncaughtException", handleError)
	.on("unhandledRejection", handleError);

app.on("ready", main);