const fs = require("fs");
const path = require("path");

function link(targetFromRoot, linkFromRoot) {
    const root = process.cwd();

    const linkAbs = path.join(root, linkFromRoot);
    const targetAbs = path.join(root, targetFromRoot);

    const linkDir = path.dirname(linkAbs);
    const relativeTarget = path.relative(linkDir, targetAbs);

    fs.mkdirSync(linkDir, { recursive: true });

    try {
        fs.unlinkSync(linkAbs);
    } catch {}

    fs.symlinkSync(relativeTarget, linkAbs, process.platform === "win32" ? "file" : undefined);

    console.log(`${linkFromRoot} → ${relativeTarget}`);
}

// EXACT equivalents of your ln -s commands
link("src/data/resource.nb.json", "public/docs/data/resource.nb.json");

link("src/data/resource.nb.json", "public/data/resource.nb.json");
