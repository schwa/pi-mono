/**
 * Tests for TUI window focus change handling.
 *
 * Verifies that focus events from the terminal are forwarded to the
 * handler registered via TUI.setFocusChangeHandler().
 */

import assert from "node:assert";
import { describe, it } from "node:test";
import { TUI } from "../src/tui.js";
import { VirtualTerminal } from "./virtual-terminal.js";

describe("TUI focus change handling", () => {
	it("forwards focus events from the terminal to the registered handler", () => {
		const terminal = new VirtualTerminal();
		const tui = new TUI(terminal);

		const events: boolean[] = [];
		tui.setFocusChangeHandler((focused) => events.push(focused));

		tui.start();

		terminal.simulateFocusChange(true);
		terminal.simulateFocusChange(false);
		terminal.simulateFocusChange(true);

		assert.deepStrictEqual(events, [true, false, true]);

		tui.stop();
	});

	it("does not throw when no handler is registered", () => {
		const terminal = new VirtualTerminal();
		const tui = new TUI(terminal);

		tui.start();

		assert.doesNotThrow(() => {
			terminal.simulateFocusChange(true);
			terminal.simulateFocusChange(false);
		});

		tui.stop();
	});

	it("allows the focus handler to be replaced after start", () => {
		const terminal = new VirtualTerminal();
		const tui = new TUI(terminal);

		const firstEvents: boolean[] = [];
		const secondEvents: boolean[] = [];

		tui.setFocusChangeHandler((focused) => firstEvents.push(focused));
		tui.start();

		terminal.simulateFocusChange(true);

		tui.setFocusChangeHandler((focused) => secondEvents.push(focused));
		terminal.simulateFocusChange(false);

		assert.deepStrictEqual(firstEvents, [true]);
		assert.deepStrictEqual(secondEvents, [false]);

		tui.stop();
	});

	it("clears the handler when set to undefined", () => {
		const terminal = new VirtualTerminal();
		const tui = new TUI(terminal);

		const events: boolean[] = [];
		tui.setFocusChangeHandler((focused) => events.push(focused));
		tui.start();

		terminal.simulateFocusChange(true);
		tui.setFocusChangeHandler(undefined);
		terminal.simulateFocusChange(false);

		assert.deepStrictEqual(events, [true]);

		tui.stop();
	});
});
