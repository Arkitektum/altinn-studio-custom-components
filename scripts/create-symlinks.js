const fs = require("fs");
const path = require("path");

const root = process.cwd();
const isWindows = process.platform === "win32";

function ensureFile(targetFromRoot, linkFromRoot) {
    const targetAbs = path.join(root, targetFromRoot);
    const linkAbs = path.join(root, linkFromRoot);
    const linkDir = path.dirname(linkAbs);

    fs.mkdirSync(linkDir, { recursive: true });

    // Already exists → do nothing
    if (fs.existsSync(linkAbs)) {
        try {
            const actual = fs.readlinkSync(linkAbs);
            const resolvedActual = path.resolve(linkDir, actual);
            if (resolvedActual === targetAbs) {
                console.log(`✓ Symlink OK: ${linkFromRoot}`);
                return;
            }
        } catch {
            console.log(`✓ File exists: ${linkFromRoot}`);
            return;
        }
    }

    const relativeTarget = path.relative(linkDir, targetAbs);

    // Try symlink first
    try {
        fs.symlinkSync(relativeTarget, linkAbs, isWindows ? "file" : undefined);
        console.log(`＋ Symlink created: ${linkFromRoot}`);
        return;
    } catch (err) {
        if (!isWindows) throw err;
    }

    // Windows fallback: copy file
    fs.copyFileSync(targetAbs, linkAbs);
    console.log(`⧉ File copied (Windows fallback): ${linkFromRoot}`);
}

// Files
ensureFile("src/data/resource.nb.json", "public/docs/data/resource.nb.json");

ensureFile("src/data/resource.nb.json", "public/data/resource.nb.json");
