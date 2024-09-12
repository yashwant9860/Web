"use client";
import {useEffect, createContext,useState } from "react"


export const CartContext = createContext({});
export function CartContextProvider({children}){
    const [isCartReady, setIsCartReady] = useState(false);
    const ls = typeof window !=="undefined"? localStorage :null;
    const defaultProducts = ls?JSON.parse(ls?.getItem('cart')):[];
    const [cartProducts,setCartProducts] = useState(defaultProducts||[]);
    useEffect(()=>{
        
        if(cartProducts?.length>0){
            ls?.setItem('cart',JSON.stringify(cartProducts));
        }
        setIsCartReady(true);
    },[cartProducts]);
    useEffect(()=>{
        if(ls && ls.getItem('cart')){
            setCartProducts(JSON.parse(ls.getItem('cart')));
        }
    },[]);

    
    if (!isCartReady) {
        return null; // Prevent rendering until the cart is ready
    }
    function addProduct(productId){
        setCartProducts(prev=>[...prev,productId]);
    }
    function removeProduct(productId){
        setCartProducts(prev=>{
            const pos = prev.indexOf(productId);
            if(pos!==-1)
            {
                return prev.filter((value,index)=>index!==pos);
            }
            return prev;
        })
    }
    function clearCart(){
        setCartProducts([]);
    }
    return(
        <CartContext.Provider value={{clearCart,cartProducts,removeProduct,setCartProducts,addProduct}}>
            {children}
        </CartContext.Provider>
    )
}