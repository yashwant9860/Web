"use client";
import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import axios from "axios";
import { useParams } from "next/navigation";
export default function DeleteProductPage(){
    const {id} = useParams();
    
    const [productInfo,setProductInfo] = useState();
    const router = useRouter();
    useEffect(()=>{
        if(!id){
            return ;
        }
        axios.get('/api/products?id='+id).then(response=>{
            setProductInfo(response.data);
        });
    },[id]);
    function goBack(){
        router.push('/products');
    }
    async function deleteProduct(e){
        e.preventDefault();
        await axios.delete('/api/products?id='+id)
        goBack();
    }
    return (
        
        <Layout>
            <h1 className="text-center">Do you really want to delete product
                &nbsp;"{productInfo?.title}"?
            </h1>
            <div className="flex gap-2 justify-center">
            <button className="btn-red" onClick={deleteProduct}>YES</button>
            <button onClick={goBack} className="btn-default">NO</button>
            </div>
        </Layout>
    )
}