'use client'

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Store } from '@prisma/client';
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
import ApiAlert from '../ui/apiAlert';
import { useOrigin } from '@/app/hooks/useOrigin';

interface SettingsFormProps {
    store: Store;
}

const formSchema = z.object({
    name: z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formSchema>;

const SettingsForm: React.FC<SettingsFormProps> = ({ store }) => {

    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: store
    });

    const onSubmit = async (data: SettingsFormValues) => {
        const toastLoading = toast.loading('Changing store name... Please wait.');
        try {
            setLoading(true);

            const updateStore = await axios.patch(`/api/stores/${params.storeId}`, data);

            if (updateStore.status === 200) {
                router.refresh();
                toast.dismiss(toastLoading);
                toast.success('Store name updated');
            } else {
                toast.dismiss(toastLoading);
                toast.error(`${updateStore.status} ${updateStore.statusText}`);
            }

        } catch (error) {
            toast.dismiss(toastLoading);
            toast.error('Something went wrong. Please try again.')
        } finally {
            toast.dismiss(toastLoading);
            setLoading(false);
        }
    };

    const onDelete = async () => {
        const toastLoading = toast.loading('Deleting store... Please wait.');
        try {
            setLoading(true);

            const deleteStore = await axios.delete(`/api/stores/${params.storeId}`);

            if(deleteStore.status === 200){
                router.refresh();
                toast.dismiss(toastLoading);
                router.push('/');
                toast.success('Store deleted!');
            } else {
                toast.dismiss(toastLoading);
                toast.error(`${updateStore.status} ${updateStore.statusText}`);
            }

        } catch (error) {
            toast.dismiss(toastLoading);
            toast.error('Make sure you removed all products and categories first.')
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
                    title='Settings'
                    description='Manage store preferences'
                />
                <Button
                    disabled={loading}
                    variant='destructive'
                    size='sm'
                    onClick={() => setOpen(true)}
                >
                    <Trash className='h-4 w-4' />
                </Button>
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
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Store name' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        Save Changes
                    </Button>
                </form>
            </Form>
            <Separator/>
            <ApiAlert
                title='NEXT_PUBLIC_API_URL'
                description={`${origin}/api/${params.storeId}`}
                variant='public'
            />
        </>
    );
}

export default SettingsForm;