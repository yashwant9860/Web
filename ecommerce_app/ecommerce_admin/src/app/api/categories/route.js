import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/categories";


import { NextResponse } from "next/server";
import {  isAdminRequest } from "../auth/[...nextauth]/route";

 
export  async function POST(request){
    await isAdminRequest(request);
    const {name,parentCategory,properties} = await request.json();
    await mongooseConnect();
    
    const categoryDoc = await Category.create({
        name:name,
        parent:parentCategory?parentCategory:null,
        properties:properties?properties:null,
    });
    return NextResponse.json(categoryDoc);
}
export async function GET(request){
    await isAdminRequest(request);
    mongooseConnect();
    return NextResponse.json(await Category.find().populate('parent'));
}
export async function PUT(request){
    await isAdminRequest(request);
    const {name,parentCategory,_id,properties} = await request.json();
    await mongooseConnect();
    
    const categoryDoc = await Category.updateOne({_id:_id},{
        name:name,
        parent:parentCategory?parentCategory:null,
        properties:properties?properties:null,
    });
    return NextResponse.json(categoryDoc);
}
export async function DELETE(request){
    await isAdminRequest(request);
    const {searchParams} = new URL(request.url);
    const id = searchParams.get('_id');
    if(id)
    {
        await Category.deleteOne({_id:id});
        return NextResponse.json("deleted");
    }
    else{
        return NextResponse.json("delete failed");
    }
}