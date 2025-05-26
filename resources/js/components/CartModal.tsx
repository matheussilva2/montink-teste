import { CartItem, useCart } from '@/providers/CartProvider';
import { api } from '@/services/api';
import { ICoupon } from '@/types';
import axios from 'axios';
import React, { forwardRef, useEffect, useState } from 'react'

type PaymentValuesType = {
    total: number;
    shipping: number;
    discount: number;
    coupon?: ICoupon;
    subtotal: number;
    email: string;
    shipping_data: {
        postal_code: string;
        address: string;
        city: string;
        state: string;
    }
}

type propsType = {
    fetchProducts: () => void
}

const CartModal = forwardRef<HTMLDivElement, propsType> (({fetchProducts}, ref) => {
    const [ coupons, setCoupons ] = useState<ICoupon[]>([]);
    const { cart, dispatch } = useCart();
    const [step, setStep] = useState<number>(1);

    const [paymentValues, setPaymentValues] = useState<PaymentValuesType>({
        subtotal: 0,
        total: 0,
        shipping: 0,
        discount: 0,
        coupon: undefined,
        email: '',
        shipping_data: {
            postal_code: '',
            address: '',
            city: '',
            state: ''
        }
    })

    useEffect(() => {
        fetchCoupons();
        calculateTotal();
    }, [cart]);

    useEffect(() => {
        calculateTotal();
    }, [paymentValues.coupon]);

    function fetchCoupons() {
        api.get('coupons')
        .then(response => {
            setCoupons(response.data.data);
        })
    }

    const changeItemAmount = (id:number, quantity: string) => {
        dispatch({
            type: "UPDATE_QUANTITY",
            payload: {
                id,
                quantity
            }
        });
    }

    const removeItem = (id: number | string) => {
        dispatch({
            type: "REMOVE_ITEM",
            payload: { id }
        });
    }

    function calculateTotal() {
        const data: PaymentValuesType = {
            total: 0,
            shipping: 0,
            discount: 0,
            coupon: undefined,
            subtotal: 0,
            email: paymentValues.email,
            shipping_data: {
                ...paymentValues.shipping_data
            }
        }

        cart.items.map((item: CartItem) => {
            data.subtotal += item.price * item.quantity;
        });

        data.coupon = paymentValues.coupon;

        data.discount = paymentValues.coupon ? (data.subtotal * paymentValues.coupon.discount / 100) : 0;
        if(data.subtotal >= 52 && data.subtotal < 166.59) {
            data.shipping = 15;
        } else if (data.subtotal > 200) {
            data.shipping = 0;
        } else {
            data.shipping = 20;
        }
        
        data.total = data.subtotal - data.discount + data.shipping;
        
        // Passar para duas casas decimais
        data.total = parseFloat(data.total.toFixed(2));
        data.subtotal = parseFloat(data.subtotal.toFixed(2));
        data.shipping = parseFloat(data.shipping.toFixed(2));
        data.discount = parseFloat(data.discount.toFixed(2));

        setPaymentValues(data);
    }

    function handleCouponChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const coupon = coupons.find(c => c.id === parseInt(e.currentTarget.value));
        if (coupon) {
            setPaymentValues({
                ...paymentValues,
                coupon: coupon
            });
        } else {
            setPaymentValues({
                ...paymentValues,
                coupon: undefined
            });
        }
    }

    function handlePostalCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
        const current_postal_code = e.currentTarget.value;

        setPaymentValues({
            ...paymentValues,
            shipping_data: {
                ...paymentValues.shipping_data,
                postal_code: current_postal_code,
            }
        });
        if (e.currentTarget.value.length < 8) return;

        axios.get(`https://viacep.com.br/ws/${e.currentTarget.value}/json/`)
        .then((response) => {
            const { logradouro, localidade, estado } = response.data;
            setPaymentValues({
                ...paymentValues,
                shipping_data: {
                    postal_code: current_postal_code,
                    address: logradouro,
                    city: localidade,
                    state: estado
                }
            });
        })
    }

    function PaymentData() {
        return (
            <>
                {
                    cart.items.length < 1? <p className="text-center">Carrinho vazio</p>:<></>
                }
                {
                    cart.items.map((item:CartItem) => (
                        <div key={item.id}>
                            <div key={item.id} className="d-flex justify-content-between">
                                <div className="d-flex align-items-center">
                                    <span className="fw-bold">{item.name}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center" style={{ gap: 10 }}>
                                    <input
                                        min="0"
                                        onInput={(e: React.FormEvent<HTMLInputElement>) => changeItemAmount(item.id, e.currentTarget.value)} 
                                        className="border-1 text-center" style={{ width: 40, borderRadius: 5 }} 
                                        type="number"
                                        placeholder="0"
                                        value={item.quantity} />
                                    <span className="fw-bold">R$ {item.price}</span>
                                    <button className="btn text-danger" onClick={() => removeItem(item.id)}>&times;</button>
                                </div>
                            </div>
                            <hr />        
                        </div>
                    ))
                }
                <div className="d-flex justify-content-between align-items-center">
                    <span>Cupom: </span>
                    <select className="form-select" value={paymentValues.coupon?.id} onChange={handleCouponChange}>
                        <option value="none">Selecione um cupom</option>
                        {coupons.map(coupon => (
                            <option key={coupon.id} value={coupon.id}>{coupon.code} - {coupon.discount}%</option>
                        ))}
                    </select>
                        
                </div>
                <div className="d-flex justify-content-between">
                    <span>Subtotal: </span>
                    <span>R${paymentValues.subtotal}</span>    
                </div>
                <div className="d-flex justify-content-between">
                    <span>Desconto: </span>
                    <span>R${paymentValues.discount}</span>    
                </div>
                <div className="d-flex justify-content-between">
                    <span>Frete: </span>
                    <span>R${paymentValues.shipping}</span>    
                </div>
                <div className="d-flex justify-content-between">
                    <span>Total: </span>
                    <span>R${ paymentValues.total }</span>    
                </div>
            </>
        )
    }

    function handleNextStep() {
        if (step === 1) {
            if( cart.items.length < 1) return;
            setStep(2);
        } else {
            api.post('orders', {cart: cart.items, payment: paymentValues})
            .then((response) => {
                alert("Pedido realizado com sucesso:");
                setStep(1);
                setPaymentValues({
                    total: 0,
                    shipping: 0,
                    discount: 0,
                    coupon: undefined,
                    subtotal: 0,
                    email: '',
                    shipping_data: {
                        postal_code: '',
                        address: '',
                        city: '',
                        state: ''
                    }
                });
                dispatch({ type: "CLEAR_CART" });
                fetchProducts();
            })
            .catch(error => {
                console.error("Erro ao fazer pedido:", error.response.data.message);
            });
        }
    }

    return (
        <div className="modal fade" id="newProductModal" ref={ref}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Carrinho</h5>
                    </div>
                    <div className="modal-body">
                        
                    </div>
                    <div className="modal-footer d-block">
                        {
                            step === 1 ? <PaymentData /> : (
                                <>
                                    <div className="mb-3">
                                        <p>Confirmação e Entrega</p>
                                        
                                        <div className="form-group mb-1">
                                            <label htmlFor="email">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={paymentValues.email} 
                                                className="form-control"
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    setPaymentValues({
                                                            ...paymentValues,
                                                            email: e.currentTarget.value
                                                        });
                                                }}
                                            />
                                        </div>

                                        <div className="form-group mb-1">
                                            <label htmlFor="postal_code">CEP (apenas números)</label>
                                            <input
                                                type="text"
                                                id="postal_code"
                                                onChange={handlePostalCodeChange}
                                                value={paymentValues.shipping_data.postal_code} 
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group mb-1">
                                            <label htmlFor="address">Endereço</label>
                                            <input
                                                type="text"
                                                id="address"
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    setPaymentValues({
                                                            ...paymentValues,
                                                            shipping_data: {
                                                                ...paymentValues.shipping_data,
                                                                address: e.currentTarget.value
                                                            }
                                                        });
                                                }}
                                                value={paymentValues.shipping_data.address}
                                                className="form-control" />
                                        </div>
                                        <div className="form-group mb-1">
                                            <label htmlFor="city">Cidade</label>
                                            <input
                                                type="text"
                                                id="city"
                                                className="form-control"
                                                value={paymentValues.shipping_data.city}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    setPaymentValues({
                                                            ...paymentValues,
                                                            shipping_data: {
                                                                ...paymentValues.shipping_data,
                                                                city: e.currentTarget.value
                                                            }
                                                        });
                                                }}
                                            />
                                        </div>
                                        <div className="form-group mb-1">
                                            <label htmlFor="state">Estado</label>
                                            <input
                                                type="text"
                                                id="state"
                                                value={paymentValues.shipping_data.state}
                                                className="form-control"
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    setPaymentValues({
                                                            ...paymentValues,
                                                            shipping_data: {
                                                                ...paymentValues.shipping_data,
                                                                state: e.currentTarget.value
                                                            }
                                                        });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </>
                            )
                        }

                        <button className="btn btn-success d-block" style={{ width: '100%' }} onClick={handleNextStep}>
                            {step === 1 ? "Continuar" : "Fazer Pedido"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default CartModal