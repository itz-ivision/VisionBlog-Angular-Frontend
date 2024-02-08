import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

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

  posts: Post[] = [];
  totalPosts = 0;
  postsPerPage = 3;
  currentPage = 1;
  pageSizeOptions = [1, 2, 3, 10];
  isLoading = false;
  private postsSubscription!: Subscription;

  constructor(public postService: PostService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSubscription = this.postService.getUpdatedPostsListner()
      .subscribe(
        (data: {posts: Post[], postsCount: number}) => {
          this.isLoading = false;
          this.totalPosts = data.postsCount;
          this.posts = data.posts;
        }
      );
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(
      () => {
        this.postService.getPosts(this.postsPerPage, this.currentPage);
      }
    );
  }

  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
  }
}
