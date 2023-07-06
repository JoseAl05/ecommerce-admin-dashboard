"use client"

import { ColumnDef } from "@tanstack/react-table"
import ProductCellAction from './ProductCellAction';


export type ProductColumn = {
    id: string;
    name:string;
    isFeatured:boolean;
    isArchived:boolean;
    price:string;
    category:string;
    size:string;
    color:string;
    createdAt:string;
}

export const ProductColumns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "name",
        header: "Product Name",
    },
    {
        accessorKey: "isArchived",
        header: "Archived",
    },
    {
        accessorKey: "isFeatured",
        header: "Featured",
    },
    {
        accessorKey: "price",
        header: "Price",
    },
    {
        accessorKey: "size",
        header: "Size",
    },
    {
        accessorKey: "color",
        header: "Color",
        cell:({ row }) => (
            <div className='flex items-center gap-x-2'>
                {row.original.color}
                <div className='h-6 w-6 rounded-full' style={{backgroundColor:row.original.color}}/>
            </div>
        )
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: 'actions',
        cell: ({ row }) => <ProductCellAction product={row.original}/>
    }
]
