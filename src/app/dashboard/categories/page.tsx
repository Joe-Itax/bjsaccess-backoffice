"use client";

import { useCategoriesQuery,  } from "@/hooks/use-posts";
import { Tag } from "@/types/posts";
import AddCategory from "./add-category";
import DeleteCategory from "./delete-category";
export default function TagsPage() {
  const { data: dataCategories = [], isPending } = useCategoriesQuery();
  const categories = dataCategories?.data as Tag[];

  if (isPending) {
    return <div>Chargement</div>;
  }
  return (
    <section className="container max-w-[55rem] size-full mx-auto">
      <div className="w-full p-4 flex flex-col gap-6">
        <div className="flex gap-4">
          <h2 className="text-xl font-medium">Categories Disponible</h2>

          <AddCategory />
        </div>
        <ol className="w-full flex flex-wrap justify-center items-center gap-3">
          {categories?.map((category, i) => (
            <div key={category.id}>
              <li className="flex gap-2 items-center bg-white shadow-xl border rounded-4xl py-2 px-4">
                <span>
                  {" "}
                  {i + 1}. <span>{category.name}</span>
                </span>
                
                <DeleteCategory category={category} />
              </li>
            </div>
          ))}
        </ol>
      </div>
    </section>
  );
}
