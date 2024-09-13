"use client";
import Header from "@/components/Header";
import Center from "@/components/Center";

import { useEffect } from "react";
import axios from "axios";
import ProductsGrid from "@/components/ProductsGrid";
import { useState } from "react";
import Title from "@/components/Title";

export default  function ProductsPage(){
    const [products,setProducts] = useState('');
    useEffect(()=>{
        axios.get('api/allProducts').then(response=>{
            setProducts(response.data);
            
        })
    },[]);

    
    return(      
        <>
        <Header></Header>
        <Center>
            <Title>All Products</Title>
            <ProductsGrid products = {products}></ProductsGrid>
        </Center>
        </>
    )
}