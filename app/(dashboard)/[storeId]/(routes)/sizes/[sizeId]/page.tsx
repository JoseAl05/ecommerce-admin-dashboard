import BillboardForm from '@/components/billboards/BillboardForm';
import SizeForm from '@/components/sizes/SizeForm';
import prismadb from '@/lib/prismadb';

const SizePageForm = async({
    params
}:{
    params: { sizeId: string }
}) => {

    const size = await prismadb.size.findUnique({
        where:{
            id: params.sizeId
        }
    })

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <SizeForm size={size}/>
            </div>
        </div>
    );
}

export default SizePageForm;