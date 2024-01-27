import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PostService {
    
    private posts!: Post[];
    private updaedPostList = new Subject<Post[]>();

    getPosts() {
        return [...this.posts];
    }

    getUpdatedPostsListner() {
        return this.updaedPostList.asObservable();
    }

    addPost(post: Post) {
        this.posts.push(post);
        this.updaedPostList.next([...this.posts]);
    }

}