export default function useTitle(title: string) {
    document.querySelector("title")!.text = title;
}