import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface IProduct {
    id?: string | number;
    name: string,
    price: string | number,
    stock: string | number,
    variations: IVariation[]
}

export interface IVariation extends IBaseProduct{
    local_id: string | number
}