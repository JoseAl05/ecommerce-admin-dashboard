'use client'

import { useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuItem } from '../ui/dropdown-menu';
import AlertModal from '../modals/AlertModal';
import { ColorColumn } from './ColorColumns';


interface ColorCellActionProps {
    color: ColorColumn;
}

const ColorCellAction: React.FC<ColorCellActionProps> = ({ color }) => {

    const router = useRouter();
    const params = useParams();

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onCopy = (colorId: string) => {
        const copyColorId = navigator.clipboard.writeText(colorId);
        toast.promise(copyColorId, {
            success: 'Color ID copied to the clipboard',
            loading: 'Copying...',
            error: 'Error to copy into clipboard'
        })
    };

    const onDelete = async () => {
        const toastLoading = toast.loading('Deleting color... Please wait.');
        try {
            setLoading(true);

            const deleteColor = await axios.delete(`/api/${params.storeId}/colors/${color.id}`);

            if (deleteColor.status === 200) {
                router.refresh();
                toast.dismiss(toastLoading);
                toast.success('Color deleted!');
            } else {
                toast.dismiss(toastLoading);
                toast.error(`${deleteColor.status} ${deleteColor.statusText}`);
            }

        } catch (error) {
            toast.dismiss(toastLoading);
            toast.error('Make sure you removed all products using this size first.')
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
                    <DropdownMenuItem onClick={() => onCopy(color.id)}>
                        <Copy className='mr-2 h-4 w-4' />
                        Copy ID
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/colors/${color.id}`)}>
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

export default ColorCellAction;