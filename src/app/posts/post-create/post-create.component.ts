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

  title= "";
  content = "";
  post!: Post;
  private mode = 'create';
  private postId!: string | null;

  constructor(public postService: PostService, 
    public route: ActivatedRoute) {}

    ngOnInit() {
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        this.postId = paramMap.get('postId');
        if (paramMap.has('postId') && this.postId) {
          this.mode = 'edit';
          this.postService.getPostById(this.postId).subscribe(
            (data) => {
              console.log(data.valueOf());
              // this.post = {_id: postData._id, title: postData.title, content: postData.content}; 
            }
          );
        } else {
          this.mode = 'create';
          this.postId = null;
        }
      });
    }

    onAddPost(form: NgForm) {
      if (form.invalid) {
        alert('Please enter valid data to add post.');
        return;
      }
  
      const { title: postTitle, content: postContent } = form.value;
  
      if (postTitle && postContent) {
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
