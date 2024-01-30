import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{

  postTitle= "";
  postContent = "";
  post!: Post;
  private mode = 'create';
  private postId!: string | null;

  constructor(public postService: PostService, 
    public route: ActivatedRoute) {}

  ngOnInit() {
      this.route.paramMap.subscribe(
        (paramMap: ParamMap) => {
          if (paramMap.has('postId') && this.postId !== null) {
            this.mode = 'edit';
            this.postId = paramMap.get('postId');
            this.postService.getPostById(this.postId).subscribe(
              (postData) => {
                console.log(postData);
                // this.post = {_id: postData._id, title: postData.title, content: postData.content}; 
              }
            );
          } else {
            this.mode = 'create';
            this.postId = null;
          }
        }
      );
  }

  onAddPost(form: NgForm) {

    if (form.invalid) {
      alert("Please enter valid data to add post.");
      return;
    }
    
    const postTitle: string = form.value.title;
    const postContent: string = form.value.content;

    if (postTitle != null && postContent != null) {
      if (this.mode === 'create') {
        this.postService.addPost(postTitle, postContent);
      } else if (this.mode === 'edit' && this.postId) {
        this.postService.updatePostById(this.postId, postTitle, postContent);
      }
    }

    form.resetForm();
  }

  // getErrorMessage() {
  //   if(this.postTitle.hasError('required') && (this.postContent.hasError('required'))) {
  //     return "You must enter a valid value to add post."
  //   }
  // }

  getErrorMessage () {
    return "You must enter a valid title and content to add post."
  }

}
