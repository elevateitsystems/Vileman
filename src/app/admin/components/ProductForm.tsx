"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { categories } from "@/lib/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const productSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().positive("Price must be positive"),
  delivery: z.string().optional(),
  shortDescription: z.string().min(1, "Short description is required"),
  description: z.string().min(1, "Full description is required"),
  dimensions: z.string().min(1, "Dimensions are required"),
  print: z.string().min(1, "Print info is required"),
  paper: z.string(),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  categoryId: z.string().min(1, "Category is required"),
  color: z.string().optional(),
  quantity: z.coerce.number().int().nonnegative().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  categories: any[];
  initialData?: Partial<ProductFormValues>;
  onSubmit: (data: ProductFormValues) => void;
  isSubmitting?: boolean;
}

export function ProductForm({ categories, initialData, onSubmit, isSubmitting }: ProductFormProps) {
  const [previews, setPreviews] = useState<string[]>(initialData?.images || (initialData?.image ? [initialData.image] : []));
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: initialData || {
      slug: "",
      name: "",
      price: 0,
      delivery: "",
      shortDescription: "",
      description: "",
      dimensions: "",
      print: "",
      paper: "",
      image: "",
      images: [],
      categoryId: "",
      color: "",
      quantity: 0,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles);
    setFiles((prev) => [...prev, ...newFiles]);

    const newPreviews: string[] = [];
    const currentImages = form.getValues("images") || [];

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        newPreviews.push(result);
        if (newPreviews.length === newFiles.length) {
          const updatedImages = [...currentImages, ...newPreviews];
          setPreviews(updatedImages);
          form.setValue("images", updatedImages);
          if (!form.getValues("image")) {
            form.setValue("image", updatedImages[0]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const onFormSubmit = (data: ProductFormValues) => {
    onSubmit({ ...data, fileObjects: files } as any);
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images") || [];
    const updatedImages = currentImages.filter((_, i) => i !== index);
    
    // Also remove from files state if it was a newly added file
    // The newly added files are at the end of the previews/images array
    // Count how many existing images we had
    const initialCount = (initialData?.images?.length || (initialData?.image ? 1 : 0));
    if (index >= initialCount) {
      const fileIndex = index - initialCount;
      setFiles(prev => prev.filter((_, i) => i !== fileIndex));
    }

    setPreviews(updatedImages);
    form.setValue("images", updatedImages);
    
    if (form.getValues("image") === currentImages[index]) {
      form.setValue("image", updatedImages[0] || "");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="E.g. Classic Mug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. classic-mug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (€)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
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
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <span className="flex flex-1 text-left text-sm" data-slot="select-value">
                        {field.value
                          ? categories.find(c => c.id === field.value)?.name || "Select a category"
                          : <span className="text-muted-foreground">Select a category</span>
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

          <div className="col-span-full space-y-4">
            <FormLabel>Product Images</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {previews.map((src, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
                  <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-white/80 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                  {form.getValues("image") === src && (
                    <div className="absolute bottom-0 inset-x-0 bg-brand-primary/90 text-white text-[10px] py-0.5 text-center font-bold">
                      PRIMARY
                    </div>
                  )}
                  {form.getValues("image") !== src && (
                    <button
                      type="button"
                      onClick={() => form.setValue("image", src)}
                      className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity"
                    >
                      SET PRIMARY
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:border-brand-primary hover:bg-brand-primary/5 transition-all text-gray-400 hover:text-brand-primary"
              >
                <Upload className="h-6 w-6" />
                <span className="text-xs font-medium">Upload</span>
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden"
            />
            <FormMessage>{form.formState.errors.image?.message}</FormMessage>
          </div>

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


        </div>

        {/* Descriptions */}
        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Input placeholder="Brief summary..." {...field} />
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
              <FormLabel>Full Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detailed product information..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="dimensions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dimensions</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 10x10 cm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="print"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Print Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Sublimation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paper"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paper/Material</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Ceramic" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-primary hover:bg-brand-primary/90"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Save Product
        </Button>
      </form>
    </Form>
  );
}
