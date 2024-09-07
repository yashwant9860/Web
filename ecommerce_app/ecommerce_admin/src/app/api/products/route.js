import { NextResponse } from "next/server";

import {Product} from "@/models/Product"
import { mongooseConnect } from "@/lib/mongoose";
export  async function POST(request){
    const data = await request.json();
    await mongooseConnect();
    
    const {title,description,price,images} = data;
    const productDoc = await Product.create({
        title,description,price,images
    })
    return NextResponse.json(productDoc);
    
}
export async function GET(request){
    await mongooseConnect();
    const {searchParams} = new URL(request.url);
    const id = searchParams.get('id');
    
    if(id)
    {
        return NextResponse.json(await Product.findOne({_id:id}));
    }
    else
    {
    return NextResponse.json(await Product.find());
    }
}
export async function PUT(request){
    const data = await request.json();
    mongooseConnect();
    const {title,description,price,_id,images} = data;
    await Product.updateOne({_id:_id},{title,description,price,images});
    return NextResponse.json("updated");

}
export async function DELETE(request){
    await mongooseConnect();
    const {searchParams} = new URL(request.url);
    const id = searchParams.get('id');
    if(id){
        await Product.deleteOne({_id:id});
        return NextResponse.json("deleted");
    }
    else{
        return NextResponse.json("not able to dlete");
    }
}