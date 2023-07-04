import BillboardForm from '@/components/billboards/BillboardForm';
import ColorForm from '@/components/colors/ColorForm';
import prismadb from '@/lib/prismadb';

const ColorPageForm = async({
    params
}:{
    params: { colorId: string }
}) => {

    const color = await prismadb.color.findUnique({
        where:{
            id: params.colorId
        }
    })

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <ColorForm color={color}/>
            </div>
        </div>
    );
}

export default ColorPageForm;