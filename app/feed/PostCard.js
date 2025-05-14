"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

export default function PostCard({ post }) {
  const { data: session } = useSession();

  return (
    <div className="card bg-base-100 w-full lg:w-full shadow-sm">
      {" "}
      {/* Responsive width */}
      <div className="card card-side bg-base-100 shadow-sm flex-col lg:flex-row">
        {" "}
        {/* Stack on mobile, side-by-side on desktop */}
        <div className="card-body">
          <div className="flex justify-between items-center mb-2">
            <div className="flex horizontal">
              <Image
                src="/images/apple-icon.png"
                alt="test avatar"
                width={20}
                height={20}
                className="w-5 h-5" // Fixed size
              />
              <h6 className="card-title text-sm lg:text-base">lionsgate</h6>
            </div>
            <div>
              <p className="text-sm">14 days ago</p>
            </div>
          </div>

          <Image
            src="/images/post_image.webp"
            alt="Post content"
            width={600} // Set actual image width
            height={400} // Set actual image height
            className="rounded-xl w-full h-auto"
            priority={false} // Set to true if above the fold
          />

          <p className="text-sm lg:text-base">
            {" "}
            {/* Responsive text */}
            Lorem ipsum dolor sit amet consectetur adipisicing elit Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsam, quia pariatur laboriosam qui, saepe fugiat nihil doloremque sequi labore sint nam. Fugiat modi iusto totam pariatur, officiis excepturi consectetur autem. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi libero maxime assumenda quibusdam itaque ab perferendis, ducimus sed quaerat numquam minima cum officiis quod dignissimos aliquam unde fuga repellat quos.
          </p>

          <div className="card-actions self-center mt-3">
            <button className="btn btn-primary btn-sm lg:btn-md">
              {" "}
              {/* Responsive button */}
              Add Bond
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
