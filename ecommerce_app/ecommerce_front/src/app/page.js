import Header from "@/components/Header"
import Featured from "@/components/Featured"
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import NewProducts from "@/components/NewProducts";
export default async function Home() {
  await mongooseConnect();
  const featuredProductId = "66df04ca78aada9ffa7fd070";
  const featuredProduct =await Product.findById(featuredProductId).lean();
  const newProducts = await Product.find({},null,{sort:{'_id':-1},limit:10}).lean();
  const sanitizedFeaturedProduct = JSON.parse(JSON.stringify(featuredProduct));
  const sanitizedNewProducts = JSON.parse(JSON.stringify(newProducts));
  return (
    <div>
      <Header></Header>
      <Featured product = {sanitizedFeaturedProduct}></Featured>
      <NewProducts products = {sanitizedNewProducts}></NewProducts>
    </div>
  )
}
