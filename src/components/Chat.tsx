import { Button } from '@nextui-org/button';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { IoSend } from 'react-icons/io5';

import cn from '@/lib/cn';

import TextArea from '@/components/forms/TextArea';

import { api } from '@/utils/api';

export default function Chat() {
  const [chat, setChat] = React.useState<string[]>([]);

  const { mutate, isLoading } = api.chat.send.useMutation({
    onMutate: async (newChat) => {
      reset();
      // Snapshot the previous value
      const previousChats = chat;

      // Optimistically update to the new value
      setChat((prev) => [...prev, newChat.prompt]);

      // Return a context object with the snapshotted value
      return { previousChats };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (_err, _newChats, context) => {
      if (context?.previousChats) setChat(context.previousChats);
    },
    onSuccess: (data) => {
      setChat((prev) => [...prev, data.answer]);
    },
  });
  //#region  //*=========== Form ===========
  const methods = useForm({
    mode: 'onTouched',
  });
  const { handleSubmit, reset, watch } = methods;
  //#endregion  //*======== Form ===========

  const onSubmit = handleSubmit((data) => {
    mutate({ prompt: data.chat });
  });

  return (
    <div className='flex flex-col space-y-2'>
      <div className='space-y-2 overflow-y-auto'>
        {chat?.map((item, index) => (
          <div
            key={index}
            className={cn(
              'bg-secondary rounded-md p-2 text-sm',
              index % 2 === 0 && 'text-right'
            )}
          >
            {item}
          </div>
        ))}
      </div>
      <FormProvider {...methods}>
        <form onSubmit={onSubmit} className='relative'>
          <TextArea
            id='chat'
            label=''
            validation={{ required: 'Chat must be filled' }}
            rows={watch('chat')?.split('\n').length || 1}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
              }
            }}
          />
          <Button
            color='primary'
            type='submit'
            isIconOnly
            className='absolute right-1 top-7 h-8 w-8'
            isLoading={isLoading}
          >
            {!isLoading && <IoSend />}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
