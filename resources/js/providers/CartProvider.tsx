import { createContext, useReducer, useContext, ReactNode } from 'react';

export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    variation: {
        id: number;
        name: string;
    }
}

interface CartState {
    items: CartItem[];
}

interface CartAction {
    type: "ADD_ITEM" | "REMOVE_ITEM" | "UPDATE_QUANTITY";
    payload: CartItem;
}

const CartContext = createContext<CartState | any>(null);

function cartReducer(state: CartState, action: CartAction) : CartState {
    switch(action.type) {
        case "ADD_ITEM":
            return {
                ...state,
                items: state.items.some(item => item.id === action.payload.id)
                    ? state.items.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                    : [...state.items, { ...action.payload, quantity: 1 }]
            };
        case "REMOVE_ITEM":
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload.id)
            }
        case "UPDATE_QUANTITY":
            return {
                ...state,
                items: state.items.map(item => item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item)
            }
        default:
            return state;
    }
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, { items: [] });

    return (
        <CartContext.Provider value={{ cart: state, dispatch }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext);
}