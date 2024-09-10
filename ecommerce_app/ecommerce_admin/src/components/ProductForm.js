
import { useState,useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
export default function ProductForm({
    _id,
    title:existingTitle,
    description:existingDescription,
    price:existingPrice,
    images:existingImages,
    category:assignedCategory,
    properties:assignedProperties,
}){
    const [title,setTitle] = useState(existingTitle || '');
    const [category,setCategory] = useState(assignedCategory||'');
    const [productProperties,setProductProperties] = useState(assignedProperties||{});
    const [description,setDescription] = useState( existingDescription||'');
    const [price,setPrice] = useState(existingPrice || '');
    const [goToProducts,setGoToProducts] = useState(false);
    const [images,setImages] = useState(existingImages||[]);
    const [isUploading,setIsUploading] = useState(false);
    const [categories,setCategories] = useState([]);
    const router = useRouter();
    useEffect(()=>{
        axios.get('/api/categories').then(result=>{
            setCategories(result.data);
        })
    },[])
    async function saveProduct(e){
        e.preventDefault();
        const data = {title,description,price,images,
            category,properties:productProperties};
        if(_id){
            //update

            await axios.put('/api/products',{...data,_id});
            
        }
        else{
            //create
            
            await axios.post('/api/products',data);
            
        }
        setGoToProducts(true);
        
    }
    useEffect(()=>{
        
        if(goToProducts)
            router.push('/products');
    },[goToProducts,router]);


    async function uploadImages(ev){
        const files = ev.target?.files;
        if(files?.length>0){
            setIsUploading(true);
            const data = new FormData();
            for(const file of files){
                data.append('file',file);
            }
            const res = await axios.post('/api/upload',data,{
                headers:{'Content-Type':'multipart/form-data'},
            });
            setImages(oldImages=>
            [...oldImages,...res.data.links]
            ) ;
            setIsUploading(false);
        }
    }
    
    function updateImagesOrder(images){

        setImages(images);
    }
    function setProductProp(propName,value){
        setProductProperties(prev => {
            const newProductProps = {...prev};
            newProductProps[propName]=value;
            return newProductProps;
        })
    }

    const propertiesToFill = [];
    if(categories.length >0 && category){
        let catInfo = categories.find(({_id})=>_id === category)
        propertiesToFill.push(...catInfo.properties);
        while(catInfo?.parent?._id)
        {
            const parentCat = categories.find(({_id})=>_id === catInfo?.parent?._id )
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
        }
        //havent made it workable for a loop because loop cant actually happen
    }

    return(
        
            <form onSubmit={saveProduct}>
            
            <label>Product Name</label>
            <input type="text" placeholder="product name" 
            value={title}
            onChange={(e)=>setTitle(e.target.value)}  />
            <label >Category</label>
            <select value={category}
            onChange={e=>setCategory(e.target.value)}>
                <option value="">Uncategorized</option>
                {categories.length>0 && categories.map(c=>(
                    <option value={c._id}>{c.name}</option>
                ))}

            </select>
            {propertiesToFill.length>0 && propertiesToFill.map(p=>(
                <div className="">

                    <label>
                        {p.name[0].toUpperCase()+p.name.substring(1)}
                    </label>
                    <div>
                    <select
                        value={productProperties[p.name]}
                        onChange={(ev)=>
                        setProductProp(p.name,ev.target.value)}>
                        {p.values.map(v=>(
                            <option value={v}>{v}</option>
                        ))}
                    </select>
                    </div>
                </div>
            ))}
            <label >Photos:</label>
            <div className="mb-2 flex flex-wrap gap-2">
                <ReactSortable
                className="flex flex-wrap gap-1"
                  list={images} setList = {updateImagesOrder}>
                {!!images?.length && images.map(link=>(
                    <div key = {link} className=" h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
                        <img src={link}  alt="" className="rounded-lg" />
                    </div>

                ))}
                </ReactSortable>
                {isUploading &&(
                    <div className="h-24  flex items-center">
                        <Spinner></Spinner>
                    </div>
                )}
                
                <label className="cursor-pointer w-24 h-24 text-center 
                flex flex-col items-center justify-center text-sm 
                 gap-1 text-primary rounded-lg bg-white shadow-sm border border-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                <div>
                Add image
                </div>
                <input type="file" multiple onChange={uploadImages} className="hidden"/>
                </label>
                
            </div>
            <label>Description</label>
            <textarea placeholder="description"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}></textarea>
            <label>Price (in USD)</label>
            <input type="text" placeholder="price" 
            value={price}
            onChange={(e)=>setPrice(e.target.value)} />
            <button type="submit" className="btn-primary">Save</button>
            </form>
        
    )
}