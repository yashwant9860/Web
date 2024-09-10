import { NextResponse } from "next/server";

import {Product} from "@/models/Product"
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "../auth/[...nextauth]/route";

export  async function POST(request){
    await isAdminRequest(request);
    const data = await request.json();
    await mongooseConnect();
    
    const {title,description,price,images,category,properties} = data;
    const productDoc = await Product.create({
        title,description,price,images,category:category?category:null,
        properties,
    })
    return NextResponse.json(productDoc);
    
}
export async function GET(request){
    await isAdminRequest(request);
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
    await isAdminRequest(request);
    const data = await request.json();
    mongooseConnect();
    const {title,description,price,_id,images,category,properties} = data;
    await Product.updateOne({_id:_id},{title,description,price,images,category:category?category:null,properties});
    return NextResponse.json("updated");

}
export async function DELETE(request){
    await isAdminRequest(request);
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