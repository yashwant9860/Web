"use client";
import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import Button from "@/components/Button";
import { useContext,useState,useEffect } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import Table from "@/components/Table";
import Input from "@/components/Input";
const ColumnsWrapper = styled.div`
    display:grid;
    grid-template-columns:1.3fr 0.7fr;
    gap:40px;
    margin-top:40px;
`; 
const Box=styled.div`
    background-color:#fff;
    border-radius:10px;
    padding:30px;
`;
const ProductInfoCell = styled.div`
    padding:10px 0;
    
`;
const ProductImageBox = styled.div`
    max-width:100px;
    max-height:100px;
    padding:10px;
    box-shadow: 1px solid rgba(0,0,0,0.1);
    display:flex;
    align-items:center;
    justify-content:center;
    border-radius:10px;
    img{
        max-width:80px;
        max-height:80px

    }
`;

const QuantityLabel = styled.span`
    padding:0 3px;
`;
const CityHolder = styled.div`
    display:flex;
    gap:5px;
`;
export default function CartPage(){
    const {cartProducts,addProduct,removeProduct,clearCart} = useContext(CartContext);
    const [products,setProducts] = useState([]);
    const  [name,setName]  = useState('');
    const  [email,setEmail]  = useState('');
    const  [city,setCity]  = useState('');
    const  [postalCode,setPostalCode]  = useState('');
    const  [streetAddress,setStreetAddress]  = useState('');    
    const  [country,setCountry]  = useState('');

    useEffect(()=>{
        if(cartProducts?.length>0)
        {
            axios.post('api/cart',{ids:cartProducts}).then(response=>{
                setProducts(response.data);
            })
        }
        else{
            setProducts([]);
        }
    },[cartProducts])
    useEffect(()=>{
        if(window.location.href.includes('success')){
            clearCart();
        }

    },[])
    function moreOfThisProduct(id){
        addProduct(id);
    }
    function lessOfThisProduct(id)
    {
        removeProduct(id);
    }
    
    let total = 0;
    for(const productId of cartProducts)
    {
        const price = products.find(p=>p._id === productId)?.price||0;
        total+=price;

    }
    async function onCheckout(e){
        e.preventDefault();
        const response = await axios.post('api/checkout/',{
            name,email,city,postalCode,country,streetAddress,
            products:cartProducts.join(','),

        })
        if(response.data.url){
            window.location = response.data.url;
        }
        
    }
    if(window.location.href.includes('success')){
        return(
            <>
            <Header></Header>
            <Center>
                <ColumnsWrapper>
                <Box>
                    <h1>Thanks for order</h1>
                    <p>We will email you  when your order will be sent</p>
                </Box>
                </ColumnsWrapper>
            </Center>
            </>
        )
    }
    return(
        <>
            <Header/>
            <Center>
            <ColumnsWrapper>
            <Box>
                <h2>Cart</h2>
                {!cartProducts?.length &&(
                    <div>Your Cart is empty..</div>
                )}
                {products?.length>0 &&(
                <Table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                       
                        
                        {products.map(product=>(
                            <tr>
                                <td>
                                    <ProductInfoCell>
                                    <ProductImageBox>
                                    <img src={"http://localhost:3000/"+product.images[0]} alt="" />
                                    </ProductImageBox>
                                    {product.title}
                                    </ProductInfoCell>
                                </td>
                                <td>
                                    <Button onClick={()=>lessOfThisProduct(product._id)}>-</Button>
                                    <QuantityLabel>
                                    {cartProducts.filter(id=>id===product._id).length}
                                    </QuantityLabel>
                                    <Button onClick={()=>moreOfThisProduct(product._id)}>+</Button>
                                </td>
                                <td>${(cartProducts.filter(id=>id===
                                product._id).length)*product.price}</td>
                            </tr>
                        ))}
                        
                        
                        <tr>
                            <td></td>
                            <td>Total:</td>
                            <td>${total}</td>
                        </tr>
                    </tbody>
                </Table>
            )}
                
            </Box>
            
            {!!cartProducts?.length && (
                <Box>
                <h2>Order Info</h2>
                <form onSubmit={onCheckout}>
                <Input type="text" placeholder="Name"  value={name}
                onChange={(e)=>setName(e.target.value)} />
                <Input type="text" placeholder="Email" value={email}
                onChange={(e)=>setEmail(e.target.value)}/>
                <CityHolder>
                <Input type="text" placeholder="City" value={city}
                onChange={(e)=>setCity(e.target.value)}/>
                <Input type="text" placeholder="Postal Code"  value={postalCode}
                onChange={(e)=>setPostalCode(e.target.value)}/>
                </CityHolder>
                
                <Input type="text" placeholder="Street Address" value={streetAddress}
                onChange={(e)=>setStreetAddress(e.target.value)}/>
                <Input type="text" placeholder="Country"  value={country}
                onChange={(e)=>setCountry(e.target.value)}/>
                {/* <input type="hidden" value={cartProducts.join(',')} /> */}
                <Button type="submit" $black={true} $block={true}  >Continue to payment</Button>
                </form>
            </Box>

            )}
            
            </ColumnsWrapper>
            </Center>
        </>
    )
}