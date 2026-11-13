// Components import their stylesheets for the side effect only (`import "./styles.css" with { type: "css" }`), which webpack bundles. Under jest they are this empty module instead, so tests can register the real components.
module.exports = {};
