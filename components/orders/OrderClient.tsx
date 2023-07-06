'use client'

import { useParams, useRouter } from 'next/navigation';
import { PlusIcon } from 'lucide-react';
import Heading from '../ui/heading';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { DataTable } from '../ui/dataTable';
import ApiList from '../ui/apiList';
import { OrderColumn, OrderColumns } from './OrderColumn';

interface OrderClientProps {
    orders: OrderColumn[];
}

const OrderClient: React.FC<OrderClientProps> = ({ orders }) => {

    const router = useRouter();
    const params = useParams();

    return (
        <>
            <Heading
                title={`Orders (${orders.length})`}
                description='Manage orders for you store'
            />
            <Separator />
            <DataTable
                columns={OrderColumns}
                data={orders}
                searchKey='products'
            />
        </>
    );
}

export default OrderClient;