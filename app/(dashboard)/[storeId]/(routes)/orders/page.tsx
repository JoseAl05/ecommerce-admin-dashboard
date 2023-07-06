import prismadb from '@/lib/prismadb';
import { format } from 'date-fns';
import BillboardClient from '@/components/billboards/BillboardClient';
import { formatter } from '@/lib/utils';
import { OrderColumn } from '@/components/orders/OrderColumn';
import OrderClient from '@/components/orders/OrderClient';

const OrdersPage = async({
    params
}:{
    params: { storeId: string }
}) => {

    const orders = await prismadb.order.findMany({
        where:{
            storeId:params.storeId
        },
        include:{
            orderItems:{
                include:{
                    product:true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedOrders: OrderColumn[] = orders.map(order => ({
        id:order.id,
        phone:order.phone,
        address:order.address,
        isPaid:order.isPaid,
        products:order.orderItems.map(orderItem => orderItem.product.name).join(', '),
        totalPrice:formatter.format(order.orderItems.reduce((total,orderItem) =>{
            return total + Number(orderItem.product.price);
        },0)),
        createdAt:format(order.createdAt, 'MMMM do, yyyy')
    }))

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <OrderClient
                    orders={formattedOrders}
                />
            </div>
        </div>
    );
}

export default OrdersPage;