'use client'

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Billboard } from '@prisma/client';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import Heading from '../ui/heading';
import { Button } from '../ui/button';
import { Trash } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import AlertModal from '../modals/AlertModal';
import ImageUpload from '../images/ImageUpload';

interface BillboardFormProps {
    billboard: Billboard | null;
}

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

const BillboardForm: React.FC<BillboardFormProps> = ({ billboard }) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = billboard ? 'Edit Billboard' : 'Create a billboard';
    const description = billboard ? 'Edit Billboard.' : 'Add a new billboard.';
    const toastMessage = billboard ? 'Billboard updated.' : 'Billboard created.';
    const action = billboard ? 'Save changes' : 'Create';

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: billboard || {
            label: '',
            imageUrl: ''
        }
    });

    const onSubmit = async (data: BillboardFormValues) => {

        let toastLoading = '';

        if (billboard) {
            toastLoading = toast.loading('Changing billboard label... Please wait.');
        } else {
            toastLoading = toast.loading('Creating billboard... Please wait.');
        }
        try {
            setLoading(true);

            if (billboard) {
                const updateBillboard = await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
                if (updateBillboard.status === 200) {
                    router.refresh();
                    toast.dismiss(toastLoading);
                    toast.success(toastMessage);
                } else {
                    toast.dismiss(toastLoading);
                    toast.error(`${updateBillboard.status} ${updateBillboard.statusText}`);
                }
            } else {
                const createBillboard = await axios.post(`/api/${params.storeId}/billboards`, data);
                if (createBillboard.status === 200) {
                    toast.dismiss(toastLoading);
                    toast.success(toastMessage);
                } else {
                    toast.dismiss(toastLoading);
                    toast.error(`${createBillboard.status} ${createBillboard.statusText}`);
                }
            }

            router.push(`/${params.storeId}/billboards`);


        } catch (error) {
            toast.dismiss(toastLoading);
            toast.error('Something went wrong. Please try again.')
        } finally {
            toast.dismiss(toastLoading);
            setLoading(false);
        }
    };

    const onDelete = async () => {
        const toastLoading = toast.loading('Deleting billboard... Please wait.');
        try {
            setLoading(true);

            const deleteBillboard = await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);

            if (deleteBillboard.status === 200) {
                router.refresh();
                toast.dismiss(toastLoading);
                router.push(`/${params.storeId}/billboards`);
                toast.success('Billboard deleted!');
            } else {
                toast.dismiss(toastLoading);
                toast.error(`${deleteBillboard.status} ${deleteBillboard.statusText}`);
            }

        } catch (error) {
            toast.dismiss(toastLoading);
            toast.error('Make sure you removed all categories using this billboard first.')
        } finally {
            setLoading(false);
            setOpen(false);
        }

    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className='flex items-center justify-between'>
                <Heading
                    title={title}
                    description={description}
                />
                {
                    billboard && (
                        <Button
                            disabled={loading}
                            variant='destructive'
                            size='sm'
                            onClick={() => setOpen(true)}
                        >
                            <Trash className='h-4 w-4' />
                        </Button>
                    )
                }
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                    <FormField
                        control={form.control}
                        name='imageUrl'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Background Image</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value ? [field.value] : []}
                                        disabled={loading}
                                        onChange={(url) => field.onChange(url)}
                                        onRemove={() => field.onChange('')}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField
                            control={form.control}
                            name='label'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Billboard label' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    );
}

export default BillboardForm;