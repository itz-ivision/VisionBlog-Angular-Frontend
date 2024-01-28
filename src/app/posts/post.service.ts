import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class PostService {
    
    private posts: Post[] = [];
    private updaedPostList = new Subject<Post[]>();
    // responseMessage = '';

    BASE_API_URL="http://localhost:3000/api/v1"

    constructor(private http: HttpClient) {}

    getPosts() {
        this.http.get<{message: string, posts: Post[]}>(
            "http://localhost:3000/api/v1/posts/"
        ).pipe(
            map(
                (data) => {
                    // console.log("Response data : ",data);
                    return data.posts.map(
                        (post) => {
                            console.log("Post : ", post)
                            return {
                                title: post.title,
                                content: post.content
                            }
                        }
                    )
                }
            ),
            catchError(error => {
                console.error('Error:', error);
                return of([]);
            })
        ).subscribe(
            (transformedPosts) => {
                console.log("Transformed Posts : ",transformedPosts);
                this.posts = transformedPosts;
                this.updaedPostList.next([...this.posts]);
            }
        )
        // TODO: Debug listing all posts
    }

    getUpdatedPostsListner() {
        return this.updaedPostList.asObservable();
    }

    addPost(title: string, content: string) {
        const post: Post = {title, content}
        this.http.post<{ message: string }>("http://localhost:3000/api/v1/posts/", post)
            .subscribe(
                (responseData) => {
                    if (responseData) {
                        this.posts.push(post);
                        this.updaedPostList.next([...this.posts]);
                    }
                }
            );
    }

    deletePost(postId: string) {
        this.http.delete(
            "http://localhost:3000/api/v1/posts/"+ postId)
            .subscribe(
                // TODO: after deleting a post update the list of posts. 
            )
    }

}