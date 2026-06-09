//components/EditProductForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";

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
  images: z.array(z.any()).optional(),
  categoryId: z.string().min(1, "Category is required"),
  subCategoryId: z.string().optional(),
  color: z.string().optional(),
  quantity: z.coerce.number().int().nonnegative().optional(),
  isCustomizable: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface EditProductFormProps {
  categories: any[];
  initialData: any;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

export function EditProductForm({
  categories,
  initialData,
  onSubmit,
  isSubmitting,
}: EditProductFormProps) {
  // We keep track of existing images and newly added files separately
  const [existingImages, setExistingImages] = useState<any[]>(
    initialData?.images || [],
  );
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [primaryImage, setPrimaryImage] = useState<string>(
    initialData?.image || initialData?.images?.[0]?.url || "",
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      ...initialData,
      images: initialData?.images || [],
    },
  });

  // Synchronize state when initialData changes
  useEffect(() => {
    if (initialData) {
      const initialImages = initialData.images || [];
      setExistingImages(initialImages);

      // Map primary image: either top-level image field or the first image from the array
      const initialPrimary = initialData.image || initialImages[0]?.url || "";
      setPrimaryImage(initialPrimary);

      form.reset({
        ...initialData,
        images: initialImages,
      });
    }
  }, [initialData, form]);

  const selectedCategoryId = form.watch("categoryId");
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const subCategories = selectedCategory?.subcategory || [];
  const hasSubCategories = subCategories.length > 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const filesArray = Array.from(selectedFiles);
    setNewFiles((prev) => [...prev, ...filesArray]);

    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (id: string, index: number) => {
    const imgToRemove = existingImages[index];
    setDeletedImageIds((prev) => [...prev, id]);
    setExistingImages((prev) => prev.filter((_, i) => i !== index));

    // If the removed image was primary, pick the next available one
    if (primaryImage === imgToRemove.url) {
      const nextExisting = existingImages.find((_, i) => i !== index);
      if (nextExisting) {
        setPrimaryImage(nextExisting.url);
      } else if (newPreviews.length > 0) {
        setPrimaryImage(newPreviews[0]);
      } else {
        setPrimaryImage("");
      }
    }
  };

  const removeNewImage = (index: number) => {
    const previewToRemove = newPreviews[index];
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
    setNewFiles((prev) => prev.filter((_, i) => i !== index));

    if (primaryImage === previewToRemove) {
      if (existingImages.length > 0) {
        setPrimaryImage(existingImages[0].url);
      } else if (newPreviews.length > 1) {
        setPrimaryImage(newPreviews.filter((_, i) => i !== index)[0]);
      } else {
        setPrimaryImage("");
      }
    }
  };

  const onFormSubmit = (data: ProductFormValues) => {
    onSubmit({
      ...data,
      image: primaryImage,
      fileObjects: newFiles,
      deleteimageIds: deletedImageIds,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue("subCategoryId", "");
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category">
                        {field.value
                          ? categories.find((c) => c.id === field.value)?.name
                          : "Select a category"}
                      </SelectValue>
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
            name="subCategoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sub Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!hasSubCategories}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          hasSubCategories
                            ? "Select a sub-category"
                            : "No sub-categories"
                        }
                      >
                        {field.value
                          ? subCategories.find((s: any) => s.id === field.value)
                              ?.name
                          : hasSubCategories
                            ? "Select a sub-category"
                            : "No sub-categories"}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subCategories.map((sub: any) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name}
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
              {/* Existing Images */}
              {existingImages.map((img, index) => (
                <ExistingImagePreview
                  key={img.id}
                  img={img}
                  index={index}
                  primaryImage={primaryImage}
                  setPrimaryImage={setPrimaryImage}
                  removeExistingImage={removeExistingImage}
                />
              ))}

              {/* New Previews */}
              {newPreviews.map((src, index) => (
                <div
                  key={`new-${index}`}
                  className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group"
                >
                  <Image
                    src={src}
                    alt={`New Preview ${index}`}
                    className="w-full h-full object-contain"
                    width={200}
                    height={200}
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-1 right-1 p-1 bg-white/80 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                  {primaryImage === src && (
                    <div className="absolute bottom-0 inset-x-0 bg-brand-primary text-white text-[10px] py-0.5 text-center font-bold">
                      PRIMARY
                    </div>
                  )}
                  {primaryImage !== src && (
                    <button
                      type="button"
                      onClick={() => setPrimaryImage(src)}
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

          <FormField
            control={form.control}
            name="isCustomizable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <FormLabel>Customizable Product</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Allow customers to customize this product.
                  </p>
                </div>

                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

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
          Update Product
        </Button>
      </form>
    </Form>
  );
}

function ExistingImagePreview({
  img,
  index,
  primaryImage,
  setPrimaryImage,
  removeExistingImage,
}: any) {
  const [src, setSrc] = useState(img.url || "/assets/placeholder.svg");
  console.log({ src }, { url:img.url });
  return (
    <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
      <Image
        src={src}
        alt={`Product ${index}`}
        className="w-full h-full object-contain"
        width={200}
        height={200}
        // unoptimized={src.startsWith("http")}
        onError={() => setSrc("/assets/placeholder.svg")}
      />
      <button
        type="button"
        onClick={() => removeExistingImage(img.id, index)}
        className="absolute top-1 right-1 p-1 bg-white/80 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4 text-red-500" />
      </button>
      {primaryImage === img.url && (
        <div className="absolute bottom-0 inset-x-0 bg-brand-primary text-white text-[10px] py-0.5 text-center font-bold">
          PRIMARY
        </div>
      )}
      {primaryImage !== img.url && (
        <button
          type="button"
          onClick={() => setPrimaryImage(img.url)}
          className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity"
        >
          SET PRIMARY
        </button>
      )}
    </div>
  );
}
