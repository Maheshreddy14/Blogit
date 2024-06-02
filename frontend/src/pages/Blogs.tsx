import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import { Skeleton } from "../components/Skeleton";
import { useBlogs } from "../hooks";

export const Blogs=()=>{
    const {loading,blogs}=useBlogs();
    if (loading) {
        return <div>
            <Appbar /> 
            <div  className="flex justify-center">
                <div>
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                </div>
            </div>
        </div>
    }
    return <div>
    <Appbar/>
    <div className="flex justify-center">
        <div className="max-w-xl">
            {blogs.map(blog =>
            <BlogCard
                id={blog.id}
                authorName={blog.author.username}
                title={blog.title}
                content={blog.content}
                publishedDate="24th December 2023" />
            )}
        </div>
    </div>
    </div>
}