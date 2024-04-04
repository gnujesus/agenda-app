import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useState, useEffect } from 'react'


const formSchema = z.object({
  title: z.string().min(2, {
    message: "Titlemust be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Titlemust be at least 2 characters.",
  }),
  date: z.string(),
  startingTime: z.string(),
  endingTime: z.string(),
})



function App() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [today, setToday] = useState();
  const [events, setEvents] = useState({});
  const [data, setData] = useState();

  useEffect(() => {
    fetch('http://localhost:8081/')
      .then(response => response.json())
      .then(data => {
        setData(data)
        console.log(data)
      })
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(Date.now()).toDateString(),
      startingTime: "",
      endingTime: "",
    },
  })

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)

    try {
      const response = await fetch('http://localhost:8081/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values)
      });
      if (!response.ok) throw new Error('Network response was not ok');

    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  }

  async function handleDelete(id) {
    console.log(id)

    try {
      const response = await fetch('http://localhost:8081/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id })
      });
      if (!response.ok) throw new Error('Network response was not ok');

    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  }

  async function handlePut(values: z.infer<typeof formSchema>) {
    const { title, description, date, startingTime, endingTime } = values; // Destructure relevant properties
    console.log(title, description, date, startingTime, endingTime)

    try {
      const response = await fetch('http://localhost:8081/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, date, startingTime, endingTime }),
      });
      if (!response.ok) throw new Error('Network response was not ok');

    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  }

  return (
    <div>
      <header className="px-2 py-5 space-y-2 sticky top-0 bg-white">
        <Calendar
          mode="single"
          selected={today}
          onSelect={setToday}
          className="rounded-md border flex justify-center"
        />
      </header>

      <div className="overflow-y-scroll space-y-2 w-full">
        {
          data &&
          data.map((object) => (
            <AlertDialog>
              <AlertDialogTrigger className="flex justify-center w-full">
                <Card className="border h-full text-left w-[96%] px-2 flex flex-row-reverse">
                  <CardHeader className="space-y-2">
                    <CardTitle>{object.Name}</CardTitle>
                    <CardDescription>{object.Description}</CardDescription>
                  </CardHeader>
                  <CardContent className="self-center text-black/50 mt-55">
                    <p>{object.StartingTime}</p>
                    <p className="text-sm">{object.EndingTime}</p>
                  </CardContent>
                </Card>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Event Editor</AlertDialogTitle>

                  <AlertDialogDescription>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handlePut)} className="space-y-8 text-black">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder={object.Name} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />


                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea placeholder={object.Description} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date</FormLabel>
                              <FormControl>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-[280px] justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                      )}
                                    >
                                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={object.Date}
                                      onSelect={setDate}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />


                        <FormField
                          control={form.control}
                          name="startingTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Starting time</FormLabel>
                              <FormControl>
                                <Input placeholder={object.StartingTime} {...field} value={object.StartingTime} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="endingTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ending Time</FormLabel>
                              <FormControl>
                                <Input placeholder={object.EndingTime} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" className="w-full">Edit</Button>
                      </form>
                    </Form>

                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Close</AlertDialogCancel>
                  <Button variant="ghost" className="w-full border border-red-500 text-red-500 hover:text-red-500 hover:bg-white active:border-transparent active:text-white active:bg-red-500" onClick={() => { handleDelete(object.Id) }}>Delete</Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ))
        }
      </div>

      <AlertDialog>
        <AlertDialogTrigger className="absolute right-5 bottom-5 border rounded-full p-4"><svg className="w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" /></svg></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add new activity to the agenda</AlertDialogTitle>
            <AlertDialogDescription>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="This is the title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="This is the description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[280px] justify-start text-left font-normal",
                                  !date && "text-muted-foreground"
                                )}
                              >
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


                  <FormField
                    control={form.control}
                    name="startingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Starting time</FormLabel>
                        <FormControl>
                          <Input placeholder="Time when the event starts (HH:mm)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ending Time</FormLabel>
                        <FormControl>
                          <Input placeholder="Time when the event ends (HH:mm)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">Submit</Button>
                </form>
              </Form>

            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default App
