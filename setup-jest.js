import { TextDecoder, TextEncoder } from "util";

Object.assign(global, { TextDecoder, TextEncoder });

// jsdom lays nothing out, and has no way to measure a range of text. CodeMirror, the dev tools' JSON editor, measures text as it draws, so ranges get empty measurements here.
if (typeof Range !== "undefined" && !Range.prototype.getClientRects) {
    Range.prototype.getClientRects = function () {
        const rects = [];
        rects.item = () => null;
        return rects;
    };
    Range.prototype.getBoundingClientRect = function () {
        return { x: 0, y: 0, top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0, toJSON() {} };
    };
}
