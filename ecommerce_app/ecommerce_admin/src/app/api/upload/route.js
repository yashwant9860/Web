export const config = {
    api:{bodyParser:false},
}


import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
export async function POST(request){
    const formData = await request.formData();
    const files = formData.getAll('file');
    const uploadDir = path.join(process.cwd(),'/public/uploads');
    const links = [];
    for(const file of files){
        
        const ext = file.name.split('.').pop();
        const newFilename = Date.now() + '.' + ext;
        const filePath = path.join(uploadDir,newFilename);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.writeFile(filePath,buffer);

        links.push(`/uploads/${newFilename}`);
    }
    return NextResponse.json({links});
}
