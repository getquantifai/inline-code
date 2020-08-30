/**
 * Build styles
 */
import './index.css';
import { InlineTool, API } from 'quantifai-editorjs';
import icon from '../assets/icon.svg';

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
  static get CSS() {
    return 'inline-code';
  }

  private api: API;
  private button: HTMLButtonElement | null;
  private tag: string;
  private iconClasses: { base: string; active: string };

  constructor({ api }: { api: API }) {
    this.api = api;

    /**
     * Toolbar Button
     *
     * @type {HTMLElement|null}
     */
    this.button = null;

    /**
     * Tag represented the term
     *
     * @type {string}
     */
    this.tag = 'CODE';

    /**
     * CSS classes
     */
    this.iconClasses = {
      base: this.api.styles.inlineToolButton,
      active: this.api.styles.inlineToolButtonActive,
    };
  }

  /**
   * Specifies Tool as Inline Toolbar Tool
   *
   * @return {boolean}
   */
  static get isInline() {
    return true;
  }

  /**
   * Create button element for Toolbar
   *
   * @return {HTMLElement}
   */
  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.classList.add(this.iconClasses.base);
    this.button.innerHTML = this.toolboxIcon;

    return this.button;
  }

  /**
   * Wrap/Unwrap selected fragment
   *
   * @param {Range} range - selected fragment
   */
  surround(range: Range) {
    if (!range) {
      return;
    }

    let termWrapper = this.api.selection.findParentTag(
      this.tag,
      InlineCode.CSS
    );

    /**
     * If start or end of selection is in the highlighted block
     */
    if (termWrapper) {
      this.unwrap(termWrapper);
    } else {
      this.wrap(range);
    }
  }

  /**
   * Wrap selection with term-tag
   *
   * @param {Range} range - selected fragment
   */
  wrap(range: Range) {
    /**
     * Create a wrapper for highlighting
     */
    let span = document.createElement(this.tag);

    span.classList.add(InlineCode.CSS);

    /**
     * SurroundContent throws an error if the Range splits a non-Text node with only one of its boundary points
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Range/surroundContents}
     *
     * // range.surroundContents(span);
     */
    const isSelectingText = range.startOffset - range.endOffset !== 0;

    if (isSelectingText) {
      span.appendChild(range.extractContents());
    } else {
      span.appendChild(
        document.createRange().createContextualFragment('&nbsp;')
      );
      range.insertNode(document.createTextNode('\u00A0'));
    }
    range.insertNode(span);

    /**
     * Expand (add) selection to highlighted block
     */
    this.api.selection.expandToTag(span);
  }

  /**
   * Unwrap term-tag
   *
   * @param {HTMLElement} termWrapper - term wrapper tag
   */
  unwrap(termWrapper: HTMLElement) {
    /**
     * Expand selection to all term-tag
     */
    this.api.selection.expandToTag(termWrapper);

    let sel = window.getSelection();
    if (sel) {
      let range = sel.getRangeAt(0);

      let unwrappedContent = range.extractContents();

      /**
       * Remove empty term-tag
       */
      termWrapper.parentNode?.removeChild(termWrapper);

      /**
       * Insert extracted content
       */
      range.insertNode(unwrappedContent);

      /**
       * Restore selection
       */
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  /**
   * Check and change Term's state for current selection
   */
  checkState(selection?: Selection): boolean {
    const termTag = this.api.selection.findParentTag(this.tag, InlineCode.CSS);
    this.button?.classList.toggle(this.iconClasses.active, !!termTag);
    return !!termTag;
  }

  /**
   * Get Tool icon's SVG
   * @return {string}
   */
  get toolboxIcon() {
    return icon;
  }

  /**
   * Sanitizer rule
   * @return {{span: {class: string}}}
   */
  static get sanitize() {
    return {
      code: {
        class: InlineCode.CSS,
      },
    };
  }
}
