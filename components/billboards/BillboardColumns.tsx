"use client"

import { ColumnDef } from "@tanstack/react-table"
import BillboardCellAction from './BillboardCellAction';


export type BillboardColumn = {
    id: string;
    label: string;
    createdAt: string;
}

export const BillboardColumns: ColumnDef<BillboardColumn>[] = [
    {
        accessorKey: "label",
        header: "Billboard Label",
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: 'actions',
        cell: ({ row }) => <BillboardCellAction billboard={row.original}/>
    }
]
