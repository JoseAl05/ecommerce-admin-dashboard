'use client'

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Color } from '@prisma/client';
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

interface ColorFormProps {
    color: Color | null;
}

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(4).regex(/^#/, {
        message: 'String must be a valid hex code'
    }),
});

type ColorFormValues = z.infer<typeof formSchema>;

const ColorForm: React.FC<ColorFormProps> = ({ color }) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = color ? 'Edit Color' : 'Create a color';
    const description = color ? 'Edit Color.' : 'Add a new color.';
    const toastMessage = color ? 'Color updated.' : 'Color created.';
    const action = color ? 'Save changes' : 'Create';

    const form = useForm<ColorFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: color || {
            name: '',
            value: ''
        }
    });

    const onSubmit = async (data: ColorFormValues) => {

        let toastLoading = '';

        if (color) {
            toastLoading = toast.loading('Changing color name... Please wait.');
        } else {
            toastLoading = toast.loading('Creating color... Please wait.');
        }
        try {
            setLoading(true);

            if (color) {
                const updateColor = await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data);
                if (updateColor.status === 200) {
                    router.refresh();
                    toast.dismiss(toastLoading);
                    router.push(`/${params.storeId}/colors`);
                    toast.success(toastMessage);
                } else {
                    toast.dismiss(toastLoading);
                    toast.error(`${updateColor.status} ${updateColor.statusText}`);
                }
            } else {
                const createColor = await axios.post(`/api/${params.storeId}/colors`, data);
                if (createColor.status === 200) {
                    toast.dismiss(toastLoading);
                    router.push(`/${params.storeId}/colors`);
                    toast.success(toastMessage);
                } else {
                    toast.dismiss(toastLoading);
                    toast.error(`${createColor.status} ${createColor.statusText}`);
                }
            }




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
        const toastLoading = toast.loading('Deleting color... Please wait.');
        try {
            setLoading(true);

            const deleteColor = await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);

            if (deleteColor.status === 200) {
                router.refresh();
                toast.dismiss(toastLoading);
                router.push(`/${params.storeId}/colors`);
                toast.success('Color deleted!');
            } else {
                toast.dismiss(toastLoading);
                toast.error(`${deleteColor.status} ${deleteColor.statusText}`);
            }

        } catch (error) {
            toast.dismiss(toastLoading);
            console.log(error);
            toast.error('Make sure you removed all products using this color first.')
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
                    color && (
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
                                    <FormLabel>Color Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Color name' {...field} />
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
                                        <div className='flex items-center gap-x-4'>
                                            <Input disabled={loading} placeholder='Color value' {...field} />
                                            <div
                                                className='border p-4 rounded-full'
                                                style={{ backgroundColor: field.value }}
                                            />
                                        </div>
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

export default ColorForm;