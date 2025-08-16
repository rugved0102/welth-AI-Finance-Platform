"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import useFetch from "@/hooks/use-fetch";
import { updateDefaultAccount } from "@/actions/account";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";
import { useRouter } from "next/navigation";

const AccountCard = ({ account }) => {
  const { name, type, balance, id, isDefault } = account;
  const router = useRouter();
    const {
        loading: updateDefaultLoading,
        fn: updateDefaultFn,
        data: updatedAccount,
        error, 
    } = useFetch(updateDefaultAccount)

    const [navLoading, setNavLoading] = useState(false);

    const handleCardClick = (e) => {
    e.preventDefault();
    setNavLoading(true); // show loader
    router.push(`/account/${id}`); // navigate
  };

    const handleDefaultChange = async (event) => {
        event.preventDefault();

        if(isDefault) {
            toast.warning("You need atleast 1 default account")
            return; // Don't allow toggling off the default account
        }

        await updateDefaultFn(id)
    }

    useEffect(() => {
        if(updatedAccount?.success) {
            toast.success("Default account updated successfully")
        }
    }, [updatedAccount, updateDefaultLoading])

    useEffect(() => {
        if(error) {
            toast.error("error.message" || "Failed to update default account")
        }
    }, [error])

  return (
    <Card className={"hover:shadow-md transition-shadow group relative cursor-pointer"}
      onClick={handleCardClick}
    >
      {/* <Link href={`/account/${id}`}> */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium capitalize">{name}</CardTitle>

           {(updateDefaultLoading || navLoading) ? ( // ✅ show loader if toggling OR navigating
          <BarLoader color="#3b82f6" height={3} width={60} />
        ) : (
          <Switch
            checked={isDefault}
            onClick={handleDefaultChange}
            disabled={updateDefaultLoading}
          />
        )}

          {/* <Switch checked={isDefault} onClick = {handleDefaultChange}
          disabled={updateDefaultLoading}/> */}

        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" /> Expense
          </div>
        </CardFooter>
      {/* </Link> */}
    </Card>
  );
};

export default AccountCard;
