import { useState } from "react";
import styled from "styled-components"

const Image = styled.img`
    max-width:100%;
    max-height:100%;
`;
const BigImage = styled.img`
    max-width:100%;
    max-height:200px;
`;
const ImageButtons = styled.div`
    display:flex;
    flex-grow:0;
    gap:10px;
    margin-top:10px;
`;
const ImageButton = styled.div`
    
    border:2px solid #ccc;
    height:40px;
    padding:2px;
    cursor:pointer;
    border-radius:5px;
    ${props=>props.$active?
    `border-color:#ccc;`
    :
    `border-color:transparent;
    `}
`;
const BigImageWrapper = styled.div`
    text-align:center
`;

export default function ProductImages({images}){
    const [activeImage,setActiveImage ] =useState(images?.[0]);
    return(
        <>
        <BigImageWrapper>
        
        <BigImage src={"http://localhost:3000/"+activeImage} alt="" />
        </BigImageWrapper>
        <ImageButtons>
            {images?.length>0 && images.map(image=>(
                <ImageButton key={image} $active={image===activeImage} onClick={()=>setActiveImage(image)}>
                    <Image src={"http://localhost:3000/"+image} alt="" />
                </ImageButton>
            ))}
        </ImageButtons>
        
        </>
    )

}