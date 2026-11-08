import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { contactSchema, type ContactInput, type ContactValues } from './contact-schema'

type ContactFormProps = {
  onSubmit: (values: ContactValues) => Promise<void> | void
}

const EMPTY_VALUES: ContactInput = { name: '', email: '', message: '' }

export function ContactForm({ onSubmit }: ContactFormProps) {
  const [status, setStatus] = useState('')
  const form = useForm<ContactInput, unknown, ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: EMPTY_VALUES,
  })

  async function handleValid(values: ContactValues) {
    setStatus('')
    try {
      await onSubmit(values)
      form.reset(EMPTY_VALUES)
      setStatus(`Message sent. Thank you, ${values.name}.`)
    } catch {
      setStatus('The message was not sent. Try again.')
    }
  }

  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(handleValid)} className="grid gap-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input autoComplete="name" {...field} />
              </FormControl>
              <FormDescription>The name we use in our reply.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormDescription>We send the reply to this address.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Ten characters or more.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting} className="justify-self-start">
          Send message
        </Button>
        <p role="status" className="text-sm text-muted-foreground">
          {status}
        </p>
      </form>
    </Form>
  )
}
