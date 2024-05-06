"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useOrganization } from "@clerk/nextjs";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePathname, useRouter } from "next/navigation";
import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";
import { fetchUser, fetchUserSingle } from "@/lib/actions/user.actions";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useToast } from "@/components/ui/use-toast";
function PostThread({
  userId,
  repost,
  content,
  author,
  community,
}: {
  userId: string;
  repost: boolean;
  content: string;
  author: string;
  community: string;
}) {
  const organization = useOrganization();
  const { toast } = useToast();

  const router = useRouter();
  const pathname = usePathname();
  const [userData, setUserData] = useState<any>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>({
    forValue: [],
    forPreview: [],
  });

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: repost ? content : "",
      images: [],
      accountId: userId,
    },
  });

  useEffect(() => {
    // Fetch user data
    fetchUserSingle(userId)
      .then((user) => {
        setUserData(user);
      })
      .catch((error) => {
        // Handle error
        throw new Error("Error while fetching user" + error);
      });
  }, [userId]);
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Check for duplicate files
    const duplicateFiles = files.filter((file) =>
      selectedImages.forPreview.some(
        (selectedFile) => selectedFile.name === file.name
      )
    );

    // Print warning for duplicate files
    if (duplicateFiles.length > 0) {
      console.warn("Warning: Duplicate files detected:", duplicateFiles);
      toast({
        title: "File already exist",
        description: "Please change the file",
        duration: 1500,
      });
      return;
    }

    let uniqueFiles = files.filter(
      (file) =>
        !selectedImages.forPreview.some(
          (selectedFile) => selectedFile.name === file.name
        )
    );

    setSelectedImages((prevImages) => ({
      ...prevImages,
      forPreview: [...prevImages.forPreview, ...uniqueFiles],
    }));

    // Convert each file to base64 string
    Promise.all(files.map((file) => readFileAsBase64(file)))
      .then((base64Files) => {
        // Add only non-duplicate files to the selectedImages state
        const uniqueFiles = files.filter(
          (file) =>
            !selectedImages.forValue.some(
              (selectedFile) => selectedFile.name === file.name
            )
        );

        setSelectedImages((prevImages) => ({
          ...prevImages,
          forValue: [
            ...prevImages.forValue,
            ...base64Files.map((base64, index) => ({
              name: uniqueFiles[index].name,
              base64,
            })),
          ],
        }));

        // Update form value
        const updatedImages = selectedImages.forValue.concat(
          base64Files.map((base64, index) => ({
            name: uniqueFiles[index].name,
            base64,
          }))
        );
        form.setValue("images", updatedImages);
      })
      .catch((error) => {
        console.error("Error reading files:", error);
      });
  };

  console.log(selectedImages, "selectedImages");
  // Function to read file as base64 string
  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    console.log(values, "selectedImages");
    const response = await createThread({
      text: repost
        ? `${values.thread}
      
      
      ---(original post by ${author} in ${
            community ? +community + "Community" : ""
          })     
      `
        : values.thread,
      author: userData._id,
      communityId: organization ? organization.organization?.id || "" : null,
      path: pathname,
      files: selectedImages.forValue,
    });

    router.push("/");
  };

  //handle and convert it in base 64
  const handleImage = (e) => {
    const file = e.target.files[0];
    setFileToBase(file);
    console.log(file);
  };

  const handleItemDelete = (index) => {
    const newImages = selectedImages.forPreview.filter(
      (image, i) => i !== index
    );
    const valueImages = selectedImages.forValue.filter(
      (image, i) => i !== index
    );
    setSelectedImages((prevImages) => ({
      ...prevImages,
      forPreview: newImages,
      forValue: valueImages,
    }));
    const updatedImages = selectedImages.forValue.filter(
      (image, i) => i !== index
    );
    form.setValue("images", updatedImages);
    toast({
      description: "Image deleted",
    });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className=" mt-10 text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={15}
                  placeholder="Enter your post"
                  className="no-focus border border-dark-4 bg-dark-3 text-light-1"
                  {...field}
                  value={field.value}
                  defaultValue={repost ? content : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className=" mt-10 text-base-semibold text-light-2">
                Images
              </FormLabel>
              <FormControl>
                <>
                  <Label htmlFor="picture">Pictures</Label>
                  <Input
                    {...field}
                    id="picture"
                    type="file"
                    multiple // Allow multiple file selection
                    onChange={handleImageChange} // Handle file change event
                    value={undefined}
                    accept="image/*" // Accept only image files
                  />
                </>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {selectedImages.forPreview.length > 0 && (
          <div className="flex justify-center">
            <Carousel className="w-full max-w-xs align-middle">
              <CarouselContent>
                {selectedImages.forPreview.map((file, index) => (
                  <CarouselItem key={index}>
                    <div className="flex justify-end">
                      <Image
                        src="/assets/delete.svg"
                        alt="delte"
                        width={18}
                        height={18}
                        className="cursor-pointer object-contain "
                        onClick={() => {
                          handleItemDelete(index);
                        }}
                      />
                    </div>
                    <Image
                      className="rounded-md my-4 "
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`Image ${index + 1}`}
                      width={500}
                      height={300}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious type="button" />
              <CarouselNext type="button" />
            </Carousel>
          </div>
        )}

        {repost && (
          <p className="text-light-1">
            Original by {author}{" "}
            {community && (
              <span>
                in <b>{community} Community</b>
              </span>
            )}
          </p>
        )}

        <Button type="submit" className="bg-primary-500">
          Post Thread
        </Button>
      </form>
    </Form>
  );
}

export default PostThread;
