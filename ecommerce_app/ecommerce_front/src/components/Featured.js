"use client";
import styled from "styled-components"
import Center from "./Center"
import Button from "./Button";
import ButtonLink from "./ButtonLink";
import CartIcon from "./CartIcon";
import { useContext } from "react";
import { CartContext } from "./CartContext";
const Bg= styled.div`
    background-color:#222;
    color:#fff;
    padding:50px 0;

`;
const Title = styled.h1`
    margin:0;
    font-weight:normal;
    font-size:1.5rem;
    @media screen and (min-width:768px){
    font-size:3rem;
}
`;
const Desc = styled.p`
    color:#aaa;
    font-size:.8rem;
`;
const Wrapper = styled.div`
    display:grid;
    max-width:100%;
    grid-template-columns: 1.1fr 0.9fr;
    gap:40px;
    img{
        max-width:100%;
        max-height:300px;
        
    }
    
`;
const ColumnsWrapper = styled.div`
    display:flex;
    align-items:center;
    justify-content:center;
   
`;
const ButtonsWrapper = styled.div`
    margin-top:25px;
    display:flex;
    gap:10px;
`;
export default function Featured({product}){
    const {addProduct}=useContext(CartContext);
    function addFeaturedToCart(){
        addProduct(product._id);
    }
    return(
        <Bg>
            <Center>
                <Wrapper>
                    <ColumnsWrapper>
                    <div>

                    
                    <Title>{product.title}</Title>
                    <Desc>{product.description}</Desc>
                    <ButtonsWrapper>

                    <ButtonLink href={'/products/'+product._id} $outline="true" $white="true" >Read more</ButtonLink>
                    <Button $white="true" onClick={addFeaturedToCart} >
                        Add to cart
                        <CartIcon></CartIcon>

                    </Button>
                    </ButtonsWrapper>
                    </div>
                    </ColumnsWrapper>
                    <ColumnsWrapper>
                        <img src="http://localhost:3000/uploads/1725891782609.jpeg" alt="" />
                    </ColumnsWrapper>
                </Wrapper>  
            </Center>
        </Bg>
    )
}