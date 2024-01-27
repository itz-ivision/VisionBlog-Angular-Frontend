import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{

  // posts = [
  //   {
  //     title: "Har Har Mahadev",
  //     content: "Mahadev Is Love"
  //   },
  //   {
  //     title: "Jai Shri Ram",
  //     content: "Ram Is Love"
  //   },
  //   {
  //     title: "Jai Hanuman",
  //     content: "Hanuman Is Love"
  //   }
  // ]

  @Input() posts: Post[] = [];
  private postsSubscription!: Subscription;

  constructor(public postService: PostService) {}

  ngOnInit() {
    this.posts = this.postService.getPosts();
    this.postsSubscription = this.postService.getUpdatedPostsListner()
      .subscribe(
        (posts: Post[]) => {
          this.posts = posts;
        }
      );
  }

  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
  }
}
