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
  private mode = 'create';
  private postId!: string | null;
  private post!: Post;

  constructor(public postService: PostService, 
    public route: ActivatedRoute) {}

  ngOnInit() {
      this.route.paramMap.subscribe(
        (paramMap: ParamMap) => {
          if (paramMap.has('postId')) {
            this.mode = 'edit';
            this.postId = paramMap.get('postId');
            this.post = this.postService.getPostById(this.postId);
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
    this.postService.addPost(form.value.title, form.value.content);

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
