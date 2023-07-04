"use client"

import { ColumnDef } from "@tanstack/react-table"
import CategoryCellAction from './CategoryCellAction';


export type CategoryColumn = {
    id: string;
    name: string;
    billboardLabel:string;
    createdAt: string;
}

export const CategoryColumns: ColumnDef<CategoryColumn>[] = [
    {
        accessorKey: "name",
        header: "Category Name",
    },
    {
        accessorKey: "billboard",
        header: "Billboard",
        cell:({ row }) => row.original.billboardLabel
    },
    {
        id: 'actions',
        cell: ({ row }) => <CategoryCellAction category={row.original}/>
    }
]
