import { useEffect } from 'react';
import './App.css';
import useTitle from './hook/useTitle';
import axios from 'axios';
import {useState} from 'react';
import { dateFormat } from './util/date-util';
import { HiuCountryLib } from './HiuCountryLib';
import uuidv4 from './util/uuid';
const {ipcRenderer} = window.require("electron");
const fs = window.require("fs/promises");

interface Info {
    ipVersion     : number,
    ipAddress     : string,
    latitude      : number,
    longitude     : number,
    countryName   : string,
    countryCode   : string,
    timeZone      : string,
    zipCode       : string,
    cityName      : string,
    regionName    : string,
    continent     : string,
    continentCode : string
}

function App() {
    useTitle("히유 IP 모니터링");

    const [data, setData]               = useState<Info>();
    const [reloadDate,setReloadDate]    = useState<string>();
    const [invalidIP, setInvalidIP]     = useState<boolean>();
    const [alreadyNoti, setAlreadyNoti] = useState<boolean>();
    const [ip, setIP]                   = useState<string>();
    const [setting,setSettings]         = useState<boolean>();
    const [warnEnable,setWarnEnable]    = useState<boolean>(false);
    const [warnCountry,setWarnCountry]  = useState<string>("KR");
    const [warnCountryName, setWarnCountryName] = useState<string>();
    const [settingsSaved,setSettingsSaved]      = useState<boolean>();

    useEffect(() => {
        setWarnCountryName( HiuCountryLib.codeToName(warnCountry) ?? "KR" );
    },[warnCountry]);

    // 설정이 변경됨
    //  - 설정 저장 상태 false로 만들기
    useEffect(() => {
        setSettingsSaved(false);
    },[warnEnable, warnCountry])

    ipcRenderer.on('load-settings', (e: any, ...args: any) => {
        const _we = args[0]["warnEnable"];
        const _wc = args[0]["warnCountry"];

        setWarnEnable(_we);
        setWarnCountry(_wc);

        console.log(`_we = ${_we}, _wc = ${_wc}`);
    })

    async function updateDate() {
        try {
            
            let url = `https://freeipapi.com/api/json`;

            if(ip) {
                url += `/${ip}`; 
            }

            const {data} = await axios.get(url);

            //console.log(data);

            setReloadDate(dateFormat(new Date()))
            setData(data);

            // 데이터가 제대로 왔는 지 여부 갱신
            const isInvalid = data.ipVersion.length === 0;

            setInvalidIP(isInvalid);

        } catch (e: any) {

            // 1분 최대 요청 횟수(60회)를 초과함. 새로고침하기

            if(e.response.status === 429) {
                console.log("최대 요청 횟수 도달")
            } else {
                console.log(e);
            }
        }
    }

    useEffect(() => {
        if(warnEnable) {

            if(data?.countryCode === warnCountry && !alreadyNoti) {
            
                ipcRenderer.send("set-warn", {
                    content: `${warnCountryName} IP 노출 중!`,
                    subContent: `VPN 연결이 끊겼거나 ${warnCountryName} 아이피가 노출되고 있어요.`
                });

                ipcRenderer.send(
                    "noti",
                    {
                        title: `${warnCountryName} IP가 노출 중!`,
                        body: `VPN 연결이 끊겼거나 ${warnCountryName} 아이피가 유출되고 있어요.`
                    }
                )

                setAlreadyNoti(true);

            } else {

                if(data?.countryCode !== warnCountry) {
                    ipcRenderer.send("set-warn", undefined);
                    setAlreadyNoti(false);
                }
            }

        } else {
            setAlreadyNoti(false);
            ipcRenderer.send('set-warn', undefined)
        }
        
    },[data]);

    useEffect(() => {
        setData(undefined);

        const interval = setInterval(updateDate, 1100);

        return () => {
            clearInterval(interval);
        }
    },[ip]);

    
    function saveSettings() {
        if(!settingsSaved) {
            ipcRenderer.send('update-settings', 
                {
                    'warnEnable' : warnEnable,
                    'warnCountry': warnCountry,
                }
            )

            setSettingsSaved(true);
            ipcRenderer.send('save-settings');
        }
    }

    function onWarnCountryChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const optionEl = e.target.children[e.target.selectedIndex];

        if(optionEl) {
            const code = optionEl.getAttribute("data-code") as string;
            setWarnCountry(code);
        }
    }

    function resetSettings() {
        setWarnCountry('KR');
        setWarnEnable(true);
    }

    if(setting) {
        return <div className="App">
            <h3>히유 IP 모니터링</h3>

            <div className='setting-field'>
                <table>
                    <tbody>
                        <tr>
                            <th>경고</th>
                            <td>
                                <select 
                                    onChange={e => setWarnEnable(e.target.value === "켜기") }
                                    value={warnEnable ? "켜기" : "끄기"}
                                >
                                    <option>켜기</option>
                                    <option>끄기</option>
                                </select>
                            </td>
                        </tr>

                        <tr>
                            <th>경고국가</th>
                            <td>
                                <select 
                                    value={HiuCountryLib.codeToName(warnCountry ?? "KR")} 
                                    onChange={onWarnCountryChange}
                                >
                                    {
                                        Object.keys(HiuCountryLib.getAll()).map(code => {
                                            return (
                                                <option key={uuidv4()} data-code={code}>
                                                    {HiuCountryLib.codeToName(code)}
                                                </option>
                                            );
                                        })
                                    }
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
                                
                <div className="button-field">
                    <button onClick={() => saveSettings()} className={settingsSaved ? "disabled" : undefined} id="setting-save-btn">저장</button>
                    <button onClick={() => resetSettings()}>기본값</button>
                </div>
                <button onClick={() => setSettings(false)} id="setting-close-btn">닫기</button>
            </div>
        </div>
    }

    return (
        <div className="App">

            <h3>히유 IP 모니터링</h3>

            <div id="setting-btn">
                <button onClick={() => setSettings(true)}>
                    <img src="img/settings.png" />
                </button>
            </div>

            <div>
                <input 
                    type="text" 
                    placeholder='IP 주소'
                    value={ip ?? ""}
                    defaultValue={ip}
                    onChange={e => setIP(e.target.value)}
                />
            </div>

            {
                invalidIP &&
                <div className="loading">
                    올바르지 않은 아이피
                </div>
            }

            {
                !invalidIP &&
                <>
                    {
                        data?.ipAddress === undefined &&
                        <div className="loading">
                            불러오는 중..
                        </div>
                    }

                    {
                        data &&
                        <table>
                            <tbody>
                                <tr>
                                    <th>아이피</th>
                                    <td>{data.ipAddress}</td>
                                </tr>
                                
                                <tr>
                                    <th>아이피 버전</th>
                                    <td>{data.ipVersion}</td>
                                </tr>

                                <tr>
                                    <th>국가</th>
                                    <td>{data.countryName}</td>
                                </tr>

                                <tr>
                                    <th>국가코드</th>
                                    <td>{data.countryCode}</td>
                                </tr>

                                <tr>
                                    <th>지역이름</th>
                                    <td>{data.regionName}</td>
                                </tr>

                                <tr>
                                    <th>위도</th>
                                    <td>{data.latitude}</td>
                                </tr>

                                <tr>
                                    <th>경도</th>
                                    <td>{data.longitude}</td>
                                </tr>

                                <tr>
                                    <th>마지막 갱신일</th>
                                    <td>{reloadDate}</td>
                                </tr>
                            </tbody>
                            
                        </table>
                    }
                </>
            }
            
        </div>
    );
}

export default App;
