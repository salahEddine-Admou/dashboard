"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";

import { BillboardColumn, columns } from "./columns";

interface BillboardClientProps {
  data: BillboardColumn[];
}

export const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Banners (${data.length})`}
          description="Manage Banners for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
          className="border-2 border-orange-500 rounded-lg shadow-lg" // Applied border, rounded corners, and shadow
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <DataTable searchKey="label" columns={columns} data={data} />
      {/* <Heading title="API" description="API calls for Billboards" />
      <Separator /> */}
      {/* <ApiList entityName="billboards" entityIdName="billboardId" /> */}
    </>
  );
};
