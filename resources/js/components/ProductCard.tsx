import { IProduct } from "@/types"

type PropsType = {
  product: IProduct,
  selectProduct: (data: IProduct) => void
}

const ProductCard = ({product, selectProduct}: PropsType) => {
  console.log(product);
  return (
    <div className="card" style={{width: 300, maxWidth: '100%'}}>
      <div className="card-body">
        <p className="h5 card-title">{product.name}</p>
        <p>R$ {product.price}</p>
      </div>
      <div className="card-footer d-flex justify-content-between">
        <button className="btn btn-success">Comprar</button>
        <button className="btn btn-warning" onClick={() => selectProduct(product)}>Editar</button>
      </div>
    </div>
  )
}

export default ProductCard