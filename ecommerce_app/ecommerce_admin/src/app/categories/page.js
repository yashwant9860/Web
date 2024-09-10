"use client";
import Layout from "@/components/Layout";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { withSwal } from "react-sweetalert2";
function Categories({swal})
    {
        const [name,setName] = useState('');
        const [editedCategory,setEditedCategory] = useState(null);
        const [categories,setCategories] = useState([]);
        const [parentCategory,setParentCategory] = useState(null);
        const [properties,setProperties] = useState([]);
        async function saveCategory(e){
            e.preventDefault();
            const data = {name,parentCategory,properties:properties.map(p=>(
                {name:p.name,values:p.values.split(','),}
            ))};
            if(editedCategory){
                await axios.put('/api/categories',{...data,_id:editedCategory._id});
                setEditedCategory(null);
            }
            else{
                console.log(data);
            await axios.post('/api/categories',data);
            }
            setName('');
            setParentCategory('');
            setProperties([]);
            fetchCategories();
        }
        function fetchCategories(){
            axios.get('/api/categories').then(result=>{
                setCategories(result.data);
            })
        }
        useEffect(()=>{
            fetchCategories();
        },[]);
        function editCategory(category){
            setEditedCategory(category);
            setName(category.name);
            setParentCategory(category.parent?._id);
            
            setProperties(category.properties.map(({name,values})=>({
                name,
                values:values.join(','),
            }

            )));
            
        }
        function deleteCategory(category){
            swal.fire({
                title:'Are you sure?',
                text:`Do you want to delete ${category.name}`,
                showCancelButton:true,
                cancelButtonText:'Cancel',
                confirmButtonText:'Yes ,Delete',
                confirmButtonColor:'#d55',
                reverseButtons:true,
            }).then(async result=>{

                if(result.isConfirmed){
                    const {_id} = category
                    await axios.delete('/api/categories?_id='+_id);
                    fetchCategories();
                }
            })
        }
        function addProperty(){
            setProperties(prev=>{
                return [...prev,{name:"",values:""}]
            });
        }

        function handlePropertyNameChange(index,property,newName){
            setProperties(prev=>{
                const properties = [...prev]
                properties[index].name = newName;
                return properties;
            });
            
        }
        function handlePropertyValuesChange(index,property,newValues){
            setProperties(prev=>{
                const properties = [...prev]
                properties[index].values = newValues;
                return properties;
            });
            
        }
        function removeProperty(index){
            setProperties(prev=>{
                const newProperties = [...prev].filter((p,pIndex)=>{
                    return (pIndex !== index);
                })
                return newProperties;
            })
        }
        return(
            <Layout>
                
                <h1>Categories</h1>
                <label>
                    {editedCategory ? `Edit Category ${editedCategory.name}`:'Create New Category'}
                </label>
                <form onSubmit={saveCategory}>
                    <div className="flex gap-1">
                        <input  value={name}
                        type="text" placeholder="Category Name"
                        onChange ={e=>setName(e.target.value)} />
                        <select
                        value={parentCategory}
                        onChange={e=>setParentCategory(e.target.value)}>
                            <option value="">No Parent Category</option>
                            {categories.length>0 && categories.map(category=>(
                            <option key={category._id} value={category._id}>{category.name}</option> 
                            ))}
                        </select>

                    </div>
                    <div className="mb-2">
                        <label className="block">Properties</label>
                        <button onClick={addProperty} 
                        type={"button"} 
                        className="btn-default text-sm mb-2"> 
                            Add new Property
                        </button>
                        {properties.length>0 && properties.map((property,index)=>(
                            <div className="flex gap-1 mb-2">
                                <input type="text" 
                                className="mb-0"
                                 value = {property.name}
                                 onChange = {(e)=>handlePropertyNameChange(index,property,e.target.value)}
                                 placeholder="property name (example:color)" />
                                <input type="text"
                                className="mb-0" 
                                onChange = {(e)=>handlePropertyValuesChange(index,property,e.target.value)}
                                value={property.values}
                                placeholder="values,comma seperated" />
                                <button type="button" className="btn-red" onClick={()=>removeProperty(index)}>
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-1">
                    {editedCategory &&(
                        <button className="btn-default" type="button"
                        onClick={()=>{setEditedCategory(null);
                            setName('');
                            setParentCategory('');
                            setProperties([]);
                        }}>Cancel</button>
                    )}
                    
                    <button className="btn-primary py-1" type="submit">Save</button>
                    </div>
                    
                </form>
                {!editedCategory && (
                    <table className="basic mt-4">
                    <thead>
                        <tr>
                            <td>Category name</td>
                            <td>Parent Category</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length>0 && categories.map(category=>(
                            <tr key={category._id}>
                                <td>
                                    {category.name}
                                </td>
                                <td>{category?.parent?.name}</td>
                                <td>
                                    
                                    <button 
                                    onClick={()=> editCategory(category)}
                                    className="btn-default mr-1">Edit</button>
    
                                    <button 
                                    onClick={()=>deleteCategory(category)}
                                    className="btn-red">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                )}
                
            </Layout>
        )
    
}
export default withSwal(({swal},ref)=>(
    <Categories swal = {swal}/>
)

);