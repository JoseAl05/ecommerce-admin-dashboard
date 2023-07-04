'use client'

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Size } from '@prisma/client';
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

interface SizeFormProps {
    size: Size | null;
}

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
});

type SizeFormValues = z.infer<typeof formSchema>;

const SizeForm: React.FC<SizeFormProps> = ({ size }) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = size ? 'Edit Size' : 'Create a size';
    const description = size ? 'Edit Size.' : 'Add a new size.';
    const toastMessage = size ? 'Size updated.' : 'Size created.';
    const action = size ? 'Save changes' : 'Create';

    const form = useForm<SizeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: size || {
            name: '',
            value: ''
        }
    });

    const onSubmit = async (data: SizeFormValues) => {

        let toastLoading = '';

        if (size) {
            toastLoading = toast.loading('Changing size name... Please wait.');
        } else {
            toastLoading = toast.loading('Creating size... Please wait.');
        }
        try {
            setLoading(true);

            if (size) {
                const updateSize = await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data);
                if (updateSize.status === 200) {
                    router.refresh();
                    toast.dismiss(toastLoading);
                    toast.success(toastMessage);
                } else {
                    toast.dismiss(toastLoading);
                    toast.error(`${updateSize.status} ${updateSize.statusText}`);
                }
            } else {
                const createSize = await axios.post(`/api/${params.storeId}/sizes`, data);
                if (createSize.status === 200) {
                    toast.dismiss(toastLoading);
                    toast.success(toastMessage);
                } else {
                    toast.dismiss(toastLoading);
                    toast.error(`${createSize.status} ${createSize.statusText}`);
                }
            }

            router.push(`/${params.storeId}/sizes`);


        } catch (error) {
            toast.dismiss(toastLoading);
            console.log(error);
            toast.error('Something went wrong. Please try again.')
        } finally {
            toast.dismiss(toastLoading);
            setLoading(false);
        }
    };

    const onDelete = async () => {
        const toastLoading = toast.loading('Deleting size... Please wait.');
        try {
            setLoading(true);

            const deleteSize = await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);

            if (deleteSize.status === 200) {
                router.refresh();
                toast.dismiss(toastLoading);
                router.push(`/${params.storeId}/sizes`);
                toast.success('Size deleted!');
            } else {
                toast.dismiss(toastLoading);
                toast.error(`${deleteSize.status} ${deleteSize.statusText}`);
            }

        } catch (error) {
            toast.dismiss(toastLoading);
            console.log(error);
            toast.error('Make sure you removed all products using this size first.')
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
                    size && (
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
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Size Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Size name' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='value'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Size value' {...field} />
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

export default SizeForm;