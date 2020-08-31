/**
 * Build styles
 */
import './index.css';
import { InlineTool, API } from 'quantifai-editorjs';
/**
 * Inline Code Tool for the Editor.js
 *
 * Allows to wrap inline fragment and style it somehow.
 */
export default class InlineCode implements InlineTool {
    /**
     * Class name for term-tag
     *
     * @type {string}
     */
    static get CSS(): string;
    private api;
    private button;
    private tag;
    private iconClasses;
    constructor({ api }: {
        api: API;
    });
    /**
     * Specifies Tool as Inline Toolbar Tool
     *
     * @return {boolean}
     */
    static get isInline(): boolean;
    /**
     * Create button element for Toolbar
     *
     * @return {HTMLElement}
     */
    render(): HTMLButtonElement;
    /**
     * Wrap/Unwrap selected fragment
     *
     * @param {Range} range - selected fragment
     */
    surround(range: Range): void;
    /**
     * Wrap selection with term-tag
     *
     * @param {Range} range - selected fragment
     */
    wrap(range: Range): void;
    /**
     * Unwrap term-tag
     *
     * @param {HTMLElement} termWrapper - term wrapper tag
     */
    unwrap(termWrapper: HTMLElement): void;
    /**
     * Check and change Term's state for current selection
     */
    checkState(selection?: Selection): boolean;
    /**
     * Get Tool icon's SVG
     * @return {string}
     */
    get toolboxIcon(): any;
    /**
     * Sanitizer rule
     * @return {{span: {class: string}}}
     */
    static get sanitize(): {
        code: {
            class: string;
        };
    };
}
