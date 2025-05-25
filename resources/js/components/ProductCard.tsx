import { useCart } from "@/providers/CartProvider"
import { IProduct, IVariation } from "@/types"
import { useState } from "react"

type PropsType = {
  product: IProduct,
  selectProduct: (data: IProduct) => void
}

const ProductCard = ({product, selectProduct}: PropsType) => {
  const { dispatch } = useCart();
  const [selectedVariation, setSelectedVariation] = useState<IVariation | null>(null);

  function addToCart() {
    if(product.variations.length > 0 && selectedVariation) {
      dispatch({ type: "ADD_ITEM", payload: {
        id: selectedVariation.id,
        name: selectedVariation.name,
        price: selectedVariation.price,
        quantity: 1
      } });
    } else {
      dispatch({ type: "ADD_ITEM", payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      } });
    }
  }

  function handleVariationChange(event: React.FormEvent<HTMLSelectElement>) {
    const variation_id = event.currentTarget.value;

    if(variation_id === "none") {
      return setSelectedVariation(null);
    }

    product.variations.map((item:IVariation) => {
      if(item.id == variation_id) {
        setSelectedVariation(item);
      }
    });
  }

  return (
    <div className="card" style={{width: 300, maxWidth: '100%'}}>
      <div className="card-body">
        <p className="h5 card-title">{product.name}</p>
        <p>R$ {product.price}</p>
        <label htmlFor={`product_${product.id}_variations`}>Variação: </label>
        <select onInput={handleVariationChange} id={`product_${product.id}_variations`}>
          <option selected={selectedVariation === null} value="none">Sem variação</option>
          {
            product.variations?.length > 0 ?product.variations.map((variation:IVariation) => (
                <option selected={selectedVariation?.id === variation.id} value={variation.id}>{variation.name}</option>
              )):<></>
          }
        </select>
      </div>
      <div className="card-footer d-flex justify-content-between">
        <button className="btn btn-success" onClick={addToCart}>+ Carrinho</button>
        <button className="btn btn-warning" onClick={() => selectProduct(product)}>Editar</button>
      </div>
    </div>
  )
}

export default ProductCard