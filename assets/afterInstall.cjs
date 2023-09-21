const { readdir, unlink, rm, access } = require("fs/promises");

exports.default = async (context) => {
    console.log("\n후처리 진행")

    console.log("locale에서 ko.pak만 남기고 모두 삭제")

    const root = context.appOutDir;

    let localeDir = root + '/locales/';

    try {
        const files = await readdir(localeDir);

        if (!files || !files.length) {
            return;
        }

        for (let i = 0, len = files.length; i < len; i++) {
            const match = files[i].match(/ko\.pak/);

            if (match === null) {
                await unlink(localeDir + files[i]);
            }
        }
    } catch (err) {
        console.log(err);
        return;
    }

    const delFiles = [
        "d3dcompiler_47.dll",
        "libEGL.dll",
        "libGLESv2.dll",
        "vk_swiftshader.dll",
        "vk_swiftshader.dll",
        "LICENSES.chromium.html",
        "LICENSE.electron.txt",
        "vulkan-1.dll"
    ]

    for(let file of delFiles) {
        try {
            console.log(`${file} 삭제`);
            await access(`${root}/${file}`);
            await rm(`${root}/${file}`);
        } catch { }
    }
};