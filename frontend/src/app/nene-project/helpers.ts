
export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function getPetIdLocalStorage(key: string): Promise<number>{
   return JSON.parse(localStorage.getItem(`${key}`) ?? 'null');
}

export function setPetIdLocalStorage(key:string, value: object | string | number): void{
    return localStorage.setItem(`${key}`, JSON.stringify(value));
}

