import prismadb from '@/lib/prismadb';
import { format } from 'date-fns';
import { SizeColumn } from '@/components/sizes/SizeColumns';
import SizeClient from '@/components/sizes/SizeClient';

const SizesPage = async({
    params
}:{
    params: { storeId: string }
}) => {

    const sizes = await prismadb.size.findMany({
        where:{
            storeId:params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedSizes: SizeColumn[] = sizes.map(size => ({
        id:size.id,
        name:size.name,
        value:size.value,
        createdAt:format(size.createdAt, 'MMMM do, yyyy')
    }))

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <SizeClient
                    sizes={formattedSizes}
                />
            </div>
        </div>
    );
}

export default SizesPage;