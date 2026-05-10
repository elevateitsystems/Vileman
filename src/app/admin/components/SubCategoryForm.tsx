"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form as FormUI, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const subCategorySchema = z.object({
  name: z.string().min(1, "Subcategory name is required"),
  categoryId: z.string().min(1, "Parent category is required"),
  description: z.string().optional(),
});

type SubCategoryFormValues = z.infer<typeof subCategorySchema>;

interface SubCategoryFormProps {
  categories: any[];
  onSubmit: (data: SubCategoryFormValues) => void;
  initialData?: SubCategoryFormValues;
}

export function SubCategoryForm({ categories, onSubmit, initialData }: SubCategoryFormProps) {
  const form = useForm<SubCategoryFormValues>({
    resolver: zodResolver(subCategorySchema),
    defaultValues: initialData || {
      name: "",
      categoryId: "",
      description: "",
    },
  });

  return (
    <FormUI {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subcategory Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Wall Art" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <span className="flex flex-1 text-left text-sm" data-slot="select-value">
                      {field.value
                        ? categories.find(c => c.id === field.value)?.name || "Select parent category"
                        : <span className="text-muted-foreground">Select parent category</span>
                      }
                    </span>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Brief description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-brand-primary hover:bg-brand-primary/90"
        >
          {initialData ? "Update Subcategory" : "Create Subcategory"}
        </Button>
      </form>
    </FormUI>
  );
}
