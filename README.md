# electron-react-typescript-quickstart
 Typescript + Electron + React 환경 빠르게 세팅하기

<h2>라이브러리</h2>
<ul>
 <li><b>concurrently: </b>여러 명령어를 동시에 실행합니다. (리엑트을 시작함과 동시에 리엑트가 켜질 때 까지 대기 후, Electron을 시작하는 명령어를 구동하는 wait-on 명령어를 실행)</li>
 <li><b>cross-env:</b> 구동 환경에 맞게 환경변수를 설정합니다. (BROWSER을 NONE으로 설정함으로써, 리엑트가 켜질 때 브라우저에 자동으로 localhost:3000가 열리도록 하는 것을 막음)</li>
 <li><b>Electron</b></li>
 <li><b>nodemon:</b> electron 폴더 내의 ts 파일에 변경사항이 저장되면, 자동으로 Electron을 재시작합니다.</li>
 <li><b>wait-on: </b>리엑트가 시작할 때 까지 대기합니다. (localhost:3000이 시작된 후 npm run electron:dev 명령어를 구동하여 Electron을 시작)</li>
</ul>

<h2>설치</h2>
<ol>
 <li>
  프로젝트 설치
  <pre>git clone https://github.com/hyunsolcomment/typescript-react-electron</pre>
 </li>

 <li>
  프로젝트 전체 패키지 설치
  <pre>npm run project-install</pre>
 </li>
</ol>

<h2>빌드</h2>
프로젝트 폴더에서 아래의 명령을 입력하여 Electron을 빌드할 수 있습니다.
<pre>
  npm run build
</pre>

빌드 시, 삭제되는 파일(dll 파일 및 .pak 파일)이 삭제 여부를 assets/afterInstall.cjs 에서 설정할 수 있습니다.
