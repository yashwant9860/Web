import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/categories";
import { NextResponse } from "next/server";

export  async function POST(request){
    
    const {name,parentCategory} = await request.json();
    await mongooseConnect();
    const categoryDoc = await Category.create({
        name,
        parent:parentCategory});
    return NextResponse.json(categoryDoc);
}
export async function GET(request){
    mongooseConnect();
    return NextResponse.json(await Category.find());
}