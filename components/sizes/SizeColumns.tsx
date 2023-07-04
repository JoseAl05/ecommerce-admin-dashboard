"use client"

import { ColumnDef } from "@tanstack/react-table"
import SizeCellAction from './SizeCellAction';


export type SizeColumn = {
    id: string;
    name: string;
    value: string;
    createdAt: string;
}

export const SizeColumns: ColumnDef<SizeColumn>[] = [
    {
        accessorKey: "name",
        header: "Size Name",
    },
    {
        accessorKey: "value",
        header: "Value",
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: 'actions',
        cell: ({ row }) => <SizeCellAction size={row.original}/>
    }
]
