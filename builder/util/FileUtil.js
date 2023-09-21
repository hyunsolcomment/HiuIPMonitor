import fs from 'fs/promises';
import path from 'path';

/**
 * 파일의 확장자를 반환합니다.
 */
export function getFileExtension(filePath) {
  const lastIndex = filePath.lastIndexOf('.');
  if (lastIndex === -1) {
    return ''; // 확장자가 없는 경우 빈 문자열 반환
  }
  return filePath.slice(lastIndex + 1);
}

/**
 * 특정 경로에 있는 모든 파일 및 폴더들을 다른 경로에 복사합니다.
 */
export async function copy(sourcePath, destinationPath) {
  try {
    const entries = await fs.readdir(sourcePath, { withFileTypes: true });
    
    await Promise.all(entries.map(async entry => {
      const sourceEntryPath = path.join(sourcePath, entry.name);
      const destinationEntryPath = path.join(destinationPath, entry.name);
      
      if (entry.isDirectory()) {
        await fs.mkdir(destinationEntryPath, { recursive: true });
        await copy(sourceEntryPath, destinationEntryPath);
      } else {
        await fs.copyFile(sourceEntryPath, destinationEntryPath);
      }
    }));

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}