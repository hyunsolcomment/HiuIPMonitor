import {exec} from 'child_process';
import { copy, getFileExtension } from './util/FileUtil.js';
import path from 'path';
import fs, { access, rm } from 'fs/promises';

console.clear();

console.log(`
    %c※ ─────── HIU BUILDER (TS + React + Electron) ─────── ※
`, 'color: #4ec81b; font-weight: bold');

// 1. 일렉트론 컴파일하기

console.log("일렉트론 컴파일")
exec("cd electron && npx tsc", (err) => {
    if(err) {
        console.log(err);
        return;
    }

    // 빌드 전 최적화
    console.log("최적화");
    
    exec("npm run clean", async (err, stdout, stderr) => {
        if(err) {
            console.log(err);
            return
        }

        // 일렉트론 public에 있는 기존 assets 제거
        const assetsPath = `./electron/public/assets`;

        try {
            console.log("기존 assets 폴더 삭제")

            try {
                await fs.access(assetsPath)
                await fs.rm(assetsPath, { recursive: true })

            } catch { }
            
            console.log("assets 생성")
            await fs.mkdir(assetsPath);

            console.log("assets 폴더 내용물 복사")
            await copy("./assets", assetsPath);

        } catch(e) { console.log(e); return; }

        // 2. 리엑트 빌드하기
        console.log("리엑트 빌드")
        exec("cd renderer && npm run build", async (err, stdout, stderr) => {

            if(err) {
                console.log(err);
                return;
            }

            if(stdout) {
                console.log(stdout);
            }

            if(stderr) {
                console.log(stderr);
            }

            console.log("빌드된 리엑트를 일렉트론으로 복사")

            // 3. 빌드된 리엑트 파일들을 일렉트론 public에 복사하기
            if(!await copy(
                path.join("./renderer", "build"),
                path.join("./electron", "public")
            )) {
                return;
            }

            // 일렉트론 빌드 전에 dist 폴더 삭제하기
            console.log("dist 폴더 삭제")

            try {
                await access("dist")
                await rm("dist", { recursive: true });
            } catch { }

            setTimeout(() => {
                // 4. 일렉트론 빌드
                console.log("일렉트론 빌드")
                        
                exec("cd electron && npm run electron:build", (err, stdout, stderr) => {
                    if(err) {
                        console.log(err);
                        return;
                    }

                    if(stdout) {
                        console.log(stdout);
                    }

                    if(stderr) {
                        console.log(stderr);
                    }

                    // 5. 끝
                    console.log("빌드 끗");
                })
            },100);
        })
    })
})