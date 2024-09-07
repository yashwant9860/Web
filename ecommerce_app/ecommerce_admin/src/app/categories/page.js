"use client";
import Layout from "@/components/Layout";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

export default function CategoriesPage(){
    const [name,setName] = useState('');
    const [categories,setCategories] = useState([]);
    const [parentCategory,setParentCategory] = useState('');
    async function saveCategory(e){
        e.preventDefault();
        await axios.post('/api/categories',{name,parentCategory});
        setName('');
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
    return(
        <Layout>
            
            <h1>Categories</h1>
            <label>New Category name</label>
            <form onSubmit={saveCategory} className="flex gap-1">
                <input className="mb-0" value={name}
                type="text" placeholder="Category Name"
                onChange ={e=>setName(e.target.value)} />
                <select className="mb-0"
                value={parentCategory}
                onChange={e=>setParentCategory(e.target.value)}>
                    <option value="">No Parent Category</option>
                    {categories.length>0 && categories.map(category=>(
                    <option key={category._id} value={category._id}>{category.name}</option> 
                    ))}
                </select>
                <button className="btn-primary py-1" type="submit">Save</button>
            </form>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Category name</td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length>0 && categories.map(category=>(
                        <tr key={category._id}>
                            <td>
                                {category.name}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}