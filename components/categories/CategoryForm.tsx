'use client'

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Billboard, Category } from '@prisma/client';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import Heading from '../ui/heading';
import { Button } from '../ui/button';
import { Trash } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger,SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import AlertModal from '../modals/AlertModal';

interface CategoryFormProps {
    category: Category | null;
    billboards: Billboard[] | null;
}

const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1)
});

type CategoryFormValues = z.infer<typeof formSchema>;

const CategoryForm: React.FC<CategoryFormProps> = ({ category,billboards }) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = category ? 'Edit Category' : 'Create a cateogry';
    const description = category ? 'Edit Category.' : 'Add a new cateogry.';
    const toastMessage = category ? 'Category updated.' : 'Category created.';
    const action = category ? 'Save changes' : 'Create';

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: category || {
            name: '',
            billboardId: ''
        }
    });

    const onSubmit = async (data: CategoryFormValues) => {

        let toastLoading = '';

        if (category) {
            toastLoading = toast.loading('Changing category name... Please wait.');
        } else {
            toastLoading = toast.loading('Creating category... Please wait.');
        }
        try {
            setLoading(true);

            if (category) {
                const updateCategory = await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data);
                if (updateCategory.status === 200) {
                    router.refresh();
                    toast.dismiss(toastLoading);
                    toast.success(toastMessage);
                } else {
                    toast.dismiss(toastLoading);
                    toast.error(`${updateCategory.status} ${updateCategory.statusText}`);
                }
            } else {
                const createCategory = await axios.post(`/api/${params.storeId}/categories`, data);
                if (createCategory.status === 200) {
                    toast.dismiss(toastLoading);
                    toast.success(toastMessage);
                } else {
                    toast.dismiss(toastLoading);
                    toast.error(`${createCategory.status} ${createCategory.statusText}`);
                }
            }

            router.push(`/${params.storeId}/categories`);


        } catch (error) {
            toast.dismiss(toastLoading);
            toast.error('Something went wrong. Please try again.')
        } finally {
            toast.dismiss(toastLoading);
            setLoading(false);
        }
    };

    const onDelete = async () => {
        const toastLoading = toast.loading('Deleting category... Please wait.');
        try {
            setLoading(true);

            const deleteCategory = await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);

            if (deleteCategory.status === 200) {
                router.refresh();
                toast.dismiss(toastLoading);
                router.push(`/${params.storeId}/categories`);
                toast.success('Category deleted!');
            } else {
                toast.dismiss(toastLoading);
                toast.error(`${deleteCategory.status} ${deleteCategory.statusText}`);
            }

        } catch (error) {
            toast.dismiss(toastLoading);
            toast.error('Make sure you removed all products using this category first.')
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
                    category && (
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
                                    <FormLabel>Category Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Category Name' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='billboardId'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Billboard</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder='Select a Billboard'/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {billboards?.map(billboard => (
                                                <SelectItem key={billboard.id} value={billboard.id}>
                                                    {billboard.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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

export default CategoryForm;