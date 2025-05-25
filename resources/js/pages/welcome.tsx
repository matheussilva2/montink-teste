import CreateProductModal from "@/components/CreateProductModal";
import ProductCard from "@/components/ProductCard";
import { product } from "@/utils";
import React, { useEffect, useRef, useState } from "react";

export default function Welcome() {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState<{current_page: number, last_page: number}>({current_page: 1, last_page: 1});
    
    const createProductModalRef = useRef<HTMLInputElement>(null);

    async function fetchProducts() {
        const products = await product.index();
        setProducts(products.data.data);
        setPage({
            current_page: products.data.current_page,
            last_page: products.data.last_page
        });
    }

    function openModal(modalRef:React.RefObject<HTMLInputElement|null>) {
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
            <div className="d-flex mt-3 open-modal">
                <button className="btn btn-primary" onClick={() => openModal(createProductModalRef)}>Novo Produto</button>
            </div>

            <div className="mt-3 d-flex flex-wrap justify-content-center" style={{gap: 10}}>
            {
                products.map((item) => (
                    <ProductCard key={item.id} product={item} />
                ))
            }
            </div>
        </main>

        <CreateProductModal ref={createProductModalRef} />
        </>
    );
}
