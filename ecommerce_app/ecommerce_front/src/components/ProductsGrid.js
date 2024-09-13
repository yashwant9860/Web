import styled from "styled-components";
import ProductBox from "./ProductBox";
const StyledProductGrid = styled.div`
    display:grid;
    grid-template-columns:1fr 1fr ;
    gap:20px;
    margin-bottom:50px;
    @media screen and (min-width:768px){
    grid-template-columns:1fr 1fr 1fr 1fr;
    }

`;
export default function ProductsGrid({products}){
    return(
        <StyledProductGrid>
            {products?.length>0 && products.map(product=>(
                <ProductBox key={product._id} {...product}></ProductBox>
            ))}
        </StyledProductGrid>
    )
}