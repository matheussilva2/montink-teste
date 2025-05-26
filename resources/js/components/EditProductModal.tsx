import { api } from "@/services/api";
import { IProduct, IVariation } from "@/types";
import { forwardRef, useEffect, useState } from "react"

type propsType = {
    fetchProducts: () => void,
    product: IProduct
}

const emptyProduct:IProduct = {
    id: -1,
    name: '',
    price: 0,
    stock: 0,
    variations: []
};

const EditProductModal = forwardRef<HTMLDivElement, propsType> (({fetchProducts, product}, ref) => {
    const [productData, setProductData] = useState<IProduct>(product || emptyProduct);
    const [error, setError] = useState<string | null | undefined>(null);
    
    async function fetchProduct() {
        if(!product.id) return;

        await api.get(`products/${product.id}`)
        .then((response:any) => {
            const data = response.data;

            const variations:IVariation[] = [];
            data.variations.map((variation:IVariation, index: number) => {
                if(variation.id === undefined) return;
                variation.local_id = variation.id;
                variations[variation.id] = variation;
            });

            data.variations = variations;
            
            setProductData(response.data);
        });
    }

    useEffect(() => {
        fetchProduct();
    }, [product]);

    function handleRequestError(error:string) {
        setError(error);

        setTimeout(() => setError(null), 3000);
    }

    function setProductField(name: keyof IProduct, value: string | number) {
        const prev_product = {...productData};
        setProductData({
            ...prev_product,
            [name]: value
        });
    }

    function setProductVariationField(name: keyof IVariation, value: string | number, local_id: number | undefined ) {
        
        const updated_product:IProduct = {
            ...productData,
            variations: productData.variations.map(variation =>
                variation && variation.local_id === local_id
                    ? { ...variation, [name]: value }
                    : variation
            )
        };
        setProductData(updated_product);
    }

    function addVariation() {
        const data = {
            ...productData,
            variations: [...productData.variations, {
                local_id: productData.variations.length,
                name: "",
                price: 0,
                stock: 0
            }]
        }

        setProductData(data);
    }
    
    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        let formData = {...productData};
        formData.variations = formData.variations.filter((variation:IVariation) => variation);

        api.put(`products/${productData.id}`, formData)
        .then((response) => {
            fetchProducts();
            alert("Produto atualizado com sucesso!");
            setProductData(emptyProduct);
        })
        .catch((error) => {
            handleRequestError(error.response.data.message);
        });
    }

    return (
        <div className="modal fade" id="newProductModal" ref={ref}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Editar Produto - {productData.id}</h5>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={onSubmit} action="{{url('products')}}" method="post" className="container">
                            <input type="hidden" name="id" value={productData.id} />
                            <div className="form-group mb-3">
                                <label htmlFor="name">Nome</label>
                                <input
                                    value={productData.name}
                                    onInput={(e) => setProductField((e.target as HTMLInputElement).name as keyof IProduct, (e.target as HTMLInputElement).value)}
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    required />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="stock">Estoque</label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control"
                                        name="stock"
                                        required
                                        value={productData.stock}
                                        onInput={(e) => setProductField((e.target as HTMLInputElement).name as keyof IProduct, (e.target as HTMLInputElement).value)}
                                    />
                                    <div className="input-group-prepend">
                                        <div className="input-group-text">Un.</div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="price">Preço</label>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <div className="input-group-text">R$</div>
                                    </div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="form-control"
                                        id="price"
                                        name="price"
                                        value={productData.price}
                                        onInput={(e) => setProductField((e.target as HTMLInputElement).name as keyof IProduct, (e.target as HTMLInputElement).value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group mb-3">
                                <span className="variation d-block h5">Variações</span>
                                
                                {
                                    productData.variations.map((variation: IVariation, index:number) => variation && (
                                        variation.local_id !== undefined ? (
                                    <fieldset key={variation.local_id} className="mb-2">
                                        <legend className="h6">Variação {variation.local_id}</legend>
                                        <div className="form-group mb-3">
                                            <label htmlFor={`variation_${variation.local_id}_name`}>Nome</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name={`variation_${variation.local_id}_name`}
                                                value={productData.variations[variation.local_id].name}
                                                onInput={(e) => setProductVariationField('name', (e.target as HTMLInputElement).value, variation.local_id)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor={`variation_${variation.local_id}_stock`}>Estoque</label>
                                            <div className="input-group">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    className="form-control"
                                                    name={`variation_${variation.local_id}_stock`}
                                                    value={productData.variations[variation.local_id].stock}
                                                    onInput={(e) => setProductVariationField('stock', (e.target as   HTMLInputElement).value, variation.local_id)}
                                                    required
                                                    
                                                />
                                                <div className="input-group-prepend">
                                                    <div className="input-group-text">Un.</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor={`variation_${variation.local_id}_price`}>Preço</label>
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <div className="input-group-text">R$</div>
                                                </div>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    className="form-control"
                                                    name={`variation_${variation.local_id}_price`}
                                                    value={productData.variations[variation.local_id].price}
                                                    onInput={(e) => setProductVariationField('price', (e.target as   HTMLInputElement).value, variation.local_id)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </fieldset>
                                    ):<></>))
                                }

                                <button type="button" className="btn btn-primary mt-1 d-block" onClick={() => addVariation()}>+ Nova Variação</button>
                            </div>
                            {
                                error && (
                                    <div className="alert alert-danger">
                                        <ul className="m-0 p-0">
                                            <li>{error}</li>
                                        </ul>
                                    </div>
                                )
                            }

                            <button className="btn btn-primary" type="submit">
                                Salvar Alterações
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default EditProductModal;