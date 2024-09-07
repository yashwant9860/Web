"use client";
import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import { useParams } from "next/navigation";
import { useEffect,useState } from "react";
import axios from "axios";

export default function EditProductPage(){
    const [productInfo,setProductInfo] = useState(null);
    const {id} = useParams();
    useEffect(()=>{
        if(!id){
            return ;
        }
        axios.get('/api/products?id='+id).then(
            response=>{
                setProductInfo(response.data);
                console.log(response.data);
        })
    },[id]);
    if (!productInfo) {
        
        return <div>Loading...</div>;
      }
    return(
        <Layout>
            <h1>Edit Product</h1>
            <ProductForm {...productInfo}>

            </ProductForm>
        </Layout>
    )
}