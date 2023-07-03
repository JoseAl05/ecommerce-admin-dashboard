'use client'

import { useParams, useRouter } from 'next/navigation';
import { PlusIcon } from 'lucide-react';
import Heading from '../ui/heading';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { BillboardColumn, BillboardColumns } from './BillboardColumns';
import { DataTable } from '../ui/dataTable';
import ApiList from '../ui/apiList';

interface BillboardClientProps{
    billboards: BillboardColumn[];
}

const BillboardClient:React.FC<BillboardClientProps> = ({billboards}) => {

    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading
                    title={`Billboards (${billboards.length})`}
                    description='Manage billboards for you store'
                />
                <Button
                    onClick={() => router.push(`/${params.storeId}/billboards/new`)}
                >
                    <PlusIcon className='mr-2 h-4 w-4'/>
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable
                columns={BillboardColumns}
                data={billboards}
                searchKey='label'
            />
            <Heading
                title='API'
                description='API calls for Billboards'
            />
            <Separator />
            <ApiList entityName='billboards' entityIdName='billboardId'/>
        </>
    );
}

export default BillboardClient;