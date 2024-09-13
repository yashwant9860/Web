import { mongooseConnect } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { Product } from "@/models/Product";
export async function GET(){
    await mongooseConnect();
    return NextResponse.json(await Product.find({},null,{sort:{'_id':-1}}));
}