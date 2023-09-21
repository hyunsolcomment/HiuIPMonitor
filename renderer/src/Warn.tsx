import './Warn.css';
import { useState } from "react";
const {ipcRenderer} = window.require("electron");

interface IMessage{
    content: string,
    subContent?: string
}
export default function Warn() {
    const [message,setMessage] = useState<IMessage | undefined>();

    ipcRenderer.on('set-warn', (event: any, data: any) => {
        setMessage(data);
    });

    if(!message) { 
        return null;
    }

    return (
        <div className="warn">
            <div className="text-field">
                <div className="content">{message.content}</div>
                {
                    message.subContent &&
                    <div className="sub-content">{message.subContent}</div>
                }
            </div> 
        </div>
    )
}