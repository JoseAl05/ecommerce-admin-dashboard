'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { ImagePlus, Trash } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
}

const ImageUpload:React.FC<ImageUploadProps> = ({disabled,onChange,onRemove,value}) => {

    const [isMounted,setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    },[])

    const onUpload = (result:any) => {
        onChange(result.info.secure_url);
    };

    if(!isMounted){
        return null;
    }


    return (
        <div>
            <div className='flex items-center gap-4 mb-4'>
                {value.map(image => (
                    <div key={image} className='relative w-[200px] h-[200px] rounded-md overflow-hidden'>
                        <div className='absolute top-2 right-2 z-10'>
                            <Button type='button' variant='destructive' size='icon' onClick={() => onRemove(image)}>
                                <Trash className='h-4 w-4'/>
                            </Button>
                        </div>
                        <Image
                            fill
                            className='object-cover'
                            alt='Image'
                            src={image}
                        />
                    </div>
                ))}
            </div>
            <CldUploadWidget onUpload={onUpload} uploadPreset='tjmnjubj'>
                {({open}) => {
                    const onClick = () => {
                        open();
                    }

                    return(
                        <Button
                            type='button'
                            disabled={disabled}
                            variant='secondary'
                            onClick={onClick}
                        >
                            <ImagePlus className='h-4 w-4 mr-2'/>
                            Upload an Image
                        </Button>
                    )
                }}
            </CldUploadWidget>
        </div>
    );
}

export default ImageUpload;