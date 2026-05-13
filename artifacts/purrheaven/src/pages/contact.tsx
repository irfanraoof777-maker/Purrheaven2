import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type FormValues = z.infer<typeof schema>;

export default function Contact() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = (_values: FormValues) => {
    setSubmitted(true);
    toast({ title: "Message sent! We'll get back to you soon." });
    form.reset();
  };

  const contacts = [
    { icon: Mail, label: "Email", value: "hello@purrheaven.in" },
    { icon: Phone, label: "Phone", value: "+91 98765 43210" },
    { icon: MapPin, label: "Address", value: "Indiranagar, Bangalore, Karnataka" },
  ];

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-12">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">Contact Us</h1>
          <p className="text-muted-foreground">Have questions? We'd love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info */}
          <div className="space-y-6">
            {contacts.map((c) => (
              <div key={c.label} className="flex items-start gap-4 p-5 bg-card rounded-2xl border border-border/60">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <c.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-0.5">{c.label}</p>
                  <p className="text-sm text-foreground font-medium">{c.value}</p>
                </div>
              </div>
            ))}

            <div className="p-5 bg-primary/5 rounded-2xl border border-primary/20">
              <h3 className="font-serif text-base font-semibold text-foreground mb-2">Fostering enquiries</h3>
              <p className="text-sm text-muted-foreground">
                If you're interested in fostering a specific cat, please use the comment section on the cat's listing page.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2 p-8 bg-card rounded-2xl border border-border/60 shadow-sm">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <CheckCircle className="w-16 h-16 text-primary mb-4" />
                <h3 className="font-serif text-2xl font-bold text-foreground mb-2">Message Sent!</h3>
                <p className="text-muted-foreground mb-6">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input data-testid="input-name" placeholder="Your name" {...field} />
                          </FormControl>
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
                            <Input data-testid="input-email" type="email" placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input data-testid="input-subject" placeholder="How can we help?" {...field} />
                        </FormControl>
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
                          <Textarea
                            data-testid="input-message"
                            placeholder="Tell us more..."
                            className="resize-none"
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    data-testid="button-submit-contact"
                    type="submit"
                    className="w-full"
                    size="lg"
                  >
                    Send Message
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
