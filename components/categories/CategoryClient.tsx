'use client'

import { useParams, useRouter } from 'next/navigation';
import { PlusIcon } from 'lucide-react';
import Heading from '../ui/heading';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { BillboardColumn, BillboardColumns } from './BillboardColumns';
import { DataTable } from '../ui/dataTable';
import ApiList from '../ui/apiList';
import { CategoryColumn, CategoryColumns } from './CategoryColumns';

interface CateogryClientProps{
    categories: CategoryColumn[];
}

const CategoryClient:React.FC<CategoryClientProps> = ({categories}) => {

    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading
                    title={`Categories (${categories.length})`}
                    description='Manage categories for you store'
                />
                <Button
                    onClick={() => router.push(`/${params.storeId}/categories/new`)}
                >
                    <PlusIcon className='mr-2 h-4 w-4'/>
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable
                columns={CategoryColumns}
                data={categories}
                searchKey='name'
            />
            <Heading
                title='API'
                description='API calls for Categories'
            />
            <Separator />
            <ApiList entityName='categories' entityIdName='categoryId'/>
        </>
    );
}

export default CategoryClient;