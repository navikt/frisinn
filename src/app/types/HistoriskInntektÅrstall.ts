export type HistoriskInntektÅrstall = 2019 | 2020;

export const isHistoriskInntektÅrstall = (årstall: any): årstall is HistoriskInntektÅrstall =>
    årstall === 2019 || årstall === 2020;
