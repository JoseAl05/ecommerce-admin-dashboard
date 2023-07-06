'use client'

import { useParams, useRouter } from 'next/navigation';
import { PlusIcon } from 'lucide-react';
import Heading from '../ui/heading';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { DataTable } from '../ui/dataTable';
import ApiList from '../ui/apiList';
import { ProductColumn, ProductColumns } from './ProductColumns';

interface ProductClientProps{
    products: ProductColumn[];
}

const ProductClient:React.FC<ProductClientProps> = ({products}) => {

    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading
                    title={`Products (${products.length})`}
                    description='Manage products for you store'
                />
                <Button
                    onClick={() => router.push(`/${params.storeId}/products/new`)}
                >
                    <PlusIcon className='mr-2 h-4 w-4'/>
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable
                columns={ProductColumns}
                data={products}
                searchKey='name'
            />
            <Heading
                title='API'
                description='API calls for Products'
            />
            <Separator />
            <ApiList entityName='products' entityIdName='productId'/>
        </>
    );
}

export default ProductClient;