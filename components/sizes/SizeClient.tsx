'use client'

import { useParams, useRouter } from 'next/navigation';
import { PlusIcon } from 'lucide-react';
import Heading from '../ui/heading';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { DataTable } from '../ui/dataTable';
import ApiList from '../ui/apiList';
import { SizeColumn, SizeColumns } from './SizeColumns';

interface SizeClientProps{
    sizes: SizeColumn[];
}

const SizeClient:React.FC<SizeClientProps> = ({sizes}) => {

    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading
                    title={`Sizes (${sizes.length})`}
                    description='Manage sizes for you store'
                />
                <Button
                    onClick={() => router.push(`/${params.storeId}/sizes/new`)}
                >
                    <PlusIcon className='mr-2 h-4 w-4'/>
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable
                columns={SizeColumns}
                data={sizes}
                searchKey='name'
            />
            <Heading
                title='API'
                description='API calls for Sizes'
            />
            <Separator />
            <ApiList entityName='sizes' entityIdName='sizeId'/>
        </>
    );
}

export default SizeClient;