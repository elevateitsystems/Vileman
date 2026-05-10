"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Database, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { categories as staticCategories } from "@/lib/products";
import { 
  createCategory, 
  createSubCategory, 
  createProduct,
  fetchCategories,
  fetchSubCategories,
  fetchProducts
} from "@/lib/api";

export default function SeedPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string[]>([]);
  const token = useAuth((state) => state.token);

  const addStatus = (msg: string) => {
    setStatus((prev) => [...prev, msg]);
  };

  const handleSeed = async () => {
    if (!token) {
      toast.error("You must be logged in to seed data");
      return;
    }

    setIsLoading(true);
    setStatus([]);
    addStatus("Starting seeding process...");

    try {
      // 1. Map to track created IDs
      const categoryMap = new Map<string, string>(); // slug -> id
      const subCategoryMap = new Map<string, string>(); // slug -> id

      // 2. Identify Parent Categories and Sub-categories
      // In the static data, parents have 'subcategory' property.
      const parents = staticCategories.filter(c => c.subcategory && c.subcategory.length > 0);
      const standalones = staticCategories.filter(c => !parents.includes(c) && !staticCategories.some(p => p.subcategory?.some(s => s.slug === c.slug)));

      addStatus(`Found ${parents.length} parent categories and ${standalones.length} standalone categories.`);

      // 3. Create Parent Categories
      for (const parent of parents) {
        addStatus(`Creating category: ${parent.name}...`);
        try {
          // Bundle extra fields into description
          const metadata = {
            heading: parent.heading,
            heroImage: parent.heroImage,
            mainImage: parent.mainImage,
            gallery: parent.gallery,
            ctaHref: parent.ctaHref
          };
          const created = await createCategory(token, {
            name: parent.name,
            description: JSON.stringify({
              text: parent.description,
              metadata
            })
          });
          categoryMap.set(parent.slug, created.id);
          addStatus(`✓ Category ${parent.name} created with ID: ${created.id}`);

          // 4. Create Sub-categories for this parent
          if (parent.subcategory) {
            for (const sub of parent.subcategory) {
              addStatus(`  Creating sub-category: ${sub.name}...`);
              const subMetadata = {
                image: sub.image,
                price: sub.price,
                shortDescription: sub.shortDescription,
                color: sub.color,
                dimensions: sub.dimensions,
                print: sub.print,
                paper: sub.paper,
                delivery: sub.delivery
              };
              const createdSub = await createSubCategory(token, {
                name: sub.name,
                description: JSON.stringify({
                  text: sub.description || "",
                  metadata: subMetadata
                }),
                categoryId: created.id
              });
              subCategoryMap.set(sub.slug, createdSub.id);
              addStatus(`  ✓ Sub-category ${sub.name} created with ID: ${createdSub.id}`);
            }
          }
        } catch (err: any) {
          addStatus(`✗ Failed to create category ${parent.name}: ${err.message}`);
        }
      }

      // 5. Create Standalone Categories (if any)
      for (const standalone of standalones) {
        addStatus(`Creating standalone category: ${standalone.name}...`);
        try {
          const metadata = {
            heading: standalone.heading,
            heroImage: standalone.heroImage,
            mainImage: standalone.mainImage,
            gallery: standalone.gallery,
            ctaHref: standalone.ctaHref
          };
          const created = await createCategory(token, {
            name: standalone.name,
            description: JSON.stringify({
              text: standalone.description,
              metadata
            })
          });
          categoryMap.set(standalone.slug, created.id);
          addStatus(`✓ Standalone category ${standalone.name} created.`);
        } catch (err: any) {
          addStatus(`✗ Failed to create standalone category ${standalone.name}: ${err.message}`);
        }
      }

      // 6. Create Products
      addStatus("Creating products...");
      for (const catEntry of staticCategories) {
        if (!catEntry.items || catEntry.items.length === 0) continue;

        // Find parent category and sub-category for these items
        let categoryId = categoryMap.get(catEntry.slug);
        let subCategoryId = subCategoryMap.get(catEntry.slug);

        // If this entry is a sub-category, we need its parent's ID
        if (subCategoryId) {
           const parent = parents.find(p => p.subcategory?.some(s => s.slug === catEntry.slug));
           if (parent) {
             categoryId = categoryMap.get(parent.slug);
           }
        }

        if (!categoryId) {
          addStatus(`! Warning: Could not find category ID for ${catEntry.name}. Skipping items.`);
          continue;
        }

        addStatus(`Processing ${catEntry.items.length} items for ${catEntry.name}...`);

        for (const item of catEntry.items) {
          try {
            await createProduct(token, {
              name: item.name,
              description: item.description || item.shortDescription,
              price: item.price.toString(),
              images: [item.image],
              categoryId: categoryId,
              subCategoryId: subCategoryId || "",
              colors: item.color ? [item.color] : ["Standard"],
              quantity: item.quantity || 100
            });
            addStatus(`  ✓ Product ${item.name} created.`);
          } catch (err: any) {
            addStatus(`  ✗ Failed to create product ${item.name}: ${err.message}`);
          }
        }
      }

      addStatus("Seeding process completed!");
      toast.success("Seeding completed!");
    } catch (error: any) {
      addStatus(`Critical Error: ${error.message}`);
      toast.error("Seeding failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-brand-primary/10 p-3 rounded-full">
            <Database className="h-8 w-8 text-brand-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-primary">Data Seeding Utility</h1>
            <p className="text-gray-500">Migrate static product data to the backend database.</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 flex gap-4">
          <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-amber-900">Warning</h3>
            <p className="text-amber-800 text-sm">
              This process will create duplicate records if run multiple times. Ensure your backend is ready for initial seeding.
            </p>
          </div>
        </div>

        <Button 
          onClick={handleSeed} 
          disabled={isLoading || !token}
          className="w-full h-14 text-lg font-bold bg-brand-primary hover:bg-brand-primary/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Seeding Data...
            </>
          ) : (
            "Start Seeding Process"
          )}
        </Button>

        {status.length > 0 && (
          <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200 font-mono text-sm max-h-[400px] overflow-y-auto">
            {status.map((msg, i) => (
              <div key={i} className={`mb-1 ${msg.startsWith('✓') ? 'text-green-600' : msg.startsWith('✗') ? 'text-red-600' : 'text-gray-700'}`}>
                {msg}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
