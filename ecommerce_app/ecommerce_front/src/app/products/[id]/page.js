"use client";
import Header from "@/components/Header"
import Center from "@/components/Center"
import Title from "@/components/Title";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect,useState } from "react";
import styled from "styled-components";
import WhiteBox from "@/components/WhiteBox";
import ProductImages from "@/components/ProductImages";
import Button from "@/components/Button";
import CartIcon from "@/components/CartIcon";
import { useContext } from "react";
import { CartContext } from "@/components/CartContext";
const ColWrapper = styled.div`
    display:grid;
    grid-template-columns: 1fr;
    @media screen and (min-width:768px){
    grid-template-columns:0.8fr 1.2fr;
    }
    gap:40px;
    margin:40px 0;

`;
const PriceRow = styled.div`
display:flex;    
gap:20px;
align-items:center;

`;
const Price = styled.span`
font-size:1.4rem;
`;
export default function ProductPage(){
    const {addProduct} = useContext(CartContext);
     
    const {id}  = useParams();
    const [product,setProduct]= useState('');
    useEffect(()=>{
        axios.post('/api/singleProduct',{id:id}).then(response=>{
            setProduct(response.data);
        })
    },[]);
    if(!product)
    {
        return <div>Loading...</div>
    }
    return(
        <>

        <Header></Header>
        <Center>
            <ColWrapper>
            <WhiteBox>
                <ProductImages images = {product.images}></ProductImages>
            </WhiteBox>
            <div>
                <Title>{product.title}</Title>
                <p>{product.description}</p>
                <PriceRow>
                <Price>${product.price}</Price>
                <div>
                <Button onClick={()=>addProduct(product._id)} $primary={true}>
                    
                    <CartIcon></CartIcon>Add to Cart
                </Button>
                </div>
                </PriceRow>
            </div>
            </ColWrapper>
            
        </Center>
        </>
    )
}