import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface IBaseProduct {
    name: string,
    price: number,
    stock: number
}

export interface IProduct extends IBaseProduct{
    variations: IBaseProduct[]
}