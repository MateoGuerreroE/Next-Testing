"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Profile from "@components/Profile";

function ProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchSelfInfo = async () => {
      const response = await fetch(`/api/users/${(session as any)?.id}/posts`); //!
      const data = await response.json();
      setPosts(data);
    };
    if ((session as any)?.id) fetchSelfInfo(); //!
  }, []);

  const handleEdit = (post: any) => {
    router.push(`/update-prompt?id=${post._id}`);
  };
  const handleDelete = async (post: any) => {
    //!
    const hasConfirmed = confirm("Are you sure you want to delete this promt?");
    if (hasConfirmed) {
      try {
        await fetch(`api/prompt/${post._id.toString()}`, { method: "DELETE" });
        const filteredPosts = posts.filter((p: any) => p._id !== post._id); //!
        setPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile page"
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
}

export default ProfilePage;
