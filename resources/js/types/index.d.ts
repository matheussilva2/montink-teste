import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface IProduct {
    id?: string | number;
    name: string;
    price: string | number;
    stock: string | number;
    variations: IVariation[];
    created_at?: string;
    updated_at?: string;
}

export interface IVariation extends IProduct{
    local_id?: string | number;
    id?: string | number;
}

export interface ICoupon {
    id?: string | number;
    code: string;
    discount: number;
    expires_at?: string;
    created_at?: string;
    updated_at?: string;
}