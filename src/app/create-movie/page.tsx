"use client";
import CreateEditForm from "../components/common/createEditForm";
import ShapeBackground from "../components/common/backgroundShape";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getToken } from "@/utils/token";

export default function CreateMovie() {
  const router = useRouter();
  const checkAuthAndRedirect = useCallback(() => {
    const token = getToken();
    if (!token) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    checkAuthAndRedirect();
  }, [checkAuthAndRedirect]);
  return (
    <main className="bg-[#093545]">
      <div className="lg:max-w-screen-xl mx-auto lg:pb-[120px] pb-20 lg:px-0 px-6">
        <div className="lg:py-[120px] py-20">
          <h2 className="lg:text-[48px] text-[32px] font-semibold lg:leading-[56px] leading-[40px] text-white text-left">
            Create a new movie
          </h2>
        </div>
        <CreateEditForm />
      </div>
      <div className="">
        <ShapeBackground />
      </div>
    </main>
  );
}
