import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useGetMe,
  useCreateCat,
  getListCatsQueryKey,
  getGetMyListingsQueryKey,
  getGetMeQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { INDIAN_CITIES } from "@/lib/constants";

const TEMPERAMENTS = ["Playful", "Calm", "Shy", "Affectionate", "Curious", "Independent", "Energetic"];

const schema = z.object({
  name: z.string().min(1, "Cat name is required"),
  age: z.coerce.number().min(1, "Age must be at least 1"),
  ageUnit: z.string().min(1),
  breed: z.string().optional(),
  color: z.string().optional(),
  temperament: z.string().optional(),
  goodWithKids: z.boolean().optional(),
  goodWithDogs: z.boolean().optional(),
  spayedNeutered: z.boolean(),
  healthNotes: z.string().min(1, "Please describe the cat's health"),
  city: z.string().min(1, "City is required"),
  photo1: z.string().url("Please enter a valid image URL").min(1),
  photo2: z.string().url("Please enter a valid image URL").min(1),
});
type FormValues = z.infer<typeof schema>;

export default function PostCat() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: me, isError } = useGetMe({ query: { retry: false, queryKey: getGetMeQueryKey() } });
  const createCat = useCreateCat();
  const [photo1Preview, setPhoto1Preview] = useState<string>("");
  const [photo2Preview, setPhoto2Preview] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      age: 1,
      ageUnit: "months",
      breed: "",
      color: "",
      temperament: "",
      goodWithKids: undefined,
      goodWithDogs: undefined,
      spayedNeutered: false,
      healthNotes: "",
      city: "",
      photo1: "",
      photo2: "",
    },
  });

  if (isError || !me) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Login Required</h2>
        <p className="text-muted-foreground mb-6">You must be logged in to post a cat.</p>
        <Button onClick={() => setLocation("/login")} data-testid="button-go-to-login">
          Login to continue
        </Button>
      </div>
    );
  }

  const onSubmit = (values: FormValues) => {
    createCat.mutate(
      { data: values },
      {
        onSuccess: (cat) => {
          queryClient.invalidateQueries({ queryKey: getListCatsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetMyListingsQueryKey() });
          toast({ title: "Cat listed successfully!" });
          setLocation(`/cats/${cat.id}`);
        },
        onError: () => {
          toast({ title: "Failed to create listing", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-10">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">Post a Cat</h1>
          <p className="text-muted-foreground">
            Listing as <span className="font-medium text-foreground">{me.username}</span>
          </p>
        </div>

        <div className="p-8 bg-card rounded-2xl border border-border/60 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cat Name *</FormLabel>
                    <FormControl>
                      <Input data-testid="input-cat-name" placeholder="e.g. Mochi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Age */}
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Age *</FormLabel>
                      <FormControl>
                        <Input
                          data-testid="input-cat-age"
                          type="number"
                          min={1}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ageUnit"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Unit</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger data-testid="select-age-unit">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="months">Months</SelectItem>
                          <SelectItem value="years">Years</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Breed & Color */}
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="breed"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Breed</FormLabel>
                      <FormControl>
                        <Input data-testid="input-breed" placeholder="e.g. Tabby, Persian" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Colour</FormLabel>
                      <FormControl>
                        <Input data-testid="input-color" placeholder="e.g. Orange & White" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Temperament */}
              <FormField
                control={form.control}
                name="temperament"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperament</FormLabel>
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger data-testid="select-temperament">
                          <SelectValue placeholder="Select temperament" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TEMPERAMENTS.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Good with kids / dogs */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="goodWithKids"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Good with kids?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          data-testid="radio-good-with-kids"
                          value={field.value === true ? "yes" : field.value === false ? "no" : ""}
                          onValueChange={(v) => field.onChange(v === "yes" ? true : v === "no" ? false : undefined)}
                          className="flex gap-4 mt-1"
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="yes" id="kids-yes" />
                            <Label htmlFor="kids-yes">Yes</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="no" id="kids-no" />
                            <Label htmlFor="kids-no">No</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="goodWithDogs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Good with dogs?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          data-testid="radio-good-with-dogs"
                          value={field.value === true ? "yes" : field.value === false ? "no" : ""}
                          onValueChange={(v) => field.onChange(v === "yes" ? true : v === "no" ? false : undefined)}
                          className="flex gap-4 mt-1"
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="yes" id="dogs-yes" />
                            <Label htmlFor="dogs-yes">Yes</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="no" id="dogs-no" />
                            <Label htmlFor="dogs-no">No</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Spayed/Neutered */}
              <FormField
                control={form.control}
                name="spayedNeutered"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Spayed or Neutered? *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        data-testid="radio-spayed"
                        value={field.value ? "yes" : "no"}
                        onValueChange={(v) => field.onChange(v === "yes")}
                        className="flex gap-6 mt-1"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="yes" id="yes" data-testid="radio-yes" />
                          <Label htmlFor="yes">Yes</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="no" id="no" data-testid="radio-no" />
                          <Label htmlFor="no">No</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Health Notes */}
              <FormField
                control={form.control}
                name="healthNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Any Infections or Allergies? *</FormLabel>
                    <FormControl>
                      <Textarea
                        data-testid="input-health-notes"
                        placeholder="Describe the cat's health status..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger data-testid="select-city">
                          <SelectValue placeholder="Select a city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {INDIAN_CITIES.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Photo 1 */}
              <FormField
                control={form.control}
                name="photo1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo 1 URL *</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="input-photo1"
                        placeholder="https://..."
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setPhoto1Preview(e.target.value);
                        }}
                      />
                    </FormControl>
                    {photo1Preview && (
                      <div className="mt-2 aspect-video rounded-xl overflow-hidden bg-muted">
                        <img
                          src={photo1Preview}
                          alt="Preview 1"
                          className="w-full h-full object-cover"
                          onError={() => setPhoto1Preview("")}
                        />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Photo 2 */}
              <FormField
                control={form.control}
                name="photo2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo 2 URL *</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="input-photo2"
                        placeholder="https://..."
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setPhoto2Preview(e.target.value);
                        }}
                      />
                    </FormControl>
                    {photo2Preview && (
                      <div className="mt-2 aspect-video rounded-xl overflow-hidden bg-muted">
                        <img
                          src={photo2Preview}
                          alt="Preview 2"
                          className="w-full h-full object-cover"
                          onError={() => setPhoto2Preview("")}
                        />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                data-testid="button-submit-cat"
                type="submit"
                className="w-full"
                size="lg"
                disabled={createCat.isPending}
              >
                {createCat.isPending ? "Posting..." : "Post Cat for Fostering"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
