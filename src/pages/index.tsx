import { Button } from '@nextui-org/button';
import { useMutation } from '@tanstack/react-query';
import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { HiOutlinePaperClip, HiX } from 'react-icons/hi';

import cn from '@/lib/cn';

import Chat from '@/components/Chat';
import DropzoneInput from '@/components/forms/DropzoneInput';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import { api, httpClient } from '@/utils/api';

export default function HomePage() {
  const invalidateGetDocument = api.useContext().document.get.invalidate;
  const { data } = api.document.get.useQuery();
  const deleteDocument = api.document.delete.useMutation({
    onSuccess: () => {
      invalidateGetDocument();
    },
  });

  //#region  //*=========== Form ===========
  const methods = useForm({
    mode: 'onTouched',
  });
  const { handleSubmit, reset } = methods;
  //#endregion  //*======== Form ===========

  const uploadDocument = useMutation({
    mutationKey: ['upload'],
    mutationFn: async (file) => {
      await httpClient.postForm('/save_document', {
        document: file,
      });
    },
    onSuccess: () => {
      reset();
      invalidateGetDocument();
    },
  });

  const onSubmit = handleSubmit((data) => {
    uploadDocument.mutate(data.file[0]);
  });

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <div className='layout min-h-main relative flex flex-row flex-wrap gap-4 py-12'>
          <div className='w-1/3 min-w-[288px] flex-initial space-y-4'>
            <ul
              className={cn(
                'mt-1 w-full divide-y divide-gray-200 rounded-md',
                data?.files?.length && 'border border-gray-300'
              )}
            >
              {data?.files?.map((item) => (
                <li
                  key={item}
                  className='flex items-center justify-between py-3 pl-3 pr-4 text-sm'
                >
                  <div className='flex w-0 flex-1 items-center'>
                    <HiOutlinePaperClip
                      className='h-5 w-5 flex-shrink-0 text-gray-400'
                      aria-hidden='true'
                    />
                    <span className='ml-2 w-0 flex-1 truncate'>{item}</span>
                  </div>
                  <div className='ml-4 flex flex-shrink-0 items-center space-x-2'>
                    <Button
                      color='danger'
                      variant='light'
                      type='submit'
                      isIconOnly
                      size='sm'
                      isLoading={
                        deleteDocument.isLoading &&
                        deleteDocument.variables?.filename === item
                      }
                      onClick={() => {
                        deleteDocument.mutate({ filename: item });
                      }}
                    >
                      {!(
                        deleteDocument.isLoading &&
                        deleteDocument.variables?.filename === item
                      ) && <HiX size={20} />}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <FormProvider {...methods}>
              <form onSubmit={onSubmit} className='w-full max-w-sm space-y-3'>
                <DropzoneInput
                  id='file'
                  label=''
                  validation={{ required: 'Photo must be filled' }}
                  accept={{ 'application/pdf': ['.pdf'] }}
                  helperText='You can upload file with .pdf extension'
                  maxSize={1024 * 1024 * 10}
                />
                <Button
                  color='primary'
                  type='submit'
                  className='w-full'
                  isLoading={uploadDocument.isLoading}
                >
                  {uploadDocument.isLoading ? 'Uploading...' : 'Upload'}
                </Button>
              </form>
            </FormProvider>
          </div>
          <div className='min-w-[288px] flex-1'>
            <Chat />
          </div>
        </div>
      </main>
    </Layout>
  );
}
