"use strict";

const Tuple = require("./Tuple");
const { BrowserWindow } = require("electron");
const URL = require("url");

module.exports = class Window {
	static Size (values) {
		return new Tuple(values, values => ({ width: values[0], height: values[1] }));
	}

	static Position (values) {
		return new Tuple(values, values => ({ x: values[0], y: values[1] }));
	}

	// UGLY Extract all these one-off transformations to proper functions/methods
	constructor (options) {
		const compositeOptions = Object.assign({
			show: false,
			showOnLoad: true,
			url: "file:///./index.html"
		}, options);

		this.__browserWindow = new BrowserWindow(compositeOptions);
		this.__url = compositeOptions.url;

		if (compositeOptions.showOnLoad)
			this.__browserWindow.once("ready-to-show", () => this.__browserWindow.show());

		if (compositeOptions.parent) {
			this.align(compositeOptions.parent, compositeOptions);
			compositeOptions.parent
				.on("resize", () => this.align(compositeOptions.parent, compositeOptions));
				// TODO: find a way to keep child windows on top
		}
	}

	get url () {
		return this.__url;
	}

	set url (url) {
		this.__url = url;
		this.load();
		return url;
	}

	async load (url = this.url, options) {
		if (!URL.parse(url).protocol)
			throw new Error(`"${url}" has no protocol.`);
		await this.__browserWindow.loadURL(url, options);
		return this;
	}

	size (w, h) {
		if (w === undefined)
			return Window.Size(this.__browserWindow.getSize());
		this.__browserWindow.setSize(w, h || this.__browserWindow.getSize()[1]);
		return this;
	}

	position (x, y) {
		if (x === undefined)
			return Window.Position(this.__browserWindow.getPosition());
		this.__browserWindow.setPosition(x, y || this.__browserWindow.getPosition()[1]);
		return this;
	}

	align (target, offsets) {
		if (target === undefined)
			throw new Error("Cannot align to nothing.");

		if (!target.position || !target.size)
			return this;

		if (offsets === undefined)
			return this.position(...target.position());
		
		if (typeof offsets === "number")
			offsets = {
				top: offsets,
				right: offsets,
				bottom: offsets,
				left: offsets
			};

		const targetPos = target.position();
		const targetSize = target.size();
		let [x, y] = this.position();
		let [w, h] = this.size();

		if (offsets.top !== undefined)
			y = targetPos.y + offsets.top;

		if (offsets.left !== undefined)
			x = targetPos.x + offsets.left;

		if (offsets.right !== undefined) {
			if (offsets.left !== undefined) {
				w = targetSize.width - (offsets.left + offsets.right);
			} else {
				x = targetPos.x + targetSize.width - w - offsets.right;
			}
		}

		if (offsets.bottom !== undefined) {
			if (offsets.top !== undefined) {
				h -= targetSize.height - (offsets.top + offsets.bottom);
			} else {
				y = targetPos.y + targetSize.height - h - offsets.bottom;
			}
		}

		this.position(x, y);
		this.size(w, h);
	}

	on (event, handler) {
		this.__browserWindow.on(event, handler);
		return this;
	}

	once (event, handler) {
		this.__browserWindow.once(event, handler);
		return this;
	}

	hide () {
		this.__browserWindow.hide();
		return this;
	}

	show () {
		this.__browserWindow.show();
		return this;
	}

	focus () {
		this.__browserWindow.focus();
	}

	blur () {
		this.__browserWindow.blur();
	}
}