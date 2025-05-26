import CartModal from "@/components/CartModal";
import CreateProductModal from "@/components/CreateProductModal";
import EditProductModal from "@/components/EditProductModal";
import ProductCard from "@/components/ProductCard";
import { api } from "@/services/api";
import { IProduct } from "@/types";
import React, { useEffect, useRef, useState } from "react";

export default function Home() {
    const emptyProduct:IProduct = {
        name: '',
        price: 0,
        stock: 0,
        variations: []
    };

    const [products, setProducts] = useState<IProduct[]>([]);
    const [page, setPage] = useState<{current_page: number, last_page: number}>({current_page: 1, last_page: 1});
    const [selectedProduct, setSelectedProduct] = useState<IProduct>(emptyProduct);
    
    const createProductModalRef = useRef<HTMLDivElement>(null);
    const editProductModalRef = useRef<HTMLDivElement>(null);
    const cartModalRef = useRef<HTMLDivElement>(null);

    function selectProduct(data:IProduct) {
        setSelectedProduct(data);
        openModal(editProductModalRef);
    }

    function fetchMoreProducts() {
        if(page.current_page >= page.last_page) return;
        
        api.get(`products?page=${page.current_page + 1}`)
        .then((response) => {
            setProducts([...products, ...response.data.data]);
            setPage({
                current_page: response.data.current_page,
                last_page: response.data.last_page
            });
        });
    }

    function fetchProducts() {
        api.get(`products`)
        .then((response) => {
            setProducts([...response.data.data]);
            setPage({
                current_page: response.data.current_page,
                last_page: response.data.last_page
            });
        });
    }

    function openModal(modalRef:React.RefObject<HTMLDivElement|null>) {
        if(!modalRef.current) return;
        
        const modal = new bootstrap.Modal(modalRef.current);
        
        modal.show();
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <>
        <header className="bg-primary py-2 d-flex justify-content-center align-items-center">
            <span className='text-light h3'>Teste Montink</span>
        </header>
        <main className="container">
            <div className="d-flex mt-3" style={{gap: 3}}>
                <button className="btn btn-primary" onClick={() => openModal(cartModalRef)}>Carrinho</button>
                <button className="btn btn-primary" onClick={() => openModal(createProductModalRef)}>Novo Produto</button>
            </div>

            <div className="my-3 d-flex flex-wrap justify-content-center" style={{gap: 10}}>
            {
                products.map((item:IProduct) => (
                    <ProductCard selectProduct={selectProduct} key={item.id} product={item} />
                ))
            }
            </div>
            {
                page.current_page < page.last_page && (
                    <div className="mb-3">
                        <button className="btn d-block mx-auto mt-3 text-primary border-1" onClick={fetchMoreProducts}>Carregar Mais</button>
                    </div>
               )
            }
        </main>

        <CreateProductModal fetchProducts={fetchProducts} ref={createProductModalRef} />
        <EditProductModal product={selectedProduct} fetchProducts={fetchProducts} ref={editProductModalRef} />
        <CartModal fetchProducts={fetchProducts} ref={cartModalRef} />
        </>
    );
}
