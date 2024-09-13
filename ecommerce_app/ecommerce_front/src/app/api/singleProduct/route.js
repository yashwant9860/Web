import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(request){
    await mongooseConnect();
    const data =await request.json();
    const {id} = data;
    return NextResponse.json(await Product.findById(id));
}