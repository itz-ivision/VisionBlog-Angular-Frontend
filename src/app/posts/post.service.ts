import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class PostService {
    
    private posts: Post[] = [];
    private updaedPostList = new Subject<Post[]>();
    // responseMessage = '';

    BASE_API_URL="http://localhost:3000/api/v1"

    constructor(private http: HttpClient, private router: Router) {}

    getPosts() {
        this.http.get<{message: string, data: Post[]}>(
            "http://localhost:3000/api/v1/posts/"
        ).pipe(
            tap(
                responseDataata => {
                    if (!responseDataata.data || !Array.isArray(responseDataata.data)) {
                        console.log("No posts ")
                        throw new Error("Invalid response structure: posts property is missing or not an array.");
                    }
                }
            ), 
            map(
                (responseDataata) => {
                    return responseDataata.data.map(
                        (post) => {
                            return {
                                _id: post._id,
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
                // console.log("Transformed Posts : ",transformedPosts);
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
        const post: Post = {_id : '', title, content}
        this.http.post<{ message: string }>("http://localhost:3000/api/v1/posts/", post)
            .subscribe(
                (responseData) => {
                    if (responseData) {
                        this.posts.push(post);
                        this.updaedPostList.next([...this.posts]);
                        this.router.navigate(["/"]);
                    }
                }
            );
    }

    getPostById(id: string | null) {
        return this.http.get(
            "http://localhost:3000/api/v1/posts/"+ id,
        );
    }

    updatePostById(id: string, title: string, content: string) {
        const post: Post = { _id: id, title: title, content: content};
        this.http.put(
            "http://localhost:3000/api/v1/posts/"+ id,
            post
        ).subscribe(
            (response) => {
                const updatedPosts = [...this.posts];
                const oldPostIndex = updatedPosts.findIndex(
                    resPost => resPost._id === post._id);
                updatedPosts[oldPostIndex] = post;
                this.posts = updatedPosts;
                this.updaedPostList.next([...this.posts]);
                this.router.navigate(["/"]);
            }
        )
    }

    deletePost(postId: string) {
        this.http.delete(
            "http://localhost:3000/api/v1/posts/"+ postId)
            .subscribe(
                () => {
                    const updatedPost = this.posts.filter(
                        post => post._id !== postId);
                    this.posts = updatedPost;
                    this.updaedPostList.next([...this.posts]);
                }
            )
    }

}