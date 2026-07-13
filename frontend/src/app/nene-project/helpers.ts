
export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function getPetIdLocalStorage(key: string): Promise<number>{
   return JSON.parse(localStorage.getItem(`${key}`) ?? 'null');
}

export function setPetIdLocalStorage(key:string, value: object | string | number): void{
    return localStorage.setItem(`${key}`, JSON.stringify(value));
}

export function clearPetIdLocalStorage(key:string){
    return localStorage.removeItem(key);
}

export interface MessageSegment {
    text: string;
    isLink: boolean;
}

/* const URL_REGEX = /(https?:\/\/[^\s]+)/g;

export function linkifyMessage(message: string): MessageSegment[] {
    const segments: MessageSegment[] = [];
    let lastIndex = 0;

    for (const match of message.matchAll(URL_REGEX)) {
        const url = match[0];
        const start = match.index ?? 0;

        if (start > lastIndex) {
            segments.push({ text: message.slice(lastIndex, start), isLink: false });
        }
        segments.push({ text: url, isLink: true });
        lastIndex = start + url.length;
    }

    if (lastIndex < message.length) {
        segments.push({ text: message.slice(lastIndex), isLink: false });
    }

    return segments;
} */

const URL_REGEX = /(https?:\/\/[^\s]+)/g

export function linkifyMessage(message:string): MessageSegment[]{
    const segments: MessageSegment[] = [];
    let lastIndex = 0;

    for(const match of message.matchAll(URL_REGEX)){
        const url = match[0];
        const start = match.index ?? 0; // .index = start position of found match

        if(start > lastIndex){
            segments.push({text: message.slice(lastIndex, start), isLink: false})
        }
        segments.push({text: url, isLink: true});
        lastIndex = start + url.length;

    }

    if(lastIndex < message.length){
        segments.push({text: message.slice(lastIndex), isLink:false });
    }

    return segments;
}