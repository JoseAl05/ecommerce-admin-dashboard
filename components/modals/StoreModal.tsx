'use client'

import * as z from 'zod';
import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';

import { useStoreModal } from '@/app/hooks/useStoreModal';
import { Modal } from '../ui/modal';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const formSchema = z.object({
    name: z.string().min(1),
});

export const StoreModal = () => {
    const storeModal = useStoreModal();

    const [loading,setLoading] = useState(false);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const loadingToast = toast.loading('Creating the store... Please wait.');

            const response = await axios.post('/api/stores',values);


            if(response.status === 200){
                toast.dismiss(loadingToast);
                window.location.assign(`/${response.data.id}`);
            } else {
                toast.dismiss(loadingToast);
                toast.error(`${response.status} ${response.statusText}`);
            }
        } catch (error) {
            toast.error(error.message)
            console.log('[ON SUBMIT CREATE STORE]',error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            title='Create store'
            description='Add a new store to manage products and categories'
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
        >
            <div>
                <div className='space-y-4 py-2 pb-4'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder='E-Commerce'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <div className='flex items-center justify-end w-full pt-6 space-x-2'>
                                <Button
                                    disabled={loading}
                                    variant='outline'
                                    onClick={storeModal.onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    disabled={loading}
                                    type='submit'
                                >
                                    Continue
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )
}