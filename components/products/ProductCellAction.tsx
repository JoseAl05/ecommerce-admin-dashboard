'use client'

import { useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuItem } from '../ui/dropdown-menu';
import AlertModal from '../modals/AlertModal';
import { ProductColumn } from './ProductColumns';


interface ProductCellActionProps {
    product: ProductColumn;
}

const ProductCellAction: React.FC<ProductCellActionProps> = ({ product }) => {

    const router = useRouter();
    const params = useParams();

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onCopy = (productId: string) => {
        const copyProductId = navigator.clipboard.writeText(productId);
        toast.promise(copyProductId, {
            success: 'Product ID copied to the clipboard',
            loading: 'Copying...',
            error: 'Error to copy into clipboard'
        })
    };

    const onDelete = async () => {
        const toastLoading = toast.loading('Deleting product... Please wait.');
        try {
            setLoading(true);

            const deleteProduct = await axios.delete(`/api/${params.storeId}/products/${product.id}`);

            if (deleteProduct.status === 200) {
                router.refresh();
                toast.dismiss(toastLoading);
                toast.success('Product deleted!');
            } else {
                toast.dismiss(toastLoading);
                toast.error(`${deleteProduct.status} ${deleteProduct.statusText}`);
            }

        } catch (error) {
            toast.dismiss(toastLoading);
            toast.error('Make sure you removed all categories using this product first.')
        } finally {
            setLoading(false);
            setOpen(false);
        }

    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant='ghost'
                        className='h-8 w-8 p-0'
                    >
                        <span className='sr-only'>Open Menu</span>
                        <MoreHorizontal className='h-4 w-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopy(product.id)}>
                        <Copy className='mr-2 h-4 w-4' />
                        Copy ID
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/products/${product.id}`)}>
                        <Edit className='mr-2 h-4 w-4' />
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className='mr-2 h-4 w-4' />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}

export default ProductCellAction;