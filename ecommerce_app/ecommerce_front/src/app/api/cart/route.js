import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";
export async function POST(request){
    await mongooseConnect();
    const {ids} = await request.json()
    const response = await Product.find({_id:ids});
    return NextResponse.json(response); 
}