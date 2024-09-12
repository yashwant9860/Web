import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";
const stripe = require('stripe')(process.env.STRIPE_SK);

export async function POST(request){

    const data = await request.json();
    const {name,email,city,postalCode,streetAddress,country,products} = data;
    await mongooseConnect();
    const productIds = products.split(',');
    const uniqueIds = [...new Set(productIds)];
    const productsInfo =await Product.find({_id:uniqueIds});
    

    let line_items = [];
    for(const productId of uniqueIds){
        const productInfo = productsInfo.find(p=>p._id.toString() === productId);
        const quantity = productIds.filter(id=>id===productId)?.length||0;
        if(quantity>0 && productInfo){
            line_items.push({
                quantity,
                price_data:{
                    currency:'USD',
                    product_data:{name:productInfo.title},
                    unit_amount:quantity*productInfo.price*100,
                }
            })
        }
        
    }
    const orderDoc= await Order.create({
        line_items,name,email,city,postalCode,streetAddress,country
        ,paid:false,
    });
    const session = await stripe.checkout.sessions.create({
        line_items,
        mode:'payment',
        customer_email:email,
        success_url:"http://localhost:3001/"+'cart?success=1',
        cancel_url:"http://localhost:3001/"+'cart?cancel=1',
        metadata:{orderId:orderDoc._id.toString()},
    })
    // console.log(session);
    
    return NextResponse.json({url:session.url});

}