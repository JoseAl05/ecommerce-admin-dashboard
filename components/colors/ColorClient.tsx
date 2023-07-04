'use client'

import { useParams, useRouter } from 'next/navigation';
import { PlusIcon } from 'lucide-react';
import Heading from '../ui/heading';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { DataTable } from '../ui/dataTable';
import ApiList from '../ui/apiList';
import { ColorColumn, ColorColumns } from './ColorColumns';

interface ColorClientProps{
    colors: ColorColumn[];
}

const ColorClient:React.FC<ColorClientProps> = ({colors}) => {

    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading
                    title={`Colors (${colors.length})`}
                    description='Manage colors for you store'
                />
                <Button
                    onClick={() => router.push(`/${params.storeId}/colors/new`)}
                >
                    <PlusIcon className='mr-2 h-4 w-4'/>
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable
                columns={ColorColumns}
                data={colors}
                searchKey='name'
            />
            <Heading
                title='API'
                description='API calls for Colors'
            />
            <Separator />
            <ApiList entityName='colors' entityIdName='colorId'/>
        </>
    );
}

export default ColorClient;