"use client"

import { ColumnDef } from "@tanstack/react-table"
import ColorCellAction from './ColorCellAction';


export type ColorColumn = {
    id: string;
    name: string;
    value: string;
    createdAt: string;
}

export const ColorColumns: ColumnDef<ColorColumn>[] = [
    {
        accessorKey: "name",
        header: "Color Name",
    },
    {
        accessorKey: "value",
        header: "Value",
        cell: ({ row }) => (
            <div className='flex items-center gap-x-2'>
                {row.original.value}
                <div className='h-6 w-6 rounded-full' style={{backgroundColor: row.original.value}}/>
            </div>
        )
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: 'actions',
        cell: ({ row }) => <ColorCellAction color={row.original}/>
    }
]
