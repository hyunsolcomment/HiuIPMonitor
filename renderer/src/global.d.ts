interface Window {
    electron: {
        noti(title: string, body: string): void,
        setIgnoreMouseEvent(value: boolean): void,
        sendToMain(channel: string, data: any): void,
    }
}