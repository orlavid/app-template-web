import { useState } from 'react'

import { ContactForm } from '@/components/contact-form/ContactForm'
import type { ContactValues } from '@/components/contact-form/contact-schema'
import { ThemeToggle } from '@/components/theme-toggle/ThemeToggle'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type SentMessage = ContactValues & { id: number }

export default function App() {
  const [sent, setSent] = useState<readonly SentMessage[]>([])

  function handleSubmit(values: ContactValues) {
    setSent((current) => [...current, { ...values, id: current.length + 1 }])
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
          <p className="font-heading text-sm font-semibold tracking-tight">App template</p>
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto grid max-w-3xl gap-8 px-4 py-10">
        <section aria-labelledby="page-heading" className="grid gap-2">
          <h1 id="page-heading" className="font-heading text-3xl font-semibold tracking-tight">
            Contact us
          </h1>
          <p className="text-muted-foreground">
            This example page shows the template rules: shadcn/ui primitives, design tokens, and a
            validated form.
          </p>
        </section>
        <Card>
          <CardHeader>
            <CardTitle>
              <h2>Send a message</h2>
            </CardTitle>
            <CardDescription>All fields are necessary.</CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm onSubmit={handleSubmit} />
          </CardContent>
        </Card>
        <section aria-labelledby="sent-heading" className="grid gap-3">
          <h2 id="sent-heading" className="font-heading text-xl font-semibold tracking-tight">
            Sent messages
          </h2>
          <Table>
            <TableCaption>Messages sent in this session.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Name</TableHead>
                <TableHead scope="col">Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sent.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-muted-foreground">
                    No messages yet.
                  </TableCell>
                </TableRow>
              ) : (
                sent.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>{message.name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </section>
      </main>
    </div>
  )
}
