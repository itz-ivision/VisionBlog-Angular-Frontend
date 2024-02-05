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

    getPosts(postPerPage: number, currentPage: number) {

        const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
        this.http.get<{message: string, data: Post[]}>(
            "http://localhost:3000/api/v1/posts/" + queryParams
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
                    console.log(responseDataata);
                    return responseDataata.data.map(
                        (post) => {
                            return {
                                _id: post._id,
                                title: post.title,
                                content: post.content,
                                imagePath: post.imagePath
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
    }

    getUpdatedPostsListner() {
        return this.updaedPostList.asObservable();
    }

    addPost(title: string, content: string, image: File) {

        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        // postData.append('image', image, image.name);
        if (image && image.name) {
            postData.append('image', image, image.name);
        }

        this.http.post<{ message: string; post: Post }>(
            "http://localhost:3000/api/v1/posts/", 
            postData)
            .subscribe(
                (responseData) => {
                    const post: Post = {
                        _id : responseData.post._id, 
                        title: title,
                        content: content,
                        imagePath: responseData.post.imagePath
                    }
                    if (responseData) {
                        this.posts.push(post);
                        this.updaedPostList.next([...this.posts]);
                        this.router.navigate(["/"]);
                    }
                }
            );
    }

    getPostById(id: string) {
        return this.http.get<{ id: string, title: string, content: string, imagePath: string}>(
            "http://localhost:3000/api/v1/posts/"+ id,
        );
    }

    updatePostById(id: string, title: string, content: string, image: File | string) {

        let postData: Post | FormData;
        if (typeof(image) === 'object') {
            postData = new FormData();
            postData.append('_id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image, image.name);

        } else {
            postData = {
                _id: id,
                title: title,
                content: content,
                imagePath: image
            }
        }

        this.http.put(
            "http://localhost:3000/api/v1/posts/"+ id,
            postData
        ).subscribe(
            (response) => {
                const updatedPosts = [...this.posts];
                const oldPostIndex = updatedPosts.findIndex(
                    resPost => resPost._id === id);
                const post: Post = {
                    _id: id,
                    title: title,
                    content: content,
                    imagePath: 'response.imagePath'
            
                }
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