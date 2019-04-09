export enum y43roundEnum
{
    none,
    round,
    ceil,
    floor,
}

export class y43utils
{
    static round(n:number, roundType = y43roundEnum.round)
    {
        switch(roundType)
        {
            case y43roundEnum.none:
                return n;
            case y43roundEnum.round:
                return Math.round(n);
            case y43roundEnum.ceil:
                return Math.ceil(n);
            case y43roundEnum.floor:
                return Math.floor(n);
        }
    }

    static nowNumber(dev:number = 1, round:y43roundEnum = y43roundEnum.none ):number
    {
        let now:number = ((new Date()).getTime()) / dev;
        return this.round(now, round);
    }
    
    static nowStr(dev:number = 1, round:y43roundEnum = y43roundEnum.none ):string
    {
        return this.nowNumber(dev, round).toString();
    }

    static random(min:number,max:number):number
    {
        let diff = Math.abs(max - min);
        return Math.random() * diff + Math.min(max,min);
    }

    static randomInt(min:number, max:number, roundType:y43roundEnum = y43roundEnum.floor): number
    {
        return this.round(this.random(min, max), roundType);
    }

    static lastItem<T>(arr:Array<T>):T|null
    {
        return arr.length == 0 ? null : arr[arr.length - 1];
    }
}

export interface y43utilsDict<valueType> {
    [key: string]: valueType;
 } 